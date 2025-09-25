import React from 'react';
import { FilterSection } from '../components/filter-section';
import { StatsSection } from '../components/stats-section';
import { ResultsSection } from '../components/results-section';
import { useMatchData } from '../hooks/use-match-data';

const HomePage: React.FC = () => {
  const {
    homeTeams,
    awayTeams,
    selectedHomeTeam,
    selectedAwayTeam,
    selectedBTTS,
    selectedComeback,
    setSelectedHomeTeam,
    setSelectedAwayTeam,
    setSelectedBTTS,
    setSelectedComeback,
    applyFilters,
    resetFilters,
    exportToCSV,
    stats,
    filteredMatches,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    setIsExtendedStatsModalOpen,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    
    // Add new filter values
    minHomeGoals,
    maxHomeGoals,
    minAwayGoals,
    maxAwayGoals,
    resultType,
    htftCombination,
    setMinHomeGoals,
    setMaxHomeGoals,
    setMinAwayGoals,
    setMaxAwayGoals,
    setResultType,
    setHtftCombination
  } = useMatchData();

  return (
    <div className="page-content">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
          Mérkőzés szűrő és statisztikák
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
          Szűrd a meccseket csapatokra és eseményekre, elemezd a kimeneteleket, és exportáld CSV-be.
        </p>
      </div>

      <FilterSection 
        homeTeams={homeTeams}
        awayTeams={awayTeams}
        selectedHomeTeam={selectedHomeTeam}
        selectedAwayTeam={selectedAwayTeam}
        selectedBTTS={selectedBTTS}
        selectedComeback={selectedComeback}
        onHomeTeamChange={setSelectedHomeTeam}
        onAwayTeamChange={setSelectedAwayTeam}
        onBTTSChange={setSelectedBTTS}
        onComebackChange={setSelectedComeback}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        onExportCSV={exportToCSV}
      />

      <StatsSection 
        stats={stats}
        onExtendedStatsClick={() => setIsExtendedStatsModalOpen(true)}
      />

      <ResultsSection 
        matches={filteredMatches}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredMatches.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key) => {
          if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          } else {
            setSortKey(key);
            setSortDirection('asc');
          }
        }}
      />
    </div>
  );
};

export default HomePage;