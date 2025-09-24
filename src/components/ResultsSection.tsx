import React, { useState } from 'react';
import { Button, Card, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ResultsTable } from './ResultsTable';
import { Match } from '../types/match';
import { useSupabase } from '../hooks/use-supabase';
import { useToast } from '../hooks/use-toast';

interface ResultsSectionProps {
  matches: Match[];
  isLoading: boolean;
  onMatchClick?: (match: Match) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  matches,
  isLoading,
  onMatchClick
}) => {
  const { isConnected } = useSupabase();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('winmix-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  const toggleFavorite = (matchId: string) => {
    try {
      const newFavorites = favorites.includes(matchId)
        ? favorites.filter(id => id !== matchId)
        : [...favorites, matchId];
      
      setFavorites(newFavorites);
      localStorage.setItem('winmix-favorites', JSON.stringify(newFavorites));
      
      showToast({
        title: favorites.includes(matchId) ? 'Eltávolítva a kedvencekből' : 'Hozzáadva a kedvencekhez',
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error saving favorites:', error);
      showToast({
        title: 'Hiba történt a kedvencek mentésekor',
        type: 'error',
        duration: 3000
      });
    }
  };

  const filteredMatches = viewMode === 'favorites'
    ? matches.filter(match => favorites.includes(match.id))
    : matches;

  const exportToCSV = () => {
    try {
      const headers = [
        "Azonosító",
        "Dátum",
        "Hazai csapat",
        "Vendég csapat",
        "Félidő eredmény",
        "Végeredmény",
        "BTTS",
        "Fordítás"
      ];
      
      const csvRows = [
        headers.join(','),
        ...filteredMatches.map(match => {
          return [
            match.id,
            match.date,
            `"${match.home.name}"`,
            `"${match.away.name}"`,
            `${match.htScore.home}-${match.htScore.away}`,
            `${match.ftScore.home}-${match.ftScore.away}`,
            match.btts ? "Igen" : "Nem",
            match.comeback ? "Igen" : "Nem"
          ].join(',');
        })
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `winmix-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: 'Exportálás sikeres',
        description: `${filteredMatches.length} mérkőzés exportálva CSV formátumban`,
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      showToast({
        title: 'Exportálási hiba',
        description: 'Nem sikerült exportálni az adatokat',
        type: 'error',
        duration: 3000
      });
    }
  };

  return (
    <Card className="w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Mérkőzés eredmények</h2>
          
          <div className="flex items-center gap-2">
            <div className="bg-black/30 rounded-lg p-1 flex">
              <Button
                size="sm"
                variant={viewMode === 'all' ? 'solid' : 'flat'}
                color={viewMode === 'all' ? 'primary' : 'default'}
                className={viewMode !== 'all' ? 'bg-transparent text-zinc-400' : ''}
                onPress={() => setViewMode('all')}
              >
                Összes
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'favorites' ? 'solid' : 'flat'}
                color={viewMode === 'favorites' ? 'primary' : 'default'}
                className={viewMode !== 'favorites' ? 'bg-transparent text-zinc-400' : ''}
                onPress={() => setViewMode('favorites')}
              >
                <Icon icon="lucide:star" className="mr-1" width={16} height={16} />
                Kedvencek ({favorites.length})
              </Button>
            </div>
            
            <Button
              size="sm"
              variant="flat"
              color="default"
              className="bg-white/5 border border-white/10 text-zinc-200"
              onPress={exportToCSV}
              isDisabled={filteredMatches.length === 0 || isLoading}
            >
              <Icon icon="lucide:download" className="mr-1" width={16} height={16} />
              Exportálás
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-zinc-400">Adatok betöltése...</p>
        </div>
      ) : filteredMatches.length > 0 ? (
        <ResultsTable 
          matches={filteredMatches} 
          onMatchClick={onMatchClick}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Icon icon={viewMode === 'favorites' ? 'lucide:star' : 'lucide:search'} className="text-zinc-500" width={24} height={24} />
          </div>
          <p className="text-zinc-400">
            {viewMode === 'favorites' 
              ? 'Nincsenek kedvencnek jelölt mérkőzések' 
              : 'Nincs találat a megadott szűrőkkel'}
          </p>
          {viewMode === 'favorites' && favorites.length === 0 && (
            <p className="text-sm text-zinc-500 mt-2 max-w-md text-center">
              A csillag ikonra kattintva jelölhetsz mérkőzéseket kedvencként, hogy később könnyebben megtaláld őket
            </p>
          )}
        </div>
      )}
      
      {!isLoading && filteredMatches.length > 0 && (
        <div className="p-4 border-t border-white/10 text-sm text-zinc-400 flex justify-between items-center">
          <span>Összesen {filteredMatches.length} mérkőzés</span>
          <span className="text-xs">
            {isConnected 
              ? 'Adatok betöltve az adatbázisból' 
              : 'Offline mód: minta adatok megjelenítése'}
          </span>
        </div>
      )}
    </Card>
  );
};