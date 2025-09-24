import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { BackgroundEffects } from './components/background-effects';
import { LoadingOverlay } from './components/loading-overlay';
import { MobileNav } from './components/mobile-nav';
import { ExtendedStatsModal } from './components/extended-stats-modal';
import { useMatchData } from './hooks/use-match-data';
import { ErrorBanner } from './components/error-banner';
import { ConnectionStatus } from './components/connection-status';

// Import page components
import HomePage from './pages/home';
import TeamsPage from './pages/teams';
import StatsPage from './pages/stats';
import ResultsPage from './pages/results';

const App: React.FC = () => {
  const {
    isLoading,
    selectedHomeTeam,
    selectedAwayTeam,
    stats,
    isExtendedStatsModalOpen,
    setIsExtendedStatsModalOpen,
    applyFilters
  } = useMatchData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackgroundEffects />
      <LoadingOverlay isLoading={isLoading} />
      
      <Header 
        onExtendedStatsClick={() => setIsExtendedStatsModalOpen(true)}
        onSearchClick={applyFilters}
      />
      
      <main className="relative z-10">
        <div className="bg-black/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <MobileNav />
      
      <ExtendedStatsModal 
        isOpen={isExtendedStatsModalOpen}
        onClose={() => setIsExtendedStatsModalOpen(false)}
        selectedHomeTeam={selectedHomeTeam}
        selectedAwayTeam={selectedAwayTeam}
        stats={stats}
      />
      
      <ErrorBanner />
      <ConnectionStatus />
    </div>
  );
};

export default App;