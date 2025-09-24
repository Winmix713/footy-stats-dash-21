import { Match } from '../types/match';

// A spanyol csapatok adatai a megadott nevekkel - ABC sorrendben
export const spanishTeams = [
  { id: '1', name: 'Alaves', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Deportivo_Alav%C3%A9s_logo_%282020%29.svg/500px-Deportivo_Alav%C3%A9s_logo_%282020%29.svg.png' },
  { id: '2', name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/500px-FC_Barcelona_%28crest%29.svg.png' },
  { id: '3', name: 'Bilbao', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/500px-Club_Athletic_Bilbao_logo.svg.png' },
  { id: '4', name: 'Getafe', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Getafe_CF_logo.svg/500px-Getafe_CF_logo.svg.png' },
  { id: '5', name: 'Girona', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Girona_FC_logo.svg/500px-Girona_FC_logo.svg.png' },
  { id: '6', name: 'Las Palmas', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/UD_Las_Palmas_logo_%282022%29.svg/500px-UD_Las_Palmas_logo_%282022%29.svg.png' },
  { id: '7', name: 'Madrid Fehér', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/500px-Real_Madrid_CF.svg.png' },
  { id: '8', name: 'Madrid Piros', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/500px-Atletico_Madrid_2017_logo.svg.png' },
  { id: '9', name: 'Mallorca', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Rcd_mallorca.svg/500px-Rcd_mallorca.svg.png' },
  { id: '10', name: 'Osasuna', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/db/CA_Osasuna_logo.svg/500px-CA_Osasuna_logo.svg.png' },
  { id: '11', name: 'San Sebastian', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Real_Sociedad_logo.svg/500px-Real_Sociedad_logo.svg.png' },
  { id: '12', name: 'Sevilla Piros', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Sevilla_FC_logo.svg/500px-Sevilla_FC_logo.svg.png' },
  { id: '13', name: 'Sevilla Zöld', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Real_Betis_logo.svg/500px-Real_Betis_logo.svg.png' },
  { id: '14', name: 'Valencia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Valencia_CF_logo.svg/500px-Valencia_CF_logo.svg.png' },
  { id: '15', name: 'Vigo', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/RC_Celta_de_Vigo_logo.svg/500px-RC_Celta_de_Vigo_logo.svg.png' },
  { id: '16', name: 'Villarreal', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/70/Villarreal_CF_logo.svg/500px-Villarreal_CF_logo.svg.png' },
];

// Remove the old teams array since we're now using the exported spanishTeams
// const teams = [ ... ];

const generateRandomMatches = (count: number): Match[] => {
  // Generate more realistic match data
  const matches: Match[] = [];
  const baseDate = new Date('2024-01-01');

  for (let i = 0; i < count; i++) {
    // Ensure home and away teams are different
    let homeIndex = Math.floor(Math.random() * spanishTeams.length);
    let awayIndex = Math.floor(Math.random() * spanishTeams.length);
    while (homeIndex === awayIndex) {
      awayIndex = Math.floor(Math.random() * spanishTeams.length);
    }

    const homeTeam = spanishTeams[homeIndex];
    const awayTeam = spanishTeams[awayIndex];

    // Generate realistic scores with home advantage
    const homeAdvantage = Math.random() < 0.55; // 55% chance of home advantage
    const htHomeScore = Math.floor(Math.random() * (homeAdvantage ? 3 : 2));
    const htAwayScore = Math.floor(Math.random() * (homeAdvantage ? 2 : 3));
    
    // Full time scores should be at least equal to half time scores
    const ftHomeScore = htHomeScore + Math.floor(Math.random() * (homeAdvantage ? 3 : 2));
    const ftAwayScore = htAwayScore + Math.floor(Math.random() * (homeAdvantage ? 2 : 3));

    // Determine if both teams scored
    const btts = ftHomeScore > 0 && ftAwayScore > 0;

    // Determine if there was a comeback
    // A comeback happens when the team that was losing at half time ends up winning or drawing
    const comeback = (htHomeScore < htAwayScore && ftHomeScore >= ftAwayScore) || 
                     (htHomeScore > htAwayScore && ftHomeScore <= ftAwayScore);

    // Generate a date within the last year
    const matchDate = new Date(baseDate.getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
    
    // Format time as HH:MM:SS to match SQL schema
    const hours = matchDate.getHours().toString().padStart(2, '0');
    const minutes = matchDate.getMinutes().toString().padStart(2, '0');
    const seconds = matchDate.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Create match object aligned with database structure
    matches.push({
      id: `match-${i + 1}`,
      match_time: timeString, // Use time string format instead of Date
      home_team: homeTeam.name,
      away_team: awayTeam.name,
      half_time_home_goals: htHomeScore,
      half_time_away_goals: htAwayScore,
      full_time_home_goals: ftHomeScore,
      full_time_away_goals: ftAwayScore,
      match_status: 'completed',
      btts_computed: ftHomeScore > 0 && ftAwayScore > 0,
      comeback_computed: (htHomeScore < htAwayScore && ftHomeScore >= ftAwayScore) || 
                         (htHomeScore > htAwayScore && ftHomeScore <= ftAwayScore),
      result_computed: ftHomeScore > ftAwayScore ? 'H' : ftHomeScore < ftAwayScore ? 'A' : 'D',
      
      // Keep these for compatibility with existing components
      home: homeTeam,
      away: awayTeam,
      htScore: {
        home: htHomeScore,
        away: htAwayScore
      },
      ftScore: {
        home: ftHomeScore,
        away: ftAwayScore
      },
      btts: ftHomeScore > 0 && ftAwayScore > 0,
      comeback: (htHomeScore < htAwayScore && ftHomeScore >= ftAwayScore) || 
                (htHomeScore > htAwayScore && ftHomeScore <= ftAwayScore),
      
      // Keep date field for backward compatibility
      date: matchDate
    });
  }

  return matches;
};

// Generate 200 random matches instead of 5000 for better performance
export const mockMatches = generateRandomMatches(200);