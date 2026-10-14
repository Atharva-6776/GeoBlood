import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Configure MSW Worker for browser mocking.
 * This intercepts fetch & XMLHttpRequest (including Axios) in the browser
 * when VITE_USE_MOCK=true.
 */
export const worker = setupWorker(...handlers);

/**
 * Conditional starter for MSW in development.
 * Returns a promise that resolves when worker has started (or immediately if mock is disabled).
 */
export async function enableMocking() {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

  if (!useMock) {
    // Mocking disabled; all requests will flow to the real backend
    return;
  }

  // Start MSW service worker
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn for static assets like fonts/images
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });
}
