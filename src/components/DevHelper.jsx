// src/components/DevHelper.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * Development Helper Component
 * Shows backend connection status in development mode
 * Remove atau comment out di production!
 */
function DevHelper() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendUrl, setBackendUrl] = useState('');
  
  useEffect(() => {
    checkBackendConnection();
    setBackendUrl(import.meta.env.VITE_API_URL || 'http://localhost:5000');
  }, []);

  const checkBackendConnection = async () => {
    try {
      // Try to hit a simple endpoint
      await api.get('/api/walkers');
      setBackendStatus('connected');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setBackendStatus('disconnected');
      } else if (error.response?.status === 401 || error.response?.status === 404) {
        // If we get 401 or 404, backend is running but endpoint might need auth
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    }
  };

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const statusStyles = {
    checking: { background: '#ffc107', color: '#000' },
    connected: { background: '#4caf50', color: '#fff' },
    disconnected: { background: '#f44336', color: '#fff' },
    error: { background: '#ff9800', color: '#000' }
  };

  const statusText = {
    checking: '🔄 Checking backend...',
    connected: '✅ Backend Connected',
    disconnected: '❌ Backend Disconnected',
    error: '⚠️ Backend Error'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        ...statusStyles[backendStatus]
      }}
      onClick={checkBackendConnection}
      title="Click to recheck backend connection"
    >
      <div>{statusText[backendStatus]}</div>
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>
        {backendUrl}
      </div>
      {backendStatus === 'disconnected' && (
        <div style={{ fontSize: '10px', marginTop: '8px', lineHeight: '1.4' }}>
          💡 Start backend:<br/>
          <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '3px' }}>
            cd backend && npm start
          </code>
        </div>
      )}
    </div>
  );
}

export default DevHelper;
