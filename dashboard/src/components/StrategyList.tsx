import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const StrategyList: React.FC = () => {
    const [strategies, setStrategies] = useState<any[]>([]);

    const fetchStrategies = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/strategies`);
            const data = await res.json();
            setStrategies(data);
        } catch (e) {
            console.error("Failed to fetch strategies", e);
        }
    };

    useEffect(() => {
        fetchStrategies();
        const interval = setInterval(fetchStrategies, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '2rem' }}>
            <h3>Enabled Strategies</h3>
            <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                {strategies.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No strategies found. Build one below!</p>
                ) : (
                    strategies.map((strat, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{strat.name}</h4>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{strat.symbol} | Qty: {strat.quantity}</p>
                            </div>
                            <span style={{
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                background: strat.enabled ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                                color: strat.enabled ? 'var(--success)' : 'var(--danger)',
                                border: `1px solid ${strat.enabled ? 'var(--success)' : 'var(--danger)'}`
                            }}>
                                {strat.enabled ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
