
import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { PromptingView } from './components/PromptingView';
import { MetadataView } from './components/MetadataView';
import { LegalPage } from './components/LegalPages';

// Shared Types
export interface FileItem {
    originalFile: File;
    isVideo: boolean;
    isSvg: boolean;
    isEps: boolean;
    previewBase64: string | null;
    uniqueId: number;
    failed?: boolean;
    errorCode?: string;
}

export interface PromptResult {
    filename: string;
    type: 'runway' | 'describe';
    low?: string;
    medium?: string;
    high?: string;
    description?: string;
    uniqueId: number;
}

export interface MetaResult {
    filename: string;
    title: string;
    keywords: string;
    categories: number;
    uniqueId: number;
}

const App: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [view, setView] = useState<'prompting' | 'metadata' | 'about' | 'privacy' | 'terms' | 'contact'>('prompting');
    const [apiKeys, setApiKeys] = useState<string[]>([]);

    useEffect(() => {
        const storedKeys = localStorage.getItem('gemKeys');
        if (storedKeys) {
            setApiKeys(storedKeys.split(',').filter(k => k.trim().length > 0));
        }
        
        document.getElementById('runway-studio-root')?.classList.add('theme-dark');
    }, []);

    useEffect(() => {
        const root = document.getElementById('runway-studio-root');
        if (root) root.className = `theme-${theme}`;
    }, [theme]);

    const addApiKey = (inputVal: string) => {
        const newKeys = inputVal.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (newKeys.length === 0) return;
        const updated = Array.from(new Set([...apiKeys, ...newKeys]));
        setApiKeys(updated);
        localStorage.setItem('gemKeys', updated.join(','));
    };

    const deleteApiKey = (key: string) => {
        const updated = apiKeys.filter(k => k !== key);
        setApiKeys(updated);
        localStorage.setItem('gemKeys', updated.join(','));
    };

    return (
        <div id="runway-studio-root" className={`theme-${theme}`}>
            <TopNav view={view} setView={setView} theme={theme} setTheme={setTheme} />

            {(view === 'about' || view === 'privacy' || view === 'terms' || view === 'contact') && (
                <LegalPage page={view} />
            )}

            {view === 'prompting' && (
                <PromptingView apiKeys={apiKeys} addApiKey={addApiKey} deleteApiKey={deleteApiKey} />
            )}

            {view === 'metadata' && (
                <MetadataView apiKeys={apiKeys} addApiKey={addApiKey} deleteApiKey={deleteApiKey} />
            )}
            
            <footer style={{ marginTop: 'auto', padding: '20px 0', borderTop: '1px solid var(--border-color)', width: '100%', maxWidth: '1280px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span onClick={() => setView('about')} style={{ cursor: 'pointer', fontWeight: 600 }}>About Us</span>
                    <span onClick={() => setView('privacy')} style={{ cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>
                    <span onClick={() => setView('terms')} style={{ cursor: 'pointer', fontWeight: 600 }}>Terms of Service</span>
                    <span onClick={() => setView('contact')} style={{ cursor: 'pointer', fontWeight: 600 }}>Contact</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', opacity: 0.6, color: 'var(--text-muted)' }}>
                    © {new Date().getFullYear()} Vision Studio. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;
