import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const LogsTable: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('http://localhost:8000/logs/audit');
                const data = await res.json();
                setAuditLogs(data);
            } catch (e) {
                console.error("Failed to fetch logs", e);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '2rem' }}>
            <h3>Audit & Risk Logs</h3>
            <div style={{ marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '0.5rem' }}>Time</th>
                            <th style={{ padding: '0.5rem' }}>Event</th>
                            <th style={{ padding: '0.5rem' }}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map((log, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{
                                        color: log.event_type === 'RISK_ALERT' ? 'var(--danger)' : 'var(--primary-color)',
                                        fontWeight: '600'
                                    }}>
                                        {log.event_type}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
