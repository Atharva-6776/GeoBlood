import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

export function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="app-container">
          <Navbar />
          <main className="content-area" id="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
