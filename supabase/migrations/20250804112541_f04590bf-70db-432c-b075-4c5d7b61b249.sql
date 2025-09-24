
-- Create leagues table for the two virtual competitions
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  season TEXT NOT NULL DEFAULT '2024-25',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(name, league_id)
);

-- Create matches table with detailed structure
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  match_time TIMESTAMP WITH TIME ZONE NOT NULL,
  half_time_home_goals INTEGER NOT NULL DEFAULT 0,
  half_time_away_goals INTEGER NOT NULL DEFAULT 0,
  full_time_home_goals INTEGER NOT NULL DEFAULT 0,
  full_time_away_goals INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT positive_goals CHECK (
    half_time_home_goals >= 0 AND 
    half_time_away_goals >= 0 AND 
    full_time_home_goals >= 0 AND 
    full_time_away_goals >= 0
  ),
  CONSTRAINT half_time_not_greater_than_full_time CHECK (
    half_time_home_goals <= full_time_home_goals AND 
    half_time_away_goals <= full_time_away_goals
  )
);

-- Create team statistics table for cached calculations
CREATE TABLE public.team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  matches_played INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  form_index INTEGER NOT NULL DEFAULT 50,
  both_teams_scored_count INTEGER NOT NULL DEFAULT 0,
  both_teams_scored_percentage INTEGER NOT NULL DEFAULT 0,
  average_goals_per_match DECIMAL(3,2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, league_id)
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  home_expected_goals DECIMAL(3,2) NOT NULL,
  away_expected_goals DECIMAL(3,2) NOT NULL,
  both_teams_score_prob INTEGER NOT NULL,
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('home', 'away', 'draw')),
  confidence DECIMAL(3,2) NOT NULL,
  model_predictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(match_id)
);

-- Insert the two virtual leagues
INSERT INTO public.leagues (name, display_name, country) VALUES
('premier_league_virtual', 'Virtuális Premier League', 'England'),
('la_liga_virtual', 'Virtuális Spanyol Bajnokság', 'Spain');

-- Insert Premier League teams
INSERT INTO public.teams (name, league_id) 
SELECT team_name, (SELECT id FROM public.leagues WHERE name = 'premier_league_virtual')
FROM (VALUES 
  ('Aston Oroszlán'),
  ('Brentford'),
  ('Brighton'),
  ('Chelsea'),
  ('Crystal Palace'),
  ('Everton'),
  ('Fulham'),
  ('Liverpool'),
  ('London Ágyúk'),
  ('Manchester Kék'),
  ('Newcastle'),
  ('Nottingham'),
  ('Tottenham'),
  ('Vörös Ördögök'),
  ('West Ham'),
  ('Wolverhampton')
) AS teams(team_name);

-- Insert Spanish League teams
INSERT INTO public.teams (name, league_id) 
SELECT team_name, (SELECT id FROM public.leagues WHERE name = 'la_liga_virtual')
FROM (VALUES 
  ('Alaves'),
  ('Barcelona'),
  ('Bilbao'),
  ('Girona'),
  ('Las Palmas'),
  ('Madrid Fehér'),
  ('Madrid Piros'),
  ('Mallorca'),
  ('Osasuna'),
  ('San Sebastian'),
  ('Sevilla Piros'),
  ('Sevilla Zöld'),
  ('Valencia'),
  ('Vigo'),
  ('Villarreal')
) AS teams(team_name);

-- Create indexes for performance
CREATE INDEX idx_matches_league_id ON public.matches(league_id);
CREATE INDEX idx_matches_teams ON public.matches(home_team_id, away_team_id);
CREATE INDEX idx_matches_time ON public.matches(match_time);
CREATE INDEX idx_team_statistics_team_league ON public.team_statistics(team_id, league_id);
CREATE INDEX idx_predictions_match ON public.predictions(match_id);

-- Enable Row Level Security (for future authentication if needed)
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is a public football app)
CREATE POLICY "Allow public read access to leagues" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Allow public read access to teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access to matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access to team_statistics" ON public.team_statistics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to predictions" ON public.predictions FOR SELECT USING (true);

-- For now, also allow public insert/update for development (you can restrict this later)
CREATE POLICY "Allow public insert to matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to matches" ON public.matches FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to team_statistics" ON public.team_statistics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to team_statistics" ON public.team_statistics FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to predictions" ON public.predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to predictions" ON public.predictions FOR UPDATE USING (true);
