import React, { useState, useEffect } from 'react';
import { Button, Card, Tooltip, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { Match, SortKey, SortDirection } from '../types/match';
import { supabase } from '@/integrations/supabase/client';
import { useMatchData } from '../hooks/use-match-data';

interface ResultsSectionProps {
  matches: Match[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  isLoadingPage?: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  matches, 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange, 
  sortKey, 
  sortDirection, 
  onSortChange,
  isLoadingPage = false
}) => {
  // Add state for showing all results
  const [showAllResults, setShowAllResults] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { isSupabaseConnected } = useMatchData();
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate displayed range
  const startItem = showAllResults ? 1 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = showAllResults ? totalItems : Math.min(currentPage * itemsPerPage, totalItems);

  // Handle toggling between paginated and all results
  const handleToggleAllResults = async () => {
    if (!showAllResults) {
      // When switching to "all", load all items
      setIsLoadingAll(true);
      try {
        // Tell parent to load all items
        onItemsPerPageChange(9999); // Use a large number to get all results
      } catch (error) {
        console.error("Error loading all results:", error);
      } finally {
        setIsLoadingAll(false);
        setShowAllResults(true);
      }
    } else {
      // When switching back to paginated, restore default page size
      onItemsPerPageChange(50);
      setShowAllResults(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with title and actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-white">
            Listázott eredmények
          </h2>
          <span className="px-3 py-1 text-xs font-medium text-zinc-300 bg-white/10 rounded-full">
            {totalItems} mérkőzés
          </span>
          {!showAllResults && (
            <span className="px-3 py-1 text-xs font-medium text-zinc-300 bg-violet-500/20 text-violet-300 rounded-full">
              {currentPage}. oldal / {totalPages}
            </span>
          )}
          {isSupabaseConnected && (
            <span className="px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-full flex items-center gap-1">
              <Icon icon="lucide:database" width={12} height={12} />
              Adatbázis kapcsolódva
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            color="default"
            size="sm"
            className="bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10"
            onPress={handleToggleAllResults}
            isLoading={isLoadingAll}
          >
            {showAllResults ? "Oldalakra bontva (50)" : "Összes eredmény"}
          </Button>
          <Button
            variant="flat"
            color="default"
            size="sm"
            className="bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10"
          >
            Kiválasztás
          </Button>
          <Button
            variant="flat"
            color="default"
            size="sm"
            className="bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10"
          >
            Szűrők mentése
          </Button>
        </div>
      </div>

      {/* Results table */}
      <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/40">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr>
                {[
                  { key: 'home' as SortKey, label: 'Hazai csapat' },
                  { key: 'away' as SortKey, label: 'Vendég csapat' },
                  { key: 'ht' as SortKey, label: 'Félidő' },
                  { key: 'ft' as SortKey, label: 'Végeredmény' },
                  { key: 'btts' as SortKey, label: 'BTTS' },
                  { key: 'comeback' as SortKey, label: 'Fordítás' }
                ].map(({ key, label }) => (
                  <th 
                    key={key}
                    onClick={() => onSortChange(key)}
                    className="px-6 py-4 text-left text-sm font-medium text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors"
                  >
                    {label}
                    <span className="ml-2 inline-block">
                      {sortKey === key ? (
                        sortDirection === 'asc' ? (
                          <Icon icon="lucide:chevron-up" className="w-4 h-4 text-violet-400" />
                        ) : (
                          <Icon icon="lucide:chevron-down" className="w-4 h-4 text-violet-400" />
                        )
                      ) : (
                        <Icon icon="lucide:chevrons-up-down" className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoadingPage || isLoadingAll ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Spinner color="primary" size="lg" className="mb-4" />
                      <p className="text-zinc-400">
                        {showAllResults ? "Összes mérkőzés betöltése..." : "Adatok betöltése..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : matches.length > 0 ? (
                matches.map((match, index) => (
                  <tr 
                    key={match.id || index} 
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {match.home.logo ? (
                          <img 
                            src={match.home.logo} 
                            alt={match.home.name} 
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-block w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Icon icon="lucide:home" className="w-3 h-3 text-emerald-300" />
                          </span>
                        )}
                        <span className="font-medium text-zinc-200">{match.home.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {match.away.logo ? (
                          <img 
                            src={match.away.logo} 
                            alt={match.away.name} 
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-block w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center">
                            <Icon icon="lucide:plane" className="w-3 h-3 text-sky-300" />
                          </span>
                        )}
                        <span className="text-zinc-200">{match.away.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-300">
                      {match.htScore.home}-{match.htScore.away}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-zinc-100">
                      {match.ftScore.home}-{match.ftScore.away}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        match.btts 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {match.btts ? 'Igen' : 'Nem'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        match.comeback 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {match.comeback ? 'Igen' : 'Nem'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <Icon icon="lucide:search" className="w-6 h-6 text-zinc-500" />
                      </div>
                      <p className="text-zinc-400">Nincs találat a megadott szűrőkkel.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - only show when not in "all results" mode */}
      {!showAllResults && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            {startItem}–{endItem} / {totalItems} eredmény
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="flat"
              color="default"
              size="sm"
              isDisabled={currentPage === 1}
              onPress={() => onPageChange(currentPage - 1)}
              className="min-w-[80px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
            >
              <Icon icon="lucide:chevron-left" className="w-4 h-4 mr-1" />
              Előző
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center">
              {currentPage > 2 && (
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={() => onPageChange(1)}
                  className="min-w-[40px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
                >
                  1
                </Button>
              )}
              
              {currentPage > 3 && (
                <span className="px-2 text-zinc-500">...</span>
              )}
              
              {currentPage > 1 && (
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={() => onPageChange(currentPage - 1)}
                  className="min-w-[40px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
                >
                  {currentPage - 1}
                </Button>
              )}
              
              <Button
                variant="solid"
                color="primary"
                size="sm"
                className="min-w-[40px] bg-violet-500 text-white"
              >
                {currentPage}
              </Button>
              
              {currentPage < totalPages && (
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={() => onPageChange(currentPage + 1)}
                  className="min-w-[40px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
                >
                  {currentPage + 1}
                </Button>
              )}
              
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-zinc-500">...</span>
              )}
              
              {currentPage < totalPages - 1 && (
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={() => onPageChange(totalPages)}
                  className="min-w-[40px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
                >
                  {totalPages}
                </Button>
              )}
            </div>
            
            <Button
              variant="flat"
              color="default"
              size="sm"
              isDisabled={currentPage === totalPages}
              onPress={() => onPageChange(currentPage + 1)}
              className="min-w-[80px] bg-black/40 border border-white/10 text-zinc-300 hover:bg-white/5"
            >
              Következő
              <Icon icon="lucide:chevron-right" className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Show total count when in "all results" mode */}
      {showAllResults && (
        <div className="mt-4 text-center text-sm text-zinc-400">
          Összes eredmény megjelenítve: {totalItems} mérkőzés
        </div>
      )}
    </div>
  );
};