import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { enableMocking } from './mocks/browser';
import App from './App.jsx';
import './styles/main.css';

/**
 * Initialize application:
 * 1. Conditionally starts Mock Service Worker (MSW) if VITE_USE_MOCK=true.
 * 2. Mounts React application with BrowserRouter and AuthProvider.
 */
async function startApplication() {
  try {
    await enableMocking();
  } catch (error) {
    console.error('Failed to start mock service worker:', error);
  }

  const rootElement = document.getElementById('root');
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

startApplication();
