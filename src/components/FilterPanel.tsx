
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Users, Trophy, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FilterPanelProps {
  params: any;
  updateParams: (params: any) => void;
  analyzeTeams: (homeTeam: string, awayTeam: string) => void;
  searchTeam: (team: string) => void;
  clearFilters: () => void;
  isLoading: boolean;
}

export const FilterPanel = ({ 
  params, 
  updateParams, 
  analyzeTeams, 
  searchTeam,
  clearFilters,
  isLoading 
}: FilterPanelProps) => {
  const [homeTeam, setHomeTeam] = useState(params.home_team || '');
  const [awayTeam, setAwayTeam] = useState(params.away_team || '');
  const [searchTeamName, setSearchTeamName] = useState(params.team || '');
  const [teamNames, setTeamNames] = useState<string[]>([]);

  // Load team names from Supabase on component mount
  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        const { data: homeTeamsData } = await supabase
          .from('matches')
          .select('home_team')
          .order('home_team');
        
        const { data: awayTeamsData } = await supabase
          .from('matches')
          .select('away_team')
          .order('away_team');

        // Combine and deduplicate team names
        const allTeams = new Set<string>();
        homeTeamsData?.forEach(row => allTeams.add(row.home_team));
        awayTeamsData?.forEach(row => allTeams.add(row.away_team));
        
        // Sort alphabetically
        const sortedTeams = Array.from(allTeams).sort((a, b) => a.localeCompare(b, 'hu'));
        setTeamNames(sortedTeams);
      } catch (error) {
        console.error('Error fetching team names:', error);
      }
    };

    fetchTeamNames();
  }, []);

  const handleAnalyzeTeams = () => {
    if (homeTeam && awayTeam) {
      analyzeTeams(homeTeam, awayTeam);
    }
  };

  const handleSearchTeam = () => {
    if (searchTeamName) {
      searchTeam(searchTeamName);
    }
  };

  const handleClearFilters = () => {
    setHomeTeam('');
    setAwayTeam('');
    setSearchTeamName('');
    clearFilters();
  };

  return (
    <div className="space-y-6">
      {/* Team Analysis Card */}
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-goal" />
            Csapat Elemzés
          </CardTitle>
          <CardDescription>
            Hasonlítson össze két csapatot és kapjon részletes előrejelzéseket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Hazai Csapat</Label>
              <Select value={homeTeam} onValueChange={setHomeTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Válasszon hazai csapatot" />
                </SelectTrigger>
                <SelectContent>
                  {teamNames.map((teamName) => (
                    <SelectItem key={teamName} value={teamName}>
                      {teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Vendég Csapat</Label>
              <Select value={awayTeam} onValueChange={setAwayTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Válasszon vendég csapatot" />
                </SelectTrigger>
                <SelectContent>
                  {teamNames.map((teamName) => (
                    <SelectItem key={teamName} value={teamName}>
                      {teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleAnalyzeTeams} 
            className="w-full"
            disabled={!homeTeam || !awayTeam || isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
            Csapatok Elemzése
          </Button>
        </CardContent>
      </Card>

      {/* Team Search Card */}
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-goal" />
            Csapat Keresés
          </CardTitle>
          <CardDescription>
            Keressen egy adott csapat összes meccsére
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Csapat Neve</Label>
            <Select value={searchTeamName} onValueChange={setSearchTeamName}>
              <SelectTrigger>
                <SelectValue placeholder="Válasszon keresendő csapatot" />
              </SelectTrigger>
              <SelectContent>
                {teamNames.map((teamName) => (
                  <SelectItem key={teamName} value={teamName}>
                    {teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSearchTeam} 
              className="flex-1"
              disabled={!searchTeamName || isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              Meccsek Keresése
            </Button>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Törlés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
