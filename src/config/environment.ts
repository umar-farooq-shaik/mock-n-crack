// Environment Configuration
// Centralized configuration for all environment variables

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    enableConsoleLogging: boolean;
  };
}

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isTestMode = import.meta.env.MODE === 'test';

// Configuration based on environment
export const config: EnvironmentConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://iyljwzhuvcsmcpstbyqq.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bGp3emh1dmNzbWNwc3RieXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NjgzNTMsImV4cCI6MjA2ODA0NDM1M30.PdbStP11k-6TXL_SB-DPDxFOiezOGYmZfBaQd624kvU",
  },
  app: {
    name: "MockNCrack",
    version: "1.0.0",
    environment: isDevelopment ? 'development' : isProduction ? 'production' : 'test',
  },
  features: {
    enableAnalytics: isProduction,
    enableDebugMode: isDevelopment,
    enableConsoleLogging: isDevelopment, // Only log in development
  },
};

// Utility functions
export const isDev = () => config.app.environment === 'development';
export const isProd = () => config.app.environment === 'production';
export const isTest = () => config.app.environment === 'test';

// Secure logging utility
export const secureLog = {
  log: (...args: any[]) => {
    if (config.features.enableConsoleLogging) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.features.enableConsoleLogging) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (config.features.enableConsoleLogging) {
      console.error(...args);
    }
  },
  debug: (...args: any[]) => {
    if (config.features.enableDebugMode) {
      console.debug(...args);
    }
  },
};

// Environment validation
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    config.supabase.url,
    config.supabase.anonKey,
  ];

  const missingVars = requiredVars.filter(v => !v);
  
  if (missingVars.length > 0) {
    if (isDev()) {
      console.error('Missing required environment variables:', missingVars);
    }
    return false;
  }

  return true;
};

export default config;
