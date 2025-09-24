import React from 'react';
import ReactDOM from 'react-dom/client';
// Replace BrowserRouter with Router for v5
import { BrowserRouter as Router } from 'react-router-dom';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import App from './App';
import './index.css';
// Import the MatchDataProvider
import { MatchDataProvider } from './hooks/use-match-data';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <Router>
        {/* Wrap the App component with MatchDataProvider */}
        <MatchDataProvider>
          <App />
        </MatchDataProvider>
      </Router>
    </HeroUIProvider>
  </React.StrictMode>,
);
