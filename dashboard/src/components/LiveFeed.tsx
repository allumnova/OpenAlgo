import React, { useState, useEffect } from 'react';

interface SymbolPrice {
    symbol: string;
    price: number;
    change: number;
}

export const LiveFeed: React.FC = () => {
    const [prices, setPrices] = useState<SymbolPrice[]>([
        { symbol: 'NIFTY 50', price: 21500.50, change: 0.25 },
        { symbol: 'BANK NIFTY', price: 45200.10, change: -0.15 },
        { symbol: 'SENSEX', price: 71000.00, change: 0.05 }
    ]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Simulation for visual stability
        const interval = setInterval(() => {
            setIsConnected(true);
            setPrices(prev => prev.map(p => ({
                ...p,
                price: p.price + (Math.random() - 0.5) * 1.5,
                change: p.change + (Math.random() - 0.5) * 0.02
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live Market Ticker</span>
                <span style={{ fontSize: '0.7rem', color: isConnected ? 'var(--success)' : 'var(--danger)' }}>
                    {isConnected ? '● Connected' : '○ Connecting...'}
                </span>
            </div>
            <div style={{
                display: 'flex',
                gap: '2rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
            }}>
                {prices.map(p => (
                    <div key={p.symbol} style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{p.symbol}</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{p.price.toFixed(2)}</span>
                            <span style={{ fontSize: '0.8rem', color: p.change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
