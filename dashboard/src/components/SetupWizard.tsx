import React, { useState } from 'react';

interface SetupProps {
    onComplete: (config: any) => void;
}

export const SetupWizard: React.FC<SetupProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [brokerInfo, setBrokerInfo] = useState({ broker: 'Dhan', clientId: '', accessToken: '' });

    const nextStep = () => setStep(step + 1);

    return (
        <div style={{
            maxWidth: '600px',
            margin: '100px auto',
            padding: '3rem',
            background: 'var(--surface-color)',
            borderRadius: '24px',
            border: '1px solid var(--primary-color)',
            boxShadow: '0 0 40px rgba(0, 242, 255, 0.1)'
        }}>
            {step === 1 && (
                <div>
                    <h2>Risk Disclaimer</h2>
                    <p style={{ margin: '1.5rem 0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Trading involves significant risk of loss. OpenAlgo is an open-source tool.
                        You are responsible for your own keys and execution. No financial advice is provided.
                    </p>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)} />
                        I understand and accept the risks.
                    </label>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '2rem', width: '100%' }}
                        disabled={!agreed}
                        onClick={nextStep}
                    >
                        CONTINUE
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>Broker Configuration</h2>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Broker</label>
                        <select
                            className="btn"
                            style={{ width: '100%', background: '#1a1a2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                            value={brokerInfo.broker}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrokerInfo({ ...brokerInfo, broker: e.target.value })}
                        >
                            <option value="Dhan">Dhan</option>
                            <option value="Zerodha" disabled>Zerodha (Coming Soon)</option>
                        </select>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Client ID</label>
                        <input
                            type="text"
                            className="btn"
                            style={{ width: '100%', background: '#1a1a2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}
                            value={brokerInfo.clientId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrokerInfo({ ...brokerInfo, clientId: e.target.value })}
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Access Token</label>
                        <input
                            type="password"
                            className="btn"
                            style={{ width: '100%', background: '#1a1a2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}
                            value={brokerInfo.accessToken}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrokerInfo({ ...brokerInfo, accessToken: e.target.value })}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '2rem', width: '100%' }}
                        onClick={nextStep}
                    >
                        SAVE CONFIG
                    </button>
                </div>
            )}

            {step === 3 && (
                <div style={{ textAlign: 'center' }}>
                    <h2>Almost Ready!</h2>
                    <p style={{ margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                        Your configuration is saved locally. You can now start the engine and enable strategies.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => onComplete(brokerInfo)}
                    >
                        GO TO DASHBOARD
                    </button>
                </div>
            )}
        </div>
    );
};
