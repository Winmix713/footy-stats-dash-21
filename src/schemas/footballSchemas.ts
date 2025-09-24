import { z } from 'zod';

// Updated schemas to match winmix.hu API format
export const WinmixMatchSchema = z.object({
  match_id: z.number(),
  league_id: z.number(),
  date: z.string(),
  home_team: z.string().min(1, "Home team is required"),
  away_team: z.string().min(1, "Away team is required"), 
  score: z.object({
    home: z.number().min(0, "Home score must be non-negative"),
    away: z.number().min(0, "Away score must be non-negative")
  }),
  both_teams_scored: z.boolean()
});

export const WinmixApiResponseSchema = z.object({
  matches: z.array(WinmixMatchSchema)
});

// Base schemas for our internal use (backward compatibility)
export const MatchSchema = z.object({
  id: z.string().optional(),
  home_team: z.string().min(1, "Home team is required"),
  away_team: z.string().min(1, "Away team is required"), 
  score: z.object({
    home: z.number().min(0, "Home score must be non-negative"),
    away: z.number().min(0, "Away score must be non-negative")
  }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
});

export const TeamAnalysisSchema = z.object({
  home_team: z.string().min(1),
  away_team: z.string().min(1),
  matches_count: z.number().min(0),
  both_teams_scored_percentage: z.number().min(0).max(100),
  average_goals: z.object({
    average_total_goals: z.number().min(0),
    average_home_goals: z.number().min(0),
    average_away_goals: z.number().min(0)
  }),
  home_form_index: z.number().min(0).max(100),
  away_form_index: z.number().min(0).max(100),
  head_to_head_stats: z.object({
    home_wins: z.number().min(0),
    away_wins: z.number().min(0),
    draws: z.number().min(0),
    home_win_percentage: z.number().min(0).max(100),
    away_win_percentage: z.number().min(0).max(100),
    draw_percentage: z.number().min(0).max(100)
  })
});

export const PredictionSchema = z.object({
  homeExpectedGoals: z.number().min(0),
  awayExpectedGoals: z.number().min(0),
  bothTeamsToScoreProb: z.number().min(0).max(100),
  predictedWinner: z.enum(['home', 'away', 'draw']),
  confidence: z.number().min(0).max(1),
  modelPredictions: z.object({
    randomForest: z.string(),
    poisson: z.object({
      homeGoals: z.number().min(0),
      awayGoals: z.number().min(0)
    }),
    elo: z.object({
      homeWinProb: z.number().min(0).max(1),
      drawProb: z.number().min(0).max(1),
      awayWinProb: z.number().min(0).max(1)
    })
  }).optional()
});

export const ApiResponseSchema = z.object({
  total_matches: z.number().min(0),
  page: z.number().min(1),
  page_size: z.number().min(1),
  matches: z.array(MatchSchema),
  team_analysis: TeamAnalysisSchema.optional(),
  prediction: PredictionSchema.optional(),
  teams: z.array(z.string()),
  error: z.string().optional()
});

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
  timestamp: z.string().optional()
});

// Type exports
export type WinmixMatch = z.infer<typeof WinmixMatchSchema>;
export type WinmixApiResponse = z.infer<typeof WinmixApiResponseSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type TeamAnalysis = z.infer<typeof TeamAnalysisSchema>;
export type Prediction = z.infer<typeof PredictionSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

// Validation helper functions
export const validateWinmixApiResponse = (data: unknown): WinmixApiResponse => {
  try {
    return WinmixApiResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Winmix API Response validation failed: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
};

export const validateApiResponse = (data: unknown): ApiResponse => {
  try {
    return ApiResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`API Response validation failed: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
};

export const validateMatch = (data: unknown): Match => {
  return MatchSchema.parse(data);
};

export const validateTeamAnalysis = (data: unknown): TeamAnalysis => {
  return TeamAnalysisSchema.parse(data);
};

export const validatePrediction = (data: unknown): Prediction => {
  return PredictionSchema.parse(data);
};
