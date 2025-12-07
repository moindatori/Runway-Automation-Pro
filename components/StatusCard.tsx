
import React from 'react';

interface StatusCardProps {
    percent: number;
    count: number;
    total: number;
    // Optional meta stats
    success?: number;
    failed?: number;
    time?: string;
    isMeta?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ percent, count, total, success, failed, time, isMeta }) => {
    return (
        <div id={isMeta ? "status-card" : "status-card-prompt"}>
            <div className="status-header">
                <div className="status-title"><div className="spinner-ring"></div> Processing Assets</div>
                <div className="status-info">
                    <span id={isMeta ? "proc-percent" : "proc-percent-prompt"}>{percent}%</span>
                    <span id={isMeta ? "proc-count" : "proc-count-prompt"} style={{fontSize:'11px', color:'var(--text-muted)'}}>{count} of {total} completed</span>
                </div>
            </div>
            <div className="progress-track-large"><div className="progress-fill-large" style={{width: `${percent}%`}}></div></div>
            {isMeta && (
                <div className="status-stats">
                    <div className="stat-box"><span className="stat-val val-success">{success}</span><span className="stat-label">Success</span></div>
                    <div className="stat-box"><span className="stat-val val-failed">{failed}</span><span className="stat-label">Failed</span></div>
                    <div className="stat-box"><span className="stat-val val-time">{time}</span><span className="stat-label">Time Remaining</span></div>
                </div>
            )}
        </div>
    );
};
