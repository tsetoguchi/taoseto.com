// Configuration for API endpoints
const config = {
  development: {
    apiBaseUrl: 'http://localhost:5000',
    endpoints: {
      contact: 'http://localhost:5000/api/contact',
      health: 'http://localhost:5000/api/health'
    }
  },
  production: {
    apiBaseUrl: '', // Will be set by deployment script
    endpoints: {
      contact: '', // Will be set by deployment script
      health: ''   // Will be set by deployment script
    }
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// Export the appropriate config
export const apiConfig = isDevelopment ? config.development : config.production;

// Function to get API endpoint
export const getApiEndpoint = (endpointName) => {
  // First check if we have deployment-specific config
  if (window.API_CONFIG?.endpoints?.[endpointName]) {
    return window.API_CONFIG.endpoints[endpointName];
  }
  
  // Fallback to environment config
  return apiConfig.endpoints[endpointName];
};

export default config;
