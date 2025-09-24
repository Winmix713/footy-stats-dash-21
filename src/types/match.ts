export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Match {
  id: string;
  date: string | Date; // Support both string and Date types
  home: Team;
  away: Team;
  htScore: {
    home: number;
    away: number;
  };
  ftScore: {
    home: number;
    away: number;
  };
  btts: boolean;
  comeback: boolean;
  league?: string;
  country?: string;
  season?: string;
  stats?: {
    xg?: {
      home?: number;
      away?: number;
    };
    possession?: {
      home?: number;
      away?: number;
    };
    shots?: {
      home?: number;
      away?: number;
    };
    shotsOnTarget?: {
      home?: number;
      away?: number;
    };
    corners?: {
      home?: number;
      away?: number;
    };
    fouls?: {
      home?: number;
      away?: number;
    };
    cards?: {
      yellow?: {
        home?: number;
        away?: number;
      };
      red?: {
        home?: number;
        away?: number;
      };
    };
    odds?: {
      home?: number;
      draw?: number;
      away?: number;
    };
  };
  
  // Support for database fields
  match_time?: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team?: string;
  away_team?: string;
  half_time_home_goals?: number;
  half_time_away_goals?: number;
  full_time_home_goals?: number;
  full_time_away_goals?: number;
  match_status?: 'completed' | 'scheduled' | 'cancelled' | 'postponed';
  btts_computed?: boolean;
  comeback_computed?: boolean;
  result_computed?: 'H' | 'A' | 'D';
}

export interface MatchStats {
  total: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  bttsCount: number;
  comebackCount: number;
  homeGoals: number;
  awayGoals: number;
  frequentResults: Array<{
    result: string;
    count: number;
    percentage: number;
  }>;
}

export type SortKey = 'home' | 'away' | 'ht' | 'ft' | 'btts' | 'comeback';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  homeTeam: Team | null;
  awayTeam: Team | null;
  btts: boolean | null;
  comeback: boolean | null;
}

export interface ResultsSectionProps {
  matches: Match[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number; // This now represents the total in the database, not just filtered
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  isLoadingPage?: boolean; // Add loading state for pagination
}
