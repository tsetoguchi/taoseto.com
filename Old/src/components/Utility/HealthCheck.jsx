import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '../../config';

export const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = getApiEndpoint('health');
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (response.ok) {
        setHealthStatus(data);
      } else {
        throw new Error(data.error || 'Health check failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-check health on component mount
    checkHealth();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#f8f9fa', 
      padding: '10px', 
      borderRadius: '5px', 
      fontSize: '12px',
      border: '1px solid #dee2e6',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '5px' }}>
        <strong>API Status:</strong>
      </div>
      
      {loading && <div>Checking...</div>}
      
      {error && (
        <div style={{ color: '#dc3545' }}>
          ❌ {error}
        </div>
      )}
      
      {healthStatus && !error && (
        <div style={{ color: '#28a745' }}>
          ✅ {healthStatus.status}
          {healthStatus.resend && (
            <div style={{ fontSize: '10px', color: '#6c757d' }}>
              Resend: {healthStatus.resend}
            </div>
          )}
        </div>
      )}
      
      <button 
        onClick={checkHealth}
        style={{
          marginTop: '5px',
          padding: '2px 8px',
          fontSize: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Refresh'}
      </button>
    </div>
  );
};
