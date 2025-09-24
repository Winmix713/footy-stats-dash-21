import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Tabs, Tab, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Match, Team } from '../types/match';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  matches: Match[];
  teamStats: any;
  powerRanking: number;
  rank: number;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  isOpen,
  onClose,
  team,
  matches,
  teamStats,
  powerRanking,
  rank
}) => {
  const [selectedTab, setSelectedTab] = React.useState("stats");
  
  // Calculate form (last 5 matches)
  const recentForm = React.useMemo(() => {
    const allTeamMatches = [...teamStats.homeMatches, ...teamStats.awayMatches]
      .sort((a, b) => new Date(b.match_time).getTime() - new Date(a.match_time).getTime())
      .slice(0, 5);
    
    return allTeamMatches.map(match => {
      const isHome = match.home.id === team.id;
      let result: 'W' | 'D' | 'L';
      
      if (match.result_computed === 'D') {
        result = 'D';
      } else if (
        (isHome && match.result_computed === 'H') || 
        (!isHome && match.result_computed === 'A')
      ) {
        result = 'W';
      } else {
        result = 'L';
      }
      
      return {
        match,
        result,
        isHome,
        score: `${match.full_time_home_goals}-${match.full_time_away_goals}`,
        opponent: isHome ? match.away : match.home
      };
    });
  }, [team.id, teamStats]);
  
  // Prepare chart data
  const homeAwayData = [
    { name: 'Győzelmek', home: teamStats.homeWins, away: teamStats.awayWins },
    { name: 'Döntetlenek', home: teamStats.homeDraws, away: teamStats.awayDraws },
    { name: 'Vereségek', home: teamStats.homeLosses, away: teamStats.awayLosses },
  ];
  
  const goalsData = [
    { name: 'Lőtt gólok', home: teamStats.homeGoalsScored, away: teamStats.awayGoalsScored },
    { name: 'Kapott gólok', home: teamStats.homeGoalsConceded, away: teamStats.awayGoalsConceded },
  ];
  
  // Calculate power ranking factors
  const winRate = teamStats.allMatches.length > 0 
    ? (teamStats.totalWins / teamStats.allMatches.length) * 100 
    : 0;
  
  const goalDifference = teamStats.totalGoalsScored - teamStats.totalGoalsConceded;
  
  const formPoints = recentForm.reduce((sum, match) => {
    if (match.result === 'W') return sum + 3;
    if (match.result === 'D') return sum + 1;
    return sum;
  }, 0);
  
  // Get power ranking class based on rank
  const getPowerRankingClass = () => {
    if (rank <= 4) return "bg-emerald-500/20 text-emerald-300 ring-emerald-400/30";
    if (rank <= 8) return "bg-blue-500/20 text-blue-300 ring-blue-400/30";
    if (rank <= 12) return "bg-amber-500/20 text-amber-300 ring-amber-400/30";
    return "bg-red-500/20 text-red-300 ring-red-400/30";
  };
  
  // Get last 10 matches for form chart
  const formChartData = React.useMemo(() => {
    const last10Matches = [...teamStats.homeMatches, ...teamStats.awayMatches]
      .sort((a, b) => new Date(a.match_time).getTime() - new Date(b.match_time).getTime())
      .slice(-10);
    
    return last10Matches.map((match, index) => {
      const isHome = match.home.id === team.id;
      let points = 0;
      
      if (match.result_computed === 'D') {
        points = 1;
      } else if (
        (isHome && match.result_computed === 'H') || 
        (!isHome && match.result_computed === 'A')
      ) {
        points = 3;
      }
      
      return {
        name: `M${index + 1}`,
        points,
        opponent: isHome ? match.away_team : match.home_team
      };
    });
  }, [team.id, teamStats]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      backdrop="blur"
      className="modal-animation"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={team.logo || `https://img.heroui.chat/image/sports?w=100&h=100&u=${team.id}`}
                    alt={`${team.name} logo`}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">{team.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPowerRankingClass()}`}>
                        Power Ranking: #{rank} ({powerRanking.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody className="px-6 py-6">
              <Tabs 
                aria-label="Team details tabs" 
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab as any}
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-4",
                  cursor: "bg-primary",
                  tab: "px-0 h-10 data-[selected=true]:text-primary"
                }}
              >
                <Tab 
                  key="stats" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:bar-chart-2" width={18} height={18} />
                      <span>Statisztikák</span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm text-zinc-400 mb-2">Összes mérkőzés</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-emerald-400">{teamStats.totalWins}</div>
                          <div className="text-xs text-zinc-400">Győzelem</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-amber-400">{teamStats.totalDraws}</div>
                          <div className="text-xs text-zinc-400">Döntetlen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-red-400">{teamStats.totalLosses}</div>
                          <div className="text-xs text-zinc-400">Vereség</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm text-zinc-400 mb-2">Hazai mérkőzések</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-emerald-400">{teamStats.homeWins}</div>
                          <div className="text-xs text-zinc-400">Győzelem</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-amber-400">{teamStats.homeDraws}</div>
                          <div className="text-xs text-zinc-400">Döntetlen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-red-400">{teamStats.homeLosses}</div>
                          <div className="text-xs text-zinc-400">Vereség</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm text-zinc-400 mb-2">Vendég mérkőzések</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-emerald-400">{teamStats.awayWins}</div>
                          <div className="text-xs text-zinc-400">Győzelem</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-amber-400">{teamStats.awayDraws}</div>
                          <div className="text-xs text-zinc-400">Döntetlen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-red-400">{teamStats.awayLosses}</div>
                          <div className="text-xs text-zinc-400">Vereség</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm font-medium text-white mb-4">Hazai vs. Vendég eredmények</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={homeAwayData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#0c0f16',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="home" name="Hazai" fill="#10b981" />
                            <Bar dataKey="away" name="Vendég" fill="#0ea5e9" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm font-medium text-white mb-4">Gólok (Hazai vs. Vendég)</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={goalsData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#0c0f16',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="home" name="Hazai" fill="#10b981" />
                            <Bar dataKey="away" name="Vendég" fill="#0ea5e9" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                  
                  <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 mb-6">
                    <h4 className="text-sm font-medium text-white mb-4">Forma (utolsó 10 mérkőzés)</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={formChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                          <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 3]} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#0c0f16',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                            formatter={(value: any, name: any, props: any) => {
                              const match = props.payload;
                              return [
                                `${value} pont vs ${match.opponent}`,
                                name
                              ];
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="points"
                            name="Pontok"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#8b5cf6" }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  
                  <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                    <h4 className="text-sm font-medium text-white mb-3">Legutóbbi forma</h4>
                    <div className="flex items-center gap-2 mb-4">
                      {recentForm.map((match, index) => (
                        <div 
                          key={index} 
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ${
                            match.result === 'W' ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30' :
                            match.result === 'D' ? 'bg-amber-500/20 text-amber-300 ring-amber-400/30' :
                            'bg-red-500/20 text-red-300 ring-red-400/30'
                          }`}
                          title={`${match.isHome ? 'vs ' : '@'} ${match.opponent.name} (${match.score})`}
                        >
                          {match.result}
                        </div>
                      ))}
                    </div>
                  </Card>
                </Tab>
                
                <Tab 
                  key="power-ranking" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:trophy" width={18} height={18} />
                      <span>Power Ranking</span>
                    </div>
                  }
                >
                  <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Power Ranking</h4>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getPowerRankingClass()}`}>
                        #{rank} helyen
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <div className="text-5xl font-bold text-primary">{powerRanking.toFixed(1)}</div>
                      <div className="ml-4 text-sm text-zinc-400">
                        <p>A power ranking egy összetett mutató, amely a csapat teljesítményét értékeli.</p>
                        <p>Minél magasabb az érték, annál erősebb a csapat.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                        <h5 className="text-sm text-zinc-400 mb-2">Győzelmi arány</h5>
                        <div className="text-xl font-semibold text-white">{winRate.toFixed(1)}%</div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {teamStats.totalWins} győzelem / {teamStats.allMatches.length} mérkőzés
                        </div>
                      </Card>
                      
                      <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                        <h5 className="text-sm text-zinc-400 mb-2">Gólkülönbség</h5>
                        <div className={`text-xl font-semibold ${goalDifference > 0 ? 'text-emerald-400' : goalDifference < 0 ? 'text-red-400' : 'text-amber-400'}`}>
                          {goalDifference > 0 ? '+' : ''}{goalDifference}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {teamStats.totalGoalsScored} lőtt / {teamStats.totalGoalsConceded} kapott
                        </div>
                      </Card>
                      
                      <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                        <h5 className="text-sm text-zinc-400 mb-2">Forma (utolsó 5 meccs)</h5>
                        <div className="text-xl font-semibold text-white">{formPoints} / 15 pont</div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {recentForm.map(m => m.result).join(' - ')}
                        </div>
                      </Card>
                    </div>
                    
                    <div className="mt-6 bg-white/5 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-white mb-2">Power Ranking számítás</h5>
                      <p className="text-xs text-zinc-400 mb-2">
                        A power ranking az alábbi tényezők súlyozott átlaga:
                      </p>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                        <li>Győzelmi arány (40%): {(winRate * 0.4).toFixed(1)} pont</li>
                        <li>Gólkülönbség (30%): {(goalDifference * 0.3).toFixed(1)} pont</li>
                        <li>Utolsó 5 mérkőzés formája (20%): {(formPoints / 15 * 100 * 0.2).toFixed(1)} pont</li>
                        <li>Hazai/vendég teljesítmény (10%): {(((teamStats.homeWins / (teamStats.homeMatches.length || 1)) + (teamStats.awayWins / (teamStats.awayMatches.length || 1))) * 50 * 0.1).toFixed(1)} pont</li>
                      </ul>
                    </div>
                  </Card>
                </Tab>
                
                <Tab 
                  key="matches" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:calendar" width={18} height={18} />
                      <span>Mérkőzések</span>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                      <h4 className="text-sm font-medium text-white mb-4">Legutóbbi mérkőzések</h4>
                      <div className="space-y-3">
                        {[...teamStats.homeMatches, ...teamStats.awayMatches]
                          .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)) // Use date field instead of match_time
                          .slice(0, 5)
                          .map((match, index) => {
                            const isHome = match.home.id === team.id;
                            const opponent = isHome ? match.away : match.home;
                            const result = 
                              match.result_computed === 'D' ? 'D' :
                              (isHome && match.result_computed === 'H') || (!isHome && match.result_computed === 'A') ? 'W' : 'L';
                            const resultClass = 
                              result === 'W' ? 'text-emerald-400' :
                              result === 'D' ? 'text-amber-400' : 'text-red-400';
                            
                            return (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ${
                                    result === 'W' ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30' :
                                    result === 'D' ? 'bg-amber-500/20 text-amber-300 ring-amber-400/30' :
                                    'bg-red-500/20 text-red-300 ring-red-400/30'
                                  }`}>
                                    {result}
                                  </div>
                                  <div>
                                    <div className="text-sm text-white">
                                      {isHome ? 'vs ' : '@'} {opponent.name}
                                    </div>
                                    <div className="text-xs text-zinc-400">
                                      {match.date ? new Date(match.date).toLocaleDateString('hu-HU') : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm font-medium text-white">
                                  {match.full_time_home_goals} - {match.full_time_away_goals}
                                  <span className={`ml-2 text-xs ${resultClass}`}>
                                    ({result})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                        <h4 className="text-sm font-medium text-white mb-4">Hazai mérkőzések</h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hidden">
                          {teamStats.homeMatches
                            .sort((a, b) => new Date(b.match_time).getTime() - new Date(a.match_time).getTime())
                            .map((match, index) => {
                              const result = 
                                match.result_computed === 'D' ? 'D' :
                                match.result_computed === 'H' ? 'W' : 'L';
                              const resultClass = 
                                result === 'W' ? 'text-emerald-400' :
                                result === 'D' ? 'text-amber-400' : 'text-red-400';
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs text-zinc-400">
                                      {new Date(match.match_time).toLocaleDateString('hu-HU')}
                                    </div>
                                    <div className="text-sm text-white">
                                      vs {match.away.name}
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {match.full_time_home_goals} - {match.full_time_away_goals}
                                    <span className={`ml-2 text-xs ${resultClass}`}>
                                      ({result})
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </Card>
                      
                      <Card className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                        <h4 className="text-sm font-medium text-white mb-4">Vendég mérkőzések</h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hidden">
                          {teamStats.awayMatches
                            .sort((a, b) => new Date(b.match_time).getTime() - new Date(a.match_time).getTime())
                            .map((match, index) => {
                              const result = 
                                match.result_computed === 'D' ? 'D' :
                                match.result_computed === 'A' ? 'W' : 'L';
                              const resultClass = 
                                result === 'W' ? 'text-emerald-400' :
                                result === 'D' ? 'text-amber-400' : 'text-red-400';
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs text-zinc-400">
                                      {new Date(match.match_time).toLocaleDateString('hu-HU')}
                                    </div>
                                    <div className="text-sm text-white">
                                      @ {match.home.name}
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {match.full_time_home_goals} - {match.full_time_away_goals}
                                    <span className={`ml-2 text-xs ${resultClass}`}>
                                      ({result})
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </Card>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            
            <ModalFooter className="px-6 py-4 border-t border-white/10 flex justify-end">
              <Button 
                variant="flat" 
                color="default"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-200 border border-white/10 hover:bg-white/5"
                onPress={onClose}
              >
                <Icon icon="lucide:x" width={16} height={16} />
                Bezárás
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};