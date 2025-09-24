import axios from 'axios';
import { 
  validateWinmixApiResponse, 
  validateApiResponse, 
  type Match, 
  type TeamAnalysis, 
  type Prediction, 
  type ApiResponse,
  type WinmixMatch,
  type WinmixApiResponse
} from '../schemas/footballSchemas';

// Re-export types for backward compatibility
export type { Match, TeamAnalysis, Prediction, ApiResponse };

// Simple config and logger
const API_ENDPOINTS = {
  WINMIX_MATCHES: 'https://api.winmix.hu/matches'
};

const apiLogger = {
  info: (msg: string, data?: any, context?: string) => console.log(`[${context}] ${msg}`, data),
  warn: (msg: string, data?: any, context?: string) => console.warn(`[${context}] ${msg}`, data),
  error: (msg: string, data?: any, context?: string) => console.error(`[${context}] ${msg}`, data)
};

const getApiConfig = () => ({
  timeout: 10000,
  dataSources: ['mock'] as ('mock' | 'winmix' | 'github' | 'php')[]
});

class FootballApiService {
  private config = getApiConfig();

  async fetchData(params: Record<string, string> = {}): Promise<ApiResponse> {
    // For now, just return mock data
    apiLogger.info('Using mock data', { params }, 'service');
    return this.getMockData(params);
  }

  private getMockData(params: Record<string, string> = {}): ApiResponse {
    // Mock teams
    const mockTeams = [
      'Aston Villa', 'Brentford', 'Brighton', 'Chelsea', 'Crystal Palace',
      'Everton', 'Fulham', 'Liverpool', 'Arsenal', 'Manchester City',
      'Newcastle', 'Nottingham Forest', 'Tottenham', 'Manchester United', 'West Ham', 'Wolverhampton'
    ];

    const generateMockMatch = (homeTeam: string, awayTeam: string, daysAgo: number): Match => {
      const homeScore = Math.floor(Math.random() * 4);
      const awayScore = Math.floor(Math.random() * 4);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: (Date.now() + Math.random()).toString(),
        home_team: homeTeam,
        away_team: awayTeam,
        score: { home: homeScore, away: awayScore },
        date: date.toISOString().split('T')[0]
      };
    };

    const mockMatches: Match[] = [];
    for (let i = 0; i < 100; i++) {
      const homeTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      let awayTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      while (awayTeam === homeTeam) {
        awayTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      }
      mockMatches.push(generateMockMatch(homeTeam, awayTeam, i));
    }

    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.page_size) || 100;
    const startIndex = (page - 1) * pageSize;
    const paginatedMatches = mockMatches.slice(startIndex, startIndex + pageSize);

    const mockResponse = {
      total_matches: mockMatches.length,
      page,
      page_size: pageSize,
      matches: paginatedMatches,
      teams: mockTeams
    };

    try {
      return validateApiResponse(mockResponse);
    } catch (error) {
      apiLogger.error('Mock data validation failed', error, 'mock');
      return {
        total_matches: 0,
        page: 1,
        page_size: pageSize,
        matches: [],
        teams: mockTeams,
        error: 'Mock data validation failed'
      };
    }
  }
}

export const footballApi = new FootballApiService();