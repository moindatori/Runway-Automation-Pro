import React, { useState } from 'react';
import { useMetadata } from '../hooks/useMetadata';
import { KeyManager } from './KeyManager';
import { StatusCard } from './StatusCard';
import { UploadIcon, FileIcon, YoutubeIcon, WhatsappIcon } from './Icons';
import { exportMetaCSV } from '../utils/exportUtils';
import { MetaResult } from '../App';

interface Props {
    apiKeys: string[];
    addApiKey: (k: string) => void;
    deleteApiKey: (k: string) => void;
}

export const MetadataView: React.FC<Props> = ({ apiKeys, addApiKey, deleteApiKey }) => {
    const {
        files, results, uploadStatus,
        isProcessing, procPercent, procCount, totalCount, successCount, failedCount, timeRemaining,
        fileInputRef, processFiles, removeFile, runMetadata, clearAll,
        titleLen, setTitleLen, kwCount, setKwCount,
        isSilhouette, setIsSilhouette, isWhiteBg, setIsWhiteBg, isTransparent, setIsTransparent,
        isSingleWord, setIsSingleWord, customPrompt, setCustomPrompt, prohibitedWords, setProhibitedWords
    } = useMetadata(apiKeys);

    const [dragOver, setDragOver] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);
    const [isProhibitedOpen, setIsProhibitedOpen] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
    };

    const getSliderStyle = (val: number, min: number, max: number) => {
        const percent = ((val - min) / (max - min)) * 100;
        return { background: `linear-gradient(to right, var(--slider-fill) ${percent}%, var(--slider-track) ${percent}%)` };
    };

    const copyToClipboard = (txt: string, btnId: string) => {
        navigator.clipboard.writeText(txt);
        const btn = document.getElementById(btnId);
        if(btn) {
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
            setTimeout(() => { btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`; }, 1500);
        }
    };

    const RenderResultCard = (res: MetaResult) => {
        const fileItem = files.find(f => f.uniqueId === res.uniqueId);
        if (!fileItem) return null;

        const imgSrc = fileItem.previewBase64 
            ? `data:${fileItem.isSvg ? 'image/svg+xml' : 'image/jpeg'};base64,${fileItem.previewBase64}`
            : '';

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
                    {fileItem.isEps ? (
                        <div style={{width:'100%', height:'100%', background:'#222', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'12px'}}>EPS</div>
                    ) : (
                        <img src={imgSrc} className="res-img" alt="preview" />
                    )}
                </div>
                <div className="res-content-col">
                    <Box label="TITLE" txt={res.title} color="#06b6d4" />
                    <Box label="KEYWORDS" txt={res.keywords} color="#06b6d4" />
                    <Box label="CATEGORY ID" txt={res.categories} color="#06b6d4" />
                </div>
            </div>
        );
    };

    return (
        <div id="view-metadata" className="view-section active-view">
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
                <h1>Generate <span className="highlight-blue">Metadata</span></h1>
                <p style={{marginTop:'16px', color:'var(--text-muted)'}}>AI-Powered Titles, Keywords & Categories for Stock Assets.</p>
            </div>

            <div className="main-card">
                <div className="meta-grid">
                    <div className="left-panel">
                        <input type="file" ref={fileInputRef} multiple accept="image/*,video/*,.svg,.eps" style={{display:'none'}} onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))} />
                        <div 
                            id="dropzone-meta" 
                            className={`dropzone ${dragOver ? 'dragover' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                        >
                            <div className="upload-circle-btn"><UploadIcon /></div>
                            <div className="upload-title">Add More Images</div>
                            <div className="upload-subtitle">Drag and drop more images or click to browse</div>
                            <div className="upload-meta-line">
                                <div className="upload-meta-item">JPEG, PNG, SVG, Video</div>
                            </div>
                            {uploadStatus && <div style={{marginTop:'10px', fontSize:'12px', color:'var(--accent-cyan)'}}>{uploadStatus}</div>}
                        </div>
                        
                        <div id="preview-area-meta" className="preview-area">
                            {files.length > 0 && (
                                <div className="file-list-header">
                                    <div className="file-list-title"><FileIcon /> Uploaded Files ({files.length})</div>
                                    <button className="file-list-clear" onClick={clearAll}>Clear All</button>
                                </div>
                            )}
                            {files.map(f => (
                                <div key={f.uniqueId} className="preview-item">
                                    {f.isEps ? <div className="eps-placeholder">EPS</div> : <img src={`data:image/jpeg;base64,${f.previewBase64}`} className="preview-img" alt="p"/>}
                                    <button className="mini-del-btn" onClick={(e) => { e.stopPropagation(); removeFile(f.uniqueId); }}>×</button>
                                    {f.isVideo && <div className="vid-badge">VID</div>}
                                </div>
                            ))}
                        </div>

                        <div className="meta-section-card">
                            <div className="label" style={{marginBottom:'16px', color:'var(--text-main)', fontSize:'14px'}}>CORE PARAMETERS</div>
                            <div className="slider-group">
                                <div className="slider-header"><span>Title Length</span><span className="slider-val">{titleLen} chars</span></div>
                                <input type="range" min="50" max="200" value={titleLen} step="10" onChange={(e) => setTitleLen(Number(e.target.value))} style={getSliderStyle(titleLen, 50, 200)} />
                            </div>
                            <div className="slider-group">
                                <div className="slider-header"><span>Keywords Count</span><span className="slider-val">{kwCount} keywords</span></div>
                                <input type="range" min="10" max="50" value={kwCount} step="5" onChange={(e) => setKwCount(Number(e.target.value))} style={getSliderStyle(kwCount, 10, 50)} />
                            </div>
                        </div>

                        <div className="config-section" style={{gap:0}}>
                            <div className={`settings-dropdown-header ${isSettingsOpen ? 'open' : ''}`} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                                <span>Settings</span>
                                <svg className="chevron-icon-settings" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                            <div className={`settings-list-wrapper ${isSettingsOpen ? 'open' : ''}`}>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">SILHOUETTE</div>
                                            <div className={`toggle-switch ${isSilhouette ? 'active' : ''}`} onClick={() => setIsSilhouette(!isSilhouette)}></div>
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">CUSTOM PROMPT</div>
                                            <div className={`toggle-switch ${isCustomPromptOpen ? 'active' : ''}`} onClick={() => setIsCustomPromptOpen(!isCustomPromptOpen)}></div>
                                        </div>
                                        <div className={`expandable-input ${isCustomPromptOpen ? 'open' : ''}`}>
                                            <input type="text" className="meta-input" placeholder="e.g. Focus on mood..." value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">White Background</div>
                                            <div className={`toggle-switch ${isWhiteBg ? 'active' : ''}`} onClick={() => setIsWhiteBg(!isWhiteBg)}></div>
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">Transparent Background</div>
                                            <div className={`toggle-switch ${isTransparent ? 'active' : ''}`} onClick={() => setIsTransparent(!isTransparent)}></div>
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">PROHIBITED WORDS</div>
                                            <div className={`toggle-switch ${isProhibitedOpen ? 'active' : ''}`} onClick={() => setIsProhibitedOpen(!isProhibitedOpen)}></div>
                                        </div>
                                        <div className={`expandable-input ${isProhibitedOpen ? 'open' : ''}`}>
                                            <input type="text" className="meta-input" placeholder="e.g. text, watermark..." value={prohibitedWords} onChange={(e) => setProhibitedWords(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label-row">
                                            <div className="setting-text">SINGLE WORD KEYWORDS</div>
                                            <div className={`toggle-switch ${isSingleWord ? 'active' : ''}`} onClick={() => setIsSingleWord(!isSingleWord)}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right-panel" style={{background:'var(--bg-input)'}}>
                        <KeyManager apiKeys={apiKeys} addApiKey={addApiKey} deleteApiKey={deleteApiKey} idSuffix="meta" />
                        <div className="label" style={{marginBottom:'12px', marginTop:'20px'}}>EXPORT PLATFORM</div>
                        <div className="platform-grid">
                            <div className="platform-card selected">
                                <div className="brand-icon"><svg viewBox="0 0 24 24"><path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-2.4l-1.4-4h-3.6l-1.4 4H6.4L12 9.4z"/></svg></div>
                                <div className="plat-name">Adobe</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M2 4l5 14 3-9 2 6 6-16h-4l-3 10-2-6-3 9-2-8z"/></svg></div>
                                 <div className="plat-name">Vecteezy</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M5 18h3v-7l3-3-3-3v2h-3z m6 0h3v-12h-3z m6 0h3v-12h-3z"/></svg></div>
                                 <div className="plat-name">123RF</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/></svg></div>
                                 <div className="plat-name">Freepik</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M4 4h10v4h-6v4h5v8h-9z"/></svg></div>
                                 <div className="plat-name">Pond5</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M4 4h8c4 0 8 4 8 8s-4 8-8 8h-8z m4 4v8h4c2 0 4-2 4-4s-2-4-4-4z"/></svg></div>
                                 <div className="plat-name">Deposit</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 8v8"/></svg></div>
                                 <div className="plat-name">Canva</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-1 15h-2v-6h2v6zm-1-7.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 7.5h-2v-3.5c0-1-.5-1.5-1.5-1.5s-1.5.5-1.5 1.5v3.5h-2v-6h2v1c.5-.8 1.5-1.5 2.5-1.5 1.7 0 2.5 1.2 2.5 3v3.5z"/></svg></div>
                                 <div className="plat-name">iStock</div>
                            </div>
                            <div className="platform-card locked">
                                 <div className="lock-overlay"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                                 <div className="brand-icon" style={{opacity:0.5}}><svg viewBox="0 0 24 24"><path d="M2 4h20v4h-6v12h-8v-12h-6z"/></svg></div>
                                 <div className="plat-name">Getty</div>
                            </div>
                        </div>

                        {/* Move Run/Status buttons OUT of the marginTop auto div so they sit in flow */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {isProcessing && (
                                <StatusCard percent={procPercent} count={procCount} total={totalCount} success={successCount} failed={failedCount} time={timeRemaining} isMeta={true} />
                            )}
                            
                            {!isProcessing && (
                                <>
                                    <button id="run-btn-meta" className="run-btn" onClick={() => runMetadata(false)}>GENERATE METADATA</button>
                                    {files.some(f => f.failed) && (
                                        <button className="run-btn" style={{background:'var(--accent-red)'}} onClick={() => runMetadata(true)}>RETRY FAILED ITEMS</button>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {results.length > 0 && !isProcessing && (
                                <button className="export-btn-ghost" onClick={() => exportMetaCSV(results)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
                                </button>
                            )}

                            <button className="global-clear-btn-footer" onClick={clearAll}>Clear All Data</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="results-feed-meta">
                 {results.map(r => RenderResultCard(r))}
            </div>
        </div>
    );
};