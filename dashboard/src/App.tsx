import React, { useState, useEffect } from 'react';
import { SetupWizard } from './components/SetupWizard';
import { LogsTable } from './components/LogsTable';
import { StrategyBuilder } from './components/StrategyBuilder';
import { StrategyList } from './components/StrategyList';
import './index.css';

interface Status {
  engine_status: string;
  broker: string;
  active_strategies: number;
  pnl: number;
}

function App() {
  const [status, setStatus] = useState<Status>({
    engine_status: 'checking...',
    broker: 'Dhan',
    active_strategies: 0,
    pnl: 0.0
  });

  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    // Check if config exists in local storage
    const config = localStorage.getItem('openalgo_config');
    if (config) setSetupComplete(true);

    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/status');
        const data = await res.json();
        // Mapping API response to status state
        setStatus({
          engine_status: data.engine_status === 'connected' ? 'ONLINE' : 'OFFLINE',
          broker: data.broker || 'None',
          active_strategies: data.active_strategies || 0,
          pnl: data.pnl || 0.0
        });
      } catch (e) {
        setStatus(prev => ({ ...prev, engine_status: 'OFFLINE' }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleEngine = async () => {
    setLoading(true);
    // Placeholder for API call to start/stop engine
    setTimeout(() => setLoading(false), 1000);
  };

  if (!setupComplete) {
    return <SetupWizard onComplete={() => setSetupComplete(true)} />;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>OpenAlgo</h2>
        <nav>
          <div style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>● Dashboard</div>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>◌ Strategies</div>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>◌ Risk Settings</div>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>◌ Broker Links</div>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>v0.1.0-alpha</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Market Overview</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your automated trades</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`status-badge ${status.engine_status === 'ONLINE' ? 'status-online' : 'status-offline'}`}>
              ENGINE: {status.engine_status}
            </span>
            <button
              className="btn btn-primary"
              onClick={toggleEngine}
              disabled={loading}
            >
              {status.engine_status === 'ONLINE' ? 'STOP ENGINE' : 'START ENGINE'}
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total PnL (Daily)</p>
            <p className={`stat-value ${status.pnl >= 0 ? 'text-success' : 'text-danger'}`} style={{ color: status.pnl >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              ₹{status.pnl.toLocaleString()}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Strategies</p>
            <p className="stat-value">{status.active_strategies}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Broker</p>
            <p className="stat-value" style={{ fontSize: '1.5rem' }}>{status.broker}</p>
          </div>
        </section>

        <StrategyList />
        <StrategyBuilder />
        <LogsTable />
      </main>
    </div>
  );
}

export default App;
