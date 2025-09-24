// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Match } from '../types/match';

// Environment variables - make sure these are set in your .env file
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Initialize Supabase client - will be null if environment variables are not set
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Log initialization status for debugging
if (!supabase) {
  console.warn('Supabase client not initialized. Check environment variables VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
} else {
  console.log('Supabase client initialized successfully');
}

export interface MatchFilters {
  home_team?: string;
  away_team?: string;
  btts?: boolean;
  comeback?: boolean;
  startDate?: string;
  endDate?: string;
  league?: string;
  country?: string;
  season?: string;
  minHomeGoals?: number;
  maxHomeGoals?: number;
  minAwayGoals?: number;
  maxAwayGoals?: number;
  result?: string;
}

// Fixed function to fetch matches from Supabase
export const fetchMatches = async (
  filters: MatchFilters = {},
  page: number = 1,
  pageSize: number = 10,
  sortKey: string = 'match_time',
  sortDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: any[], count: number }> => {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized. Check your environment variables.');
      return { data: [], count: 0 };
    }
    
    let query = supabase
      .from('matches')
      .select('*')
      .order(sortKey === 'match_time' ? 'match_time' : 'id', { ascending: sortDirection === 'asc' });

    // Apply filters
    if (filters.home_team) {
      query = query.eq('home_team', filters.home_team);
    }
    
    if (filters.away_team) {
      query = query.eq('away_team', filters.away_team);
    }
    
    if (filters.btts !== undefined) {
      query = query.eq('btts_computed', filters.btts);
    }
    
    if (filters.comeback !== undefined) {
      query = query.eq('comeback_computed', filters.comeback);
    }
    
    if (filters.startDate) {
      query = query.gte('match_time', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('match_time', filters.endDate);
    }
    
    if (filters.minHomeGoals !== undefined) {
      query = query.gte('full_time_home_goals', filters.minHomeGoals);
    }
    
    if (filters.maxHomeGoals !== undefined) {
      query = query.lte('full_time_home_goals', filters.maxHomeGoals);
    }
    
    if (filters.minAwayGoals !== undefined) {
      query = query.gte('full_time_away_goals', filters.minAwayGoals);
    }
    
    if (filters.maxAwayGoals !== undefined) {
      query = query.lte('full_time_away_goals', filters.maxAwayGoals);
    }
    
    if (filters.result) {
      query = query.eq('result_computed', filters.result);
    }

    // Get total count - use the same query filters for accurate count
    let countQuery = supabase.from('matches').select('*', { count: 'exact', head: true });
    
    // Apply the same filters to count query
    if (filters.home_team) countQuery = countQuery.eq('home_team', filters.home_team);
    if (filters.away_team) countQuery = countQuery.eq('away_team', filters.away_team);
    if (filters.btts !== undefined) countQuery = countQuery.eq('btts_computed', filters.btts);
    if (filters.comeback !== undefined) countQuery = countQuery.eq('comeback_computed', filters.comeback);
    if (filters.startDate) countQuery = countQuery.gte('match_time', filters.startDate);
    if (filters.endDate) countQuery = countQuery.lte('match_time', filters.endDate);
    if (filters.minHomeGoals !== undefined) countQuery = countQuery.gte('full_time_home_goals', filters.minHomeGoals);
    if (filters.maxHomeGoals !== undefined) countQuery = countQuery.lte('full_time_home_goals', filters.maxHomeGoals);
    if (filters.minAwayGoals !== undefined) countQuery = countQuery.gte('full_time_away_goals', filters.minAwayGoals);
    if (filters.maxAwayGoals !== undefined) countQuery = countQuery.lte('full_time_away_goals', filters.maxAwayGoals);
    if (filters.result) countQuery = countQuery.eq('result_computed', filters.result);

    const { count } = await countQuery;

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }

    // Transform Supabase data to Match format
    const transformedData = (data || []).map(transformSupabaseMatch);

    return { data: transformedData, count: count || 0 };
  } catch (error) {
    console.error('Error in fetchMatches:', error);
    return { data: [], count: 0 };
  }
};

// Function to test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const transformSupabaseMatch = (supabaseMatch: any): Match => {
  return {
    id: supabaseMatch.id?.toString() || Math.random().toString(),
    date: supabaseMatch.match_time || new Date().toISOString(),
    home: {
      id: supabaseMatch.home_team || 'home',
      name: supabaseMatch.home_team || 'Home Team',
      logo: ''
    },
    away: {
      id: supabaseMatch.away_team || 'away', 
      name: supabaseMatch.away_team || 'Away Team',
      logo: ''
    },
    htScore: {
      home: supabaseMatch.half_time_home_goals || 0,
      away: supabaseMatch.half_time_away_goals || 0
    },
    ftScore: {
      home: supabaseMatch.full_time_home_goals || 0,
      away: supabaseMatch.full_time_away_goals || 0
    },
    btts: supabaseMatch.btts_computed || false,
    comeback: supabaseMatch.comeback_computed || false,
    league: supabaseMatch.league,
    country: supabaseMatch.country,
    season: supabaseMatch.season,
    match_status: supabaseMatch.match_status,
    result_computed: supabaseMatch.result_computed,
    // Include original fields for compatibility
    home_team: supabaseMatch.home_team,
    away_team: supabaseMatch.away_team,
    home_team_id: supabaseMatch.home_team_id,
    away_team_id: supabaseMatch.away_team_id,
    half_time_home_goals: supabaseMatch.half_time_home_goals,
    half_time_away_goals: supabaseMatch.half_time_away_goals,
    full_time_home_goals: supabaseMatch.full_time_home_goals,
    full_time_away_goals: supabaseMatch.full_time_away_goals,
    btts_computed: supabaseMatch.btts_computed,
    comeback_computed: supabaseMatch.comeback_computed
  };
};
