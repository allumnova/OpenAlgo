import React, { useState } from 'react';

export const StrategyBuilder: React.FC = () => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState('');

    const handleSave = async () => {
        const strategy = {
            name,
            symbol,
            quantity,
            enabled: true,
            rules: {
                buy: [{ condition: "price > sma(20)" }],
                sell: [{ condition: "price < sma(20)" }]
            }
        };

        try {
            const res = await fetch('http://localhost:8000/strategies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(strategy)
            });
            if (res.ok) {
                setStatus('Strategy Saved Successfully!');
                setName('');
                setSymbol('');
            }
        } catch (e) {
            setStatus('Error saving strategy');
        }
    };

    return (
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '2rem' }}>
            <h3>Strategy Builder</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Strategy Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. SMA Crossover"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="e.g. NSE:RELIANCE"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                        onClick={handleSave}
                        style={{ width: '100%', background: 'var(--primary-color)', color: 'black', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Save Strategy
                    </button>
                </div>
            </div>
            {status && <p style={{ marginTop: '1rem', color: status.includes('Error') ? 'var(--danger)' : 'var(--success)', fontSize: '0.9rem' }}>{status}</p>}
        </div>
    );
};
