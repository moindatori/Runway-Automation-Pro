
import { useState, useRef } from 'react';
import { FileItem, PromptResult } from '../App';
import { generateRunwayPrompts } from '../services/runway';
import { generateImageDescription } from '../services/describe';
import { resizeImage, extractVideoFrame, readSvgAsBase64 } from '../utils/imageUtils';

export const usePrompting = (apiKeys: string[]) => {
    const [mode, setMode] = useState<'runway' | 'describe'>('runway');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [results, setResults] = useState<PromptResult[]>([]);
    const [uploadStatus, setUploadStatus] = useState('');
    
    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [procPercent, setProcPercent] = useState(0);
    const [procCount, setProcCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = async (fileList: File[]) => {
        for (const file of fileList) {
            setUploadStatus(`Processing ${file.name}...`);
            try {
                let base64: string | null = null;
                const isVideo = file.type.startsWith('video/');
                const isSvg = file.type.includes('svg');
                const isEps = file.name.toLowerCase().endsWith('.eps');
                const uniqueId = Date.now() + Math.random();

                if (isVideo) base64 = await extractVideoFrame(file);
                else if (isSvg) base64 = await readSvgAsBase64(file);
                else if (!isEps) base64 = await resizeImage(file, 250);

                const newItem: FileItem = {
                    originalFile: file,
                    isVideo, isSvg, isEps,
                    previewBase64: base64,
                    uniqueId
                };

                setFiles(prev => [...prev, newItem]);
                await new Promise(r => setTimeout(r, 50)); 
            } catch (err) {
                console.error(err);
            }
        }
        setUploadStatus('');
    };

    const runAnalysis = async (isRetry = false) => {
        if (apiKeys.length === 0) return alert('Enter API Key(s)');
        if (files.length === 0) return alert('Upload Image');

        setIsProcessing(true);
        setProcPercent(0);
        
        const listToProcess = isRetry ? files.filter(f => f.failed) : files;
        setTotalCount(listToProcess.length);
        setProcCount(0);
        let processedCount = 0;

        // BATCH CONFIGURATION FOR FREE TIER SAFETY
        // Reduced from 5 to 3 to avoid HTTP 429 errors
        const BATCH_SIZE = 3; 
        const BATCH_DELAY = 4000; 

        for (let i = 0; i < listToProcess.length; i += BATCH_SIZE) {
            const batch = listToProcess.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async (item, idx) => {
                if (item.isVideo) return; 

                const key = apiKeys[(i + idx) % apiKeys.length];
                try {
                    const data = item.previewBase64;
                    let resultItem: PromptResult;

                    if (mode === 'runway') {
                        // Call specific Runway Service
                        const runwayData = await generateRunwayPrompts(data, key);
                        resultItem = {
                            filename: item.originalFile.name,
                            type: 'runway',
                            low: runwayData.low,
                            medium: runwayData.medium,
                            high: runwayData.high,
                            uniqueId: item.uniqueId
                        };
                    } else {
                        // Call specific Describe Service
                        const descText = await generateImageDescription(data, key);
                        resultItem = {
                            filename: item.originalFile.name,
                            type: 'describe',
                            description: descText,
                            uniqueId: item.uniqueId
                        };
                    }

                    setResults(prev => {
                        const filtered = prev.filter(r => r.uniqueId !== item.uniqueId);
                        return [resultItem, ...filtered];
                    });
                    item.failed = false;

                } catch (e: any) {
                    item.failed = true;
                    item.errorCode = e.message;
                    setResults(prev => {
                         const filtered = prev.filter(r => r.uniqueId !== item.uniqueId);
                         return [{
                            filename: item.originalFile.name,
                            type: mode,
                            description: `Error: ${e.message}`,
                            uniqueId: item.uniqueId
                        }, ...filtered];
                    });
                }
                
                processedCount++;
                setProcCount(processedCount);
                setProcPercent(Math.round((processedCount / listToProcess.length) * 100));
            }));

            // Safety delay to respect rate limits
            if (i + BATCH_SIZE < listToProcess.length) {
                await new Promise(r => setTimeout(r, BATCH_DELAY));
            }
        }
        setIsProcessing(false);
    };

    const clearAll = () => {
        if (confirm('Are you sure you want to clear all Prompting data?')) {
            setFiles([]);
            setResults([]);
            setUploadStatus('');
            setProcPercent(0);
        }
    };

    return {
        mode, setMode,
        files, results,
        uploadStatus,
        isProcessing, procPercent, procCount, totalCount,
        fileInputRef,
        processFiles,
        runAnalysis,
        clearAll
    };
};
