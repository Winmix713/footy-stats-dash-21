import { Match, Team } from '../types/match';

export const calculateTeamPowerRanking = (team: Team, matches: Match[]): number => {
  try {
    // Simple power ranking calculation
    // In a real app this would be more sophisticated
    
    // Filter matches for this team
    const teamMatches = matches.filter(match => 
      match.home_team === team.name || match.away_team === team.name
    );

    if (teamMatches.length === 0) return 0;

    let points = 0;
    let totalMatches = 0;

    teamMatches.forEach(match => {
      totalMatches++;
      
      const isHome = match.home_team === team.name;
      const homeGoals = match.full_time_home_goals || 0;
      const awayGoals = match.full_time_away_goals || 0;
      
      if (isHome) {
        if (homeGoals > awayGoals) points += 3; // Win
        else if (homeGoals === awayGoals) points += 1; // Draw
      } else {
        if (awayGoals > homeGoals) points += 3; // Win
        else if (awayGoals === homeGoals) points += 1; // Draw
      }
    });

    // Calculate average points per game
    return totalMatches > 0 ? points / totalMatches : 0;
  } catch (error) {
    console.error('Error calculating power ranking:', error);
    return 0;
  }
};