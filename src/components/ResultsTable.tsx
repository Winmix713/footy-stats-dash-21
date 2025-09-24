import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Match } from '../types/match';

interface ResultsTableProps {
  matches: Match[];
  onMatchClick?: (match: Match) => void;
  favorites: string[];
  onToggleFavorite: (matchId: string) => void;
}

type SortKey = 'date' | 'home' | 'away' | 'ht' | 'ft' | 'btts' | 'comeback';
type SortDirection = 'asc' | 'desc';

export const ResultsTable: React.FC<ResultsTableProps> = ({
  matches,
  onMatchClick,
  favorites,
  onToggleFavorite
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedMatches = [...matches].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    switch (sortKey) {
      case 'date':
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case 'home':
        valueA = a.home.name.toLowerCase();
        valueB = b.home.name.toLowerCase();
        break;
      case 'away':
        valueA = a.away.name.toLowerCase();
        valueB = b.away.name.toLowerCase();
        break;
      case 'ht':
        valueA = a.htScore.home * 10 + a.htScore.away;
        valueB = b.htScore.home * 10 + b.htScore.away;
        break;
      case 'ft':
        valueA = a.ftScore.home * 10 + a.ftScore.away;
        valueB = b.ftScore.home * 10 + b.ftScore.away;
        break;
      case 'btts':
        valueA = a.btts ? 1 : 0;
        valueB = b.btts ? 1 : 0;
        break;
      case 'comeback':
        valueA = a.comeback ? 1 : 0;
        valueB = b.comeback ? 1 : 0;
        break;
      default:
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
    }
    
    const compareResult = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table removeWrapper aria-label="Mérkőzés eredmények táblázat">
        <TableHeader>
          <TableColumn 
            onClick={() => handleSort('date')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Dátum
              {sortKey === 'date' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('home')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Hazai csapat
              {sortKey === 'home' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('away')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Vendég csapat
              {sortKey === 'away' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('ht')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Félidő
              {sortKey === 'ht' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('ft')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Végeredmény
              {sortKey === 'ft' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('btts')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              BTTS
              {sortKey === 'btts' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn 
            onClick={() => handleSort('comeback')}
            className="cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1">
              Fordítás
              {sortKey === 'comeback' && (
                <Icon 
                  icon={sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="text-violet-400" 
                  width={16} 
                  height={16} 
                />
              )}
            </div>
          </TableColumn>
          <TableColumn>Műveletek</TableColumn>
        </TableHeader>
        <TableBody>
          {sortedMatches.map((match) => (
            <TableRow 
              key={match.id} 
              className="hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => onMatchClick && onMatchClick(match)}
            >
              <TableCell className="text-zinc-300">{formatDate(match.date.toString())}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {match.home.logo && (
                    <img 
                      src={match.home.logo} 
                      alt={match.home.name} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-zinc-200">{match.home.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {match.away.logo && (
                    <img 
                      src={match.away.logo} 
                      alt={match.away.name} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-zinc-200">{match.away.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-zinc-300">
                {match.htScore.home}-{match.htScore.away}
              </TableCell>
              <TableCell className="font-mono font-semibold text-zinc-100">
                {match.ftScore.home}-{match.ftScore.away}
              </TableCell>
              <TableCell>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  match.btts 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {match.btts ? 'Igen' : 'Nem'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  match.comeback 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {match.comeback ? 'Igen' : 'Nem'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Tooltip content={favorites.includes(match.id) ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={favorites.includes(match.id) ? "warning" : "default"}
                      onPress={() => onToggleFavorite(match.id)}
                      className="min-w-0"
                    >
                      <Icon 
                        icon={favorites.includes(match.id) ? "lucide:star" : "lucide:star"} 
                        className={favorites.includes(match.id) ? "text-amber-400" : "text-zinc-500"} 
                        width={16} 
                        height={16} 
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Részletek megtekintése">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => onMatchClick && onMatchClick(match)}
                      className="min-w-0"
                    >
                      <Icon icon="lucide:info" width={16} height={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};