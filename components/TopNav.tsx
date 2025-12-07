
import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface Props {
    view: string;
    setView: (v: any) => void;
    theme: string;
    setTheme: (t: any) => void;
}

export const TopNav: React.FC<Props> = ({ view, setView, theme, setTheme }) => {
    return (
        <nav className="top-nav">
            <div className="nav-brand" onClick={() => setView('prompting')} style={{cursor:'pointer'}}>
                <div className="nav-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                GeminiVision
            </div>
            <div className="nav-menu">
                <button className={`nav-item ${view === 'prompting' ? 'active' : ''}`} onClick={() => setView('prompting')}>Prompting</button>
                <button className={`nav-item ${view === 'metadata' ? 'active' : ''}`} onClick={() => setView('metadata')}>Metadata</button>
            </div>
            <div className="nav-actions">
                <button className="theme-toggle-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                </button>
            </div>
        </nav>
    );
};
