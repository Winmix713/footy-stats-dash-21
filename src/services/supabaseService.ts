import { supabase } from '@/integrations/supabase/client';
import { 
  type Match, 
  type TeamAnalysis, 
  type Prediction, 
  type ApiResponse 
} from '@/schemas/footballSchemas';

export interface League {
  id: number;
  name: string;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface SupabaseMatch {
  id: number;
  home_team: string;
  away_team: string;
  match_time: string;
  half_time_home_goals: number | null;
  half_time_away_goals: number | null;
  full_time_home_goals: number;
  full_time_away_goals: number;
  match_status: string;
  btts_computed: boolean | null;
  comeback_computed: boolean | null;
  result_computed: string | null;
}

class SupabaseService {
  async getLeagues(): Promise<League[]> {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getMatches(params: {
    team?: string;
    home_team?: string;
    away_team?: string;
    date?: string;
    page?: number;
    page_size?: number;
  } = {}): Promise<ApiResponse> {
    let query = supabase
      .from('matches')
      .select('*')
      .order('match_time', { ascending: false });

    // Apply filters
    if (params.date) {
      query = query.gte('match_time', params.date);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true });

    // Apply pagination
    const page = params.page || 1;
    const pageSize = Math.min(params.page_size || 20, 100);
    const startIndex = (page - 1) * pageSize;

    query = query.range(startIndex, startIndex + pageSize - 1);

    const { data: matches, error } = await query;

    if (error) throw error;

    // Convert Supabase matches to our Match format
    const convertedMatches: Match[] = (matches || []).map(match => ({
      id: match.id.toString(),
      home_team: match.home_team || '',
      away_team: match.away_team || '',
      score: {
        home: match.full_time_home_goals,
        away: match.full_time_away_goals
      },
      date: match.match_time ? match.match_time.split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    // Filter by team names if specified
    let filteredMatches = convertedMatches;

    if (params.team) {
      filteredMatches = filteredMatches.filter(m => 
        m.home_team.toLowerCase().includes(params.team!.toLowerCase()) ||
        m.away_team.toLowerCase().includes(params.team!.toLowerCase())
      );
    }

    if (params.home_team && params.away_team) {
      filteredMatches = filteredMatches.filter(m => 
        (m.home_team.toLowerCase().includes(params.home_team!.toLowerCase()) &&
         m.away_team.toLowerCase().includes(params.away_team!.toLowerCase())) ||
        (m.home_team.toLowerCase().includes(params.away_team!.toLowerCase()) &&
         m.away_team.toLowerCase().includes(params.home_team!.toLowerCase()))
      );
    } else if (params.home_team) {
      filteredMatches = filteredMatches.filter(m => 
        m.home_team.toLowerCase().includes(params.home_team!.toLowerCase())
      );
    } else if (params.away_team) {
      filteredMatches = filteredMatches.filter(m => 
        m.away_team.toLowerCase().includes(params.away_team!.toLowerCase())
      );
    }

    // Get all teams for the response
    const teams = await this.getAllTeamNames();

    // Generate team analysis and prediction if both teams are specified
    let teamAnalysis: TeamAnalysis | undefined;
    let prediction: Prediction | undefined;

    if (params.home_team && params.away_team) {
      const stats = this.calculateTeamStats(params.home_team, params.away_team, filteredMatches);
      
      if (stats) {
        teamAnalysis = {
          home_team: params.home_team,
          away_team: params.away_team,
          ...stats
        };

        prediction = this.generatePrediction(params.home_team, params.away_team, stats);
      }
    }

    return {
      total_matches: count || 0,
      page,
      page_size: pageSize,
      matches: filteredMatches,
      team_analysis: teamAnalysis,
      prediction,
      teams
    };
  }

  async getAllTeamNames(): Promise<string[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('name')
      .order('name');

    if (error) throw error;
    return (data || []).map(team => team.name);
  }

  private calculateTeamStats(homeTeam: string, awayTeam: string, matches: Match[]) {
    const h2hMatches = matches.filter(m => 
      (m.home_team === homeTeam && m.away_team === awayTeam) ||
      (m.home_team === awayTeam && m.away_team === homeTeam)
    );

    if (h2hMatches.length === 0) return null;

    const homeWins = h2hMatches.filter(m => 
      (m.home_team === homeTeam && m.score.home > m.score.away) ||
      (m.away_team === homeTeam && m.score.away > m.score.home)
    ).length;

    const awayWins = h2hMatches.filter(m => 
      (m.home_team === awayTeam && m.score.home > m.score.away) ||
      (m.away_team === awayTeam && m.score.away > m.score.home)
    ).length;

    const draws = h2hMatches.filter(m => m.score.home === m.score.away).length;
    const totalMatches = h2hMatches.length;

    const totalGoals = h2hMatches.reduce((sum, m) => sum + m.score.home + m.score.away, 0);
    const bothTeamsScored = h2hMatches.filter(m => m.score.home > 0 && m.score.away > 0).length;

    // Calculate form indices
    const recentHomeMatches = matches
      .filter(m => m.home_team === homeTeam || m.away_team === homeTeam)
      .slice(-10);
    
    const recentAwayMatches = matches
      .filter(m => m.home_team === awayTeam || m.away_team === awayTeam)
      .slice(-10);

    const homeFormIndex = this.calculateFormIndex(homeTeam, recentHomeMatches);
    const awayFormIndex = this.calculateFormIndex(awayTeam, recentAwayMatches);

    return {
      matches_count: h2hMatches.length,
      both_teams_scored_percentage: Math.round((bothTeamsScored / totalMatches) * 100),
      average_goals: {
        average_total_goals: Number((totalGoals / totalMatches).toFixed(2)),
        average_home_goals: Number((h2hMatches.reduce((sum, m) => sum + m.score.home, 0) / totalMatches).toFixed(2)),
        average_away_goals: Number((h2hMatches.reduce((sum, m) => sum + m.score.away, 0) / totalMatches).toFixed(2))
      },
      home_form_index: homeFormIndex,
      away_form_index: awayFormIndex,
      head_to_head_stats: {
        home_wins: homeWins,
        away_wins: awayWins,
        draws: draws,
        home_win_percentage: Math.round((homeWins / totalMatches) * 100),
        away_win_percentage: Math.round((awayWins / totalMatches) * 100),
        draw_percentage: Math.round((draws / totalMatches) * 100)
      }
    };
  }

  private calculateFormIndex(team: string, recentMatches: Match[]): number {
    if (recentMatches.length === 0) return 50;
    
    let points = 0;
    recentMatches.forEach(match => {
      const isHome = match.home_team === team;
      const teamScore = isHome ? match.score.home : match.score.away;
      const opponentScore = isHome ? match.score.away : match.score.home;
      
      if (teamScore > opponentScore) points += 3; // Win
      else if (teamScore === opponentScore) points += 1; // Draw
    });
    
    const maxPoints = recentMatches.length * 3;
    return Math.round((points / maxPoints) * 100);
  }

  private generatePrediction(homeTeam: string, awayTeam: string, stats: any): Prediction {
    const homeExpected = 1 + Math.random() * 2;
    const awayExpected = 1 + Math.random() * 2;
    const winners: ('home' | 'away' | 'draw')[] = ['home', 'away', 'draw'];
    const predictedWinner = winners[Math.floor(Math.random() * winners.length)];

    return {
      homeExpectedGoals: Number(homeExpected.toFixed(2)),
      awayExpectedGoals: Number(awayExpected.toFixed(2)),
      bothTeamsToScoreProb: Math.round(60 + Math.random() * 30),
      predictedWinner,
      confidence: Number((0.4 + Math.random() * 0.4).toFixed(2)),
      modelPredictions: {
        randomForest: `${predictedWinner}_win`,
        poisson: {
          homeGoals: Math.round(homeExpected),
          awayGoals: Math.round(awayExpected)
        },
        elo: {
          homeWinProb: Number((0.2 + Math.random() * 0.4).toFixed(2)),
          drawProb: Number((0.2 + Math.random() * 0.3).toFixed(2)),
          awayWinProb: Number((0.2 + Math.random() * 0.4).toFixed(2))
        }
      }
    };
  }

  async insertMatch(match: {
    home_team: string;
    away_team: string;
    match_time: string;
    half_time_home_goals?: number;
    half_time_away_goals?: number;
    full_time_home_goals: number;
    full_time_away_goals: number;
  }) {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select();

    if (error) throw error;
    return data?.[0];
  }

  async getTeamByName(name: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('name', name)
      .single();

    if (error) return null;
    return data;
  }
}

export const supabaseService = new SupabaseService();