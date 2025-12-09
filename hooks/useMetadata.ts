
import { useState, useRef } from 'react';
import { FileItem, MetaResult } from '../App';
import { generateMetadata } from '../services/metadata';
import { resizeImage, extractVideoFrame, readSvgAsBase64 } from '../utils/imageUtils';

export const useMetadata = (apiKeys: string[]) => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [results, setResults] = useState<MetaResult[]>([]);
    const [uploadStatus, setUploadStatus] = useState('');

    // Settings
    const [titleLen, setTitleLen] = useState(150);
    const [kwCount, setKwCount] = useState(45);
    const [isSilhouette, setIsSilhouette] = useState(false);
    const [isWhiteBg, setIsWhiteBg] = useState(false);
    const [isTransparent, setIsTransparent] = useState(false);
    const [isSingleWord, setIsSingleWord] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [prohibitedWords, setProhibitedWords] = useState('');

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [procPercent, setProcPercent] = useState(0);
    const [procCount, setProcCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState('0s');

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
                    uniqueId,
                    failed: false
                };

                setFiles(prev => [...prev, newItem]);
                await new Promise(r => setTimeout(r, 50));
            } catch (err) {
                console.error(err);
            }
        }
        setUploadStatus('');
    };

    const removeFile = (uniqueId: number) => {
        setFiles(prev => prev.filter(f => f.uniqueId !== uniqueId));
        setResults(prev => prev.filter(r => r.uniqueId !== uniqueId));
    };

    const runMetadata = async (isRetry = false) => {
        if (apiKeys.length === 0) return alert('Enter API Key(s)');
        if (files.length === 0) return alert('Upload Assets');

        setIsProcessing(true);
        setProcPercent(0);
        setSuccessCount(0);
        setFailedCount(0);

        // Determine which files to process
        const listToProcess = isRetry ? files.filter(f => f.failed) : files;
        
        if (listToProcess.length === 0) {
            setIsProcessing(false);
            return alert("No failed items to retry.");
        }

        setTotalCount(listToProcess.length);
        setProcCount(0);
        
        const startTime = Date.now();
        let processedCount = 0;
        let sCount = 0;
        let fCount = 0;

        // BATCH CONFIGURATION for Gemini 2.5 Flash
        // Much higher throughput possible. We use 10 concurrent requests every 2 seconds.
        const BATCH_SIZE = 10;
        const BATCH_DELAY = 2000;

        for (let i = 0; i < listToProcess.length; i += BATCH_SIZE) {
            const batch = listToProcess.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (item, idx) => {
                const key = apiKeys[(i + idx) % apiKeys.length];
                try {
                    // Call specific Metadata Service
                    const data = await generateMetadata(item.previewBase64, key, {
                        titleLen, kwCount, isSilhouette, isWhiteBg, 
                        isTransparent, isSingleWord, customPrompt, 
                        prohibitedWords, isEps: item.isEps, filename: item.originalFile.name
                    });

                    if (data && data.title) {
                        setResults(prev => [{
                            filename: item.originalFile.name,
                            title: data.title,
                            keywords: data.keywords,
                            categories: data.category_id,
                            uniqueId: item.uniqueId
                        }, ...prev]);
                        
                        sCount++;
                        
                        // Update File State: Success
                        setFiles(prev => prev.map(f => 
                            f.uniqueId === item.uniqueId ? { ...f, failed: false, errorCode: undefined } : f
                        ));
                    } else {
                        throw new Error("Invalid Response");
                    }
                } catch (e: any) {
                    console.error(e);
                    fCount++;
                    
                    // Update File State: Failed
                    setFiles(prev => prev.map(f => 
                        f.uniqueId === item.uniqueId ? { ...f, failed: true, errorCode: e.message } : f
                    ));

                    setResults(prev => [{
                        filename: item.originalFile.name,
                        title: "Error",
                        keywords: e.message,
                        categories: 0,
                        uniqueId: item.uniqueId
                    }, ...prev]);
                }

                processedCount++;
                setProcCount(processedCount);
                setProcPercent(Math.round((processedCount / listToProcess.length) * 100));
                setSuccessCount(sCount);
                setFailedCount(fCount);

                const elapsed = (Date.now() - startTime) / 1000;
                const rate = processedCount / elapsed;
                const remaining = (listToProcess.length - processedCount) / rate;
                setTimeRemaining(remaining > 0 ? Math.ceil(remaining) + 's' : '0s');
            }));

            // Safety delay to respect rate limits
            if (i + BATCH_SIZE < listToProcess.length) {
                await new Promise(r => setTimeout(r, BATCH_DELAY));
            }
        }
        setIsProcessing(false);
    };

    const clearAll = () => {
        if (confirm('Are you sure you want to clear all Metadata?')) {
            setFiles([]);
            setResults([]);
            setUploadStatus('');
            setProcPercent(0);
        }
    };

    return {
        files, results, uploadStatus,
        isProcessing, procPercent, procCount, totalCount, successCount, failedCount, timeRemaining,
        fileInputRef, processFiles, removeFile, runMetadata, clearAll,
        // Settings Props
        titleLen, setTitleLen,
        kwCount, setKwCount,
        isSilhouette, setIsSilhouette,
        isWhiteBg, setIsWhiteBg,
        isTransparent, setIsTransparent,
        isSingleWord, setIsSingleWord,
        customPrompt, setCustomPrompt,
        prohibitedWords, setProhibitedWords
    };
};
