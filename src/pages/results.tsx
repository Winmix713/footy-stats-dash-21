import React from 'react';
import { ResultsSection } from '../components/results-section';
import { useMatchData } from '../hooks/use-match-data';
import { Icon } from '@iconify/react';

const ResultsPage: React.FC = () => {
  const {
    filteredMatches,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    totalMatchCount,
    isLoadingPage,
    isSupabaseConnected
  } = useMatchData();
  
  return (
    <div className="page-content">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">Eredmények</h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
          Az összes mérkőzés eredménye és részletes adatai.
          {isSupabaseConnected === false && (
            <span className="block mt-2 text-amber-300 text-xs">
              <Icon icon="lucide:alert-triangle" className="inline-block mr-1" width={14} height={14} />
              Offline mód: Minta adatok megjelenítése
            </span>
          )}
        </p>
      </div>
      
      <ResultsSection 
        matches={filteredMatches}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalMatchCount} // Use totalMatchCount instead of filteredMatches.length
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
        isLoadingPage={isLoadingPage}
      />
      
      <div className="mt-6 text-center text-sm text-zinc-400">
        Összesen {totalMatchCount} mérkőzés található az adatbázisban.
        {isSupabaseConnected && (
          <span className="ml-2 text-emerald-300">
            <Icon icon="lucide:database" className="inline-block mr-1" width={14} height={14} />
            Supabase adatbázis használatban
          </span>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;