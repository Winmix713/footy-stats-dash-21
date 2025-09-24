import React from 'react';
import { Card, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Match, Team } from '../types/match';
import { TeamDetailsModal } from './team-details-modal';
import { calculateTeamPowerRanking } from '../utils/team-utils';

interface TeamsSectionProps {
  matches?: Match[]; // Mark matches as optional to handle undefined properly
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({ matches }) => {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Extract unique teams from matches with safe checks
  const teams = React.useMemo(() => {
    setIsLoading(true);
    
    try {
      if (!matches || !Array.isArray(matches) || matches.length === 0) {
        return [];
      }

      // Create a map to store unique teams
      const teamsMap = new Map<string, Team & { powerRanking: number }>();

      // Extract teams from matches with additional safety checks
      matches.forEach(match => {
        // Handle home team
        if (match && match.home_team) {
          const homeTeamId = `home-${match.id}-${match.home_team.replace(/\s+/g, '')}`;
          if (!teamsMap.has(homeTeamId)) {
            teamsMap.set(homeTeamId, {
              id: homeTeamId,
              name: match.home_team,
              logo: `https://img.heroui.chat/image/sports?w=100&h=100&u=${match.home_team.replace(/\s+/g, '')}`,
              powerRanking: 0
            });
          }
        }

        // Handle away team
        if (match && match.away_team) {
          const awayTeamId = `away-${match.id}-${match.away_team.replace(/\s+/g, '')}`;
          if (!teamsMap.has(awayTeamId)) {
            teamsMap.set(awayTeamId, {
              id: awayTeamId,
              name: match.away_team,
              logo: `https://img.heroui.chat/image/sports?w=100&h=100&u=${match.away_team.replace(/\s+/g, '')}`,
              powerRanking: 0
            });
          }
        }
      });

      // Convert map to array and calculate power ranking
      const teamsArray = Array.from(teamsMap.values());
      
      // Calculate power ranking for each team
      teamsArray.forEach(team => {
        try {
          team.powerRanking = calculateTeamPowerRanking(team, matches);
        } catch (error) {
          console.error(`Error calculating power ranking for team ${team.name}:`, error);
          team.powerRanking = 0;
        }
      });

      // Sort by power ranking
      const sortedTeams = teamsArray.sort((a, b) => b.powerRanking - a.powerRanking);
      
      // Limit to 16 teams as requested
      const limitedTeams = sortedTeams.slice(0, 16);
      
      setIsLoading(false);
      return limitedTeams;
    } catch (error) {
      console.error("Error processing teams:", error);
      setIsLoading(false);
      return [];
    }
  }, [matches]);

  // Calculate team statistics with null check and error handling
  const getTeamStats = (teamId: string) => {
    try {
      if (!matches || !Array.isArray(matches)) {
        return {
          homeMatches: [],
          awayMatches: [],
          allMatches: [],
          homeWins: 0,
          homeDraws: 0,
          homeLosses: 0,
          awayWins: 0,
          awayDraws: 0,
          awayLosses: 0,
          totalWins: 0,
          totalDraws: 0,
          totalLosses: 0,
          homeGoalsScored: 0,
          homeGoalsConceded: 0,
          awayGoalsScored: 0,
          awayGoalsConceded: 0,
          totalGoalsScored: 0,
          totalGoalsConceded: 0,
          winPercentage: 0,
        };
      }

      // Extract team name from ID
      const teamName = teams.find(t => t.id === teamId)?.name;
      if (!teamName) return { homeMatches: [], awayMatches: [], allMatches: [], homeWins: 0, homeDraws: 0, homeLosses: 0, awayWins: 0, awayDraws: 0, awayLosses: 0, totalWins: 0, totalDraws: 0, totalLosses: 0, homeGoalsScored: 0, homeGoalsConceded: 0, awayGoalsScored: 0, awayGoalsConceded: 0, totalGoalsScored: 0, totalGoalsConceded: 0, winPercentage: 0 };

      // Filter matches by team name instead of ID
      const homeMatches = matches.filter(match => match.home_team === teamName);
      const awayMatches = matches.filter(match => match.away_team === teamName);
      const allMatches = [...homeMatches, ...awayMatches];

      const homeWins = homeMatches.filter(match => match.result_computed === 'H').length;
      const homeDraws = homeMatches.filter(match => match.result_computed === 'D').length;
      const homeLosses = homeMatches.filter(match => match.result_computed === 'A').length;

      const awayWins = awayMatches.filter(match => match.result_computed === 'A').length;
      const awayDraws = awayMatches.filter(match => match.result_computed === 'D').length;
      const awayLosses = awayMatches.filter(match => match.result_computed === 'H').length;

      const totalWins = homeWins + awayWins;
      const totalDraws = homeDraws + awayDraws;
      const totalLosses = homeLosses + awayLosses;

      const homeGoalsScored = homeMatches.reduce((sum, match) => sum + (match.full_time_home_goals ?? 0), 0);
      const homeGoalsConceded = homeMatches.reduce((sum, match) => sum + (match.full_time_away_goals ?? 0), 0);

      const awayGoalsScored = awayMatches.reduce((sum, match) => sum + (match.full_time_away_goals ?? 0), 0);
      const awayGoalsConceded = awayMatches.reduce((sum, match) => sum + (match.full_time_home_goals ?? 0), 0);

      const totalGoalsScored = homeGoalsScored + awayGoalsScored;
      const totalGoalsConceded = homeGoalsConceded + awayGoalsConceded;

      return {
        homeMatches,
        awayMatches,
        allMatches,
        homeWins,
        homeDraws,
        homeLosses,
        awayWins,
        awayDraws,
        awayLosses,
        totalWins,
        totalDraws,
        totalLosses,
        homeGoalsScored,
        homeGoalsConceded,
        awayGoalsScored,
        awayGoalsConceded,
        totalGoalsScored,
        totalGoalsConceded,
        winPercentage: allMatches.length > 0 ? (totalWins / allMatches.length) * 100 : 0,
      };
    } catch (error) {
      console.error(`Error getting stats for team ${teamId}:`, error);
      return {
        homeMatches: [],
        awayMatches: [],
        allMatches: [],
        homeWins: 0,
        homeDraws: 0,
        homeLosses: 0,
        awayWins: 0,
        awayDraws: 0,
        awayLosses: 0,
        totalWins: 0,
        totalDraws: 0,
        totalLosses: 0,
        homeGoalsScored: 0,
        homeGoalsConceded: 0,
        awayGoalsScored: 0,
        awayGoalsConceded: 0,
        totalGoalsScored: 0,
        totalGoalsConceded: 0,
        winPercentage: 0,
      };
    }
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section id="teams" className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Csapatok</h2>
        </div>
        <div className="flex items-center justify-center p-8 bg-white/5 rounded-xl ring-1 ring-white/10">
          <div className="text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 mb-4">
              <Icon icon="lucide:loader" className="animate-spin text-zinc-300" width={20} height={20} />
            </div>
            <p className="text-zinc-300">Csapatok betöltése...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="teams" className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Csapatok</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Icon icon="lucide:shield" width={16} height={16} />
          <span>Power Ranking alapján rendezve</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team, index) => {
          const stats = getTeamStats(team.id);

          const powerRankingClass =
            index < 4
              ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30'
              : index < 8
              ? 'bg-blue-500/20 text-blue-300 ring-blue-400/30'
              : index < 12
              ? 'bg-amber-500/20 text-amber-300 ring-amber-400/30'
              : 'bg-red-500/20 text-red-300 ring-red-400/30';

          return (
            <Card
              key={team.id}
              className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleTeamClick(team)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={team.logo || `https://img.heroui.chat/image/sports?w=100&h=100&u=${team.id}`}
                    alt={`${team.name} logo`}
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-white/20"
                    loading="lazy"
                  />
                  <div
                    className={`absolute -top-2 -right-2 h-6 w-6 rounded-full ${powerRankingClass} flex items-center justify-center text-xs font-bold ring-1`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-400">Mérkőzések: {stats.allMatches.length}</span>
                    <span className="text-xs text-zinc-400">|</span>
                    <span className="text-xs text-emerald-400">W: {stats.totalWins}</span>
                    <span className="text-xs text-amber-400">D: {stats.totalDraws}</span>
                    <span className="text-xs text-red-400">L: {stats.totalLosses}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Power Ranking</span>
                  <span className="text-sm font-medium text-white">{team.powerRanking.toFixed(1)}</span>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-xs"
                  onPress={() => handleTeamClick(team)}
                >
                  <Icon icon="lucide:bar-chart-2" width={14} height={14} className="mr-1" />
                  Részletek
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      {selectedTeam && (
        <TeamDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          team={selectedTeam}
          matches={matches || []}
          teamStats={getTeamStats(selectedTeam.id)}
          powerRanking={(teams.find(t => t.id === selectedTeam.id) as any)?.powerRanking || 0}
          rank={teams.findIndex(t => t.id === selectedTeam.id) + 1}
        />
      )}
    </section>
  );
};