
import React, { useState } from 'react';

interface KeyManagerProps {
    apiKeys: string[];
    addApiKey: (keys: string) => void;
    deleteApiKey: (key: string) => void;
    idSuffix: string;
}

export const KeyManager: React.FC<KeyManagerProps> = ({ apiKeys, addApiKey, deleteApiKey, idSuffix }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputVal, setInputVal] = useState('');

    const handleAdd = () => {
        addApiKey(inputVal);
        setInputVal('');
    };

    return (
        <div className="config-section" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={`api-key-header`} onClick={() => setIsOpen(!isOpen)}>
                <span>API Key & Model Settings</span>
                <div className="header-controls">
                    <span>{apiKeys.length} Keys Active</span>
                    <svg className={`chevron-icon`} style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>
            <div className={`key-list-wrapper ${isOpen ? 'open' : ''}`}>
                {apiKeys.map(key => (
                    <div key={key} className="key-item">
                        <div className="key-item-info">
                            <span>{key.substring(0, 8)}...</span>
                            <span className="key-item-status">ACTIVE</span>
                        </div>
                        <button className="key-delete-btn" onClick={() => deleteApiKey(key)}>×</button>
                    </div>
                ))}
                <div className="add-key-input">
                    <input type="password" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Enter new Gemini API key" />
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
        </div>
    );
};
