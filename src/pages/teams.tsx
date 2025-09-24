import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMatchData } from '../hooks/use-match-data';

const TeamsPage: React.FC = () => {
  const { homeTeams, awayTeams } = useMatchData();
  
  // Combine and deduplicate teams
  const allTeams = React.useMemo(() => {
    const teamMap = new Map();
    
    [...homeTeams, ...awayTeams].forEach(team => {
      if (!teamMap.has(team.id)) {
        teamMap.set(team.id, team);
      }
    });
    
    return Array.from(teamMap.values());
  }, [homeTeams, awayTeams]);
  
  return (
    <div className="page-content">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">Csapatok</h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
          Az adatbázisban szereplő összes csapat listája és statisztikái.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allTeams.map(team => (
          <Card key={team.id} className="bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition-all duration-200">
            <div className="flex items-center gap-3">
              {team.logo ? (
                <img 
                  src={team.logo} 
                  alt={`${team.name} logo`} 
                  className="h-12 w-12 rounded-full ring-1 ring-white/10 object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon icon="lucide:shield" className="text-zinc-400" width={24} height={24} />
                </div>
              )}
              <div>
                <h3 className="font-medium text-white">{team.name}</h3>
                <p className="text-xs text-zinc-400">ID: {team.id}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;