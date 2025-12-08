
import React, { useState } from 'react';
import { usePrompting } from '../hooks/usePrompting';
import { KeyManager } from './KeyManager';
import { StatusCard } from './StatusCard';
import { UploadIcon, YoutubeIcon, WhatsappIcon } from './Icons';
import { exportRunwayCSV, exportDescribeTXT } from '../utils/exportUtils';
import { PromptResult } from '../App';

interface Props {
    apiKeys: string[];
    addApiKey: (k: string) => void;
    deleteApiKey: (k: string) => void;
}

export const PromptingView: React.FC<Props> = ({ apiKeys, addApiKey, deleteApiKey }) => {
    const { 
        mode, setMode, files, results, uploadStatus, 
        isProcessing, procPercent, procCount, totalCount,
        fileInputRef, processFiles, runAnalysis, clearAll 
    } = usePrompting(apiKeys);

    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
    };

    const copyToClipboard = (txt: string, btnId: string) => {
        navigator.clipboard.writeText(txt);
        const btn = document.getElementById(btnId);
        if(btn) {
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
            setTimeout(() => { btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`; }, 1500);
        }
    };

    const RenderResultCard = (res: PromptResult) => {
        const fileItem = files.find(f => f.uniqueId === res.uniqueId);
        if (!fileItem) return null;

        const imgSrc = `data:${fileItem.isSvg ? 'image/svg+xml' : 'image/jpeg'};base64,${fileItem.previewBase64}`;

        const Box = ({ label, txt, color }: any) => {
            const btnId = `btn-${Math.random().toString(36).substr(2, 9)}`;
            return (
                <div className="prompt-wrapper">
                    <span className="prompt-label" style={{ color }}>{label}</span>
                    <div className="prompt-box">
                        <p className="prompt-text">{txt}</p>
                        <button id={btnId} className="copy-btn-icon" onClick={() => copyToClipboard(String(txt), btnId)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                </div>
            );
        };

        return (
            <div className="res-card" key={res.uniqueId}>
                <div className="res-img-col">
                    <img src={imgSrc} className="res-img" alt="preview" />
                </div>
                <div className="res-content-col">
                    {mode === 'runway' ? (
                        <>
                            <Box label="LOW MOTION" txt={res.low} color="var(--accent-pink)" />
                            <Box label="MEDIUM MOTION" txt={res.medium} color="var(--accent-pink)" />
                            <Box label="HIGH MOTION" txt={res.high} color="var(--accent-pink)" />
                        </>
                    ) : (
                        <Box label="CAPTION" txt={res.description} color="#38bdf8" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div id="view-prompting" className="view-section active-view">
            <div id="studio-header-section" className="text-anim-enter">
                <div className="powered-tag" style={{display:'flex', gap:'12px'}}>
                    <div className="dot"></div> Powered by Moin Datori
                    <a href="https://youtube.com/channel/UC7otDLkBsEsMstspQN6FpWw/" target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', color:'var(--accent-cyan)'}}>
                        <YoutubeIcon />
                    </a>
                    <a href="https://chat.whatsapp.com/F022Xf2DFAr3seGowwlUN5" target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', color:'var(--accent-cyan)'}}>
                        <WhatsappIcon />
                    </a>
                </div>
                <h1>Runway <span className="highlight">Video Prompts</span></h1>
                <p style={{marginTop:'16px', color:'var(--text-muted)'}}>Generate fine-tuned cinematic Runway ML video prompts.</p>
            </div>

            <div className="main-card">
                <div className="tabs-header">
                    <button className={`tab-btn ${mode === 'runway' ? 'active' : ''}`} onClick={() => setMode('runway')}>Runway Video Prompt</button>
                    <button className={`tab-btn ${mode === 'describe' ? 'active' : ''}`} onClick={() => setMode('describe')}>Describe Image</button>
                </div>
                <div className="card-body">
                    <div className="left-panel">
                        <input type="file" ref={fileInputRef} multiple accept="image/*" style={{display:'none'}} onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))} />
                        <div 
                            id="dropzone-prompt" 
                            className={`dropzone ${dragOver ? 'dragover' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                        >
                            <div className="upload-circle-btn"><UploadIcon /></div>
                            <div className="upload-title">Add Images</div>
                            <div className="upload-subtitle">Drag and drop or click to browse</div>
                            <div className="upload-meta-line">
                                <div className="upload-meta-item">JPEG, PNG, GIF, WebP</div>
                            </div>
                            {uploadStatus && <div style={{marginTop:'10px', fontSize:'12px', color:'var(--accent-cyan)'}}>{uploadStatus}</div>}
                        </div>
                        <div className="preview-area">
                            {files.map(f => (
                                <div key={f.uniqueId} className={`preview-item ${f.isSvg ? 'checker-bg' : ''}`}>
                                    <img src={`data:${f.isSvg ? 'image/svg+xml' : 'image/jpeg'};base64,${f.previewBase64}`} className="preview-img" alt="p" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right-panel">
                        <div className="config-section">
                            <div className="label">AI Model</div>
                            <div className="input-wrapper"><span style={{fontSize:'13px', fontWeight:500}}>Gemini 2.5 Flash</span></div>
                        </div>
                        <div className="config-section">
                            <div className="label">Output Configuration</div>
                            <div className="input-wrapper"><span style={{fontSize:'13px', color:'var(--text-muted)'}}>{mode === 'runway' ? 'Low / Mid / High' : 'Detailed Caption'}</span></div>
                        </div>
                        
                        <KeyManager apiKeys={apiKeys} addApiKey={addApiKey} deleteApiKey={deleteApiKey} idSuffix="prompt" />
                        
                        {!isProcessing ? (
                            <>
                                <button id="run-btn-prompt" className="run-btn" onClick={() => runAnalysis(false)}>
                                    {mode === 'runway' ? 'RUN ANALYSIS' : 'GENERATE DESCRIPTION'}
                                </button>
                                {files.some(f => f.failed) && (
                                    <button className="run-btn" style={{background:'var(--accent-red)', marginTop:'10px'}} onClick={() => runAnalysis(true)}>RETRY FAILED ITEMS</button>
                                )}
                            </>
                        ) : (
                            <StatusCard percent={procPercent} count={procCount} total={totalCount} isMeta={false} />
                        )}

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* EXPORT BUTTONS RESTORED: Removed !isProcessing check so they are always visible if results exist */}
                            {results.length > 0 && (
                                <>
                                    {mode === 'runway' && results.some(r => r.type === 'runway') && (
                                        <button className="export-btn-ghost" onClick={() => exportRunwayCSV(results)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export Runway CSV
                                        </button>
                                    )}
                                    {mode === 'describe' && results.some(r => r.type === 'describe') && (
                                        <button className="export-btn-ghost" onClick={() => exportDescribeTXT(results)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Export Descriptions TXT
                                        </button>
                                    )}
                                </>
                            )}
                            <button className="global-clear-btn-footer" onClick={clearAll}>Clear All Data</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="results-feed-prompt">
                {results.map(r => RenderResultCard(r))}
            </div>
        </div>
    );
};
