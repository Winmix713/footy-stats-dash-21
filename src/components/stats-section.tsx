import React from 'react';
import { Button, Card, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { MatchStats } from '../types/match';
import { ResultsChart } from './charts/results-chart';
import { BTTSChart } from './charts/btts-chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useMatchData } from '../hooks/use-match-data';

interface StatsSectionProps {
  stats: MatchStats;
  onExtendedStatsClick: () => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, onExtendedStatsClick }) => {
  const { isSupabaseConnected, totalMatchCount } = useMatchData();
  
  // Calculate percentages for stats display
  const homeWinPercentage = stats.total > 0 ? Math.round((stats.homeWins / stats.total) * 100) : 0;
  const drawPercentage = stats.total > 0 ? Math.round((stats.draws / stats.total) * 100) : 0;
  const awayWinPercentage = stats.total > 0 ? Math.round((stats.awayWins / stats.total) * 100) : 0;
  
  // State for trend chart visibility
  const [showTrends, setShowTrends] = React.useState(false);
  
  // References for chart export functionality
  const resultsChartRef = React.useRef(null);
  const bttsChartRef = React.useRef(null);
  
  // Sample trend data (would be replaced with real data in production)
  const trendData = [
    { month: 'Jan', homeWins: 12, draws: 5, awayWins: 8 },
    { month: 'Feb', homeWins: 10, draws: 7, awayWins: 9 },
    { month: 'Mar', homeWins: 14, draws: 4, awayWins: 7 },
    { month: 'Apr', homeWins: 9, draws: 6, awayWins: 10 },
    { month: 'May', homeWins: 11, draws: 8, awayWins: 6 },
    { month: 'Jun', homeWins: 13, draws: 5, awayWins: 7 },
  ];
  
  // Function to export chart as PNG
  const exportChart = (chartRef: any, filename: string) => {
    if (!chartRef.current) return;
    
    try {
      // Implementation would go here in production
      console.log(`Exporting ${filename} chart...`);
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  return (
    <section id="stats" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Statisztikák</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            color="default"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5"
            onPress={onExtendedStatsClick}
          >
            <Icon icon="lucide:chart-line" width={16} height={16} />
            Bővített statisztika
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <Icon icon="lucide:info" width={16} height={16} />
            <span>
              {isSupabaseConnected 
                ? `Szűrt eredmények alapján (${totalMatchCount} mérkőzés)` 
                : "Minta adatok alapján"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Összes mérkőzés</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <Icon icon="lucide:list" className="text-zinc-200" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {isSupabaseConnected ? totalMatchCount : stats.total}
            {!isSupabaseConnected && (
              <span className="text-xs text-zinc-500 ml-2">(minta)</span>
            )}
          </p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Hazai győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 ring-1 ring-emerald-400/30">
              <Icon icon="lucide:circle-dot" className="text-emerald-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.homeWins}</p>
          <p className="text-xs text-zinc-400">{homeWinPercentage}%</p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Döntetlen</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-400/10 ring-1 ring-amber-400/30">
              <Icon icon="lucide:minus" className="text-amber-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.draws}</p>
          <p className="text-xs text-zinc-400">{drawPercentage}%</p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Vendég győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-sky-400/10 ring-1 ring-sky-400/30">
              <Icon icon="lucide:circle" className="text-sky-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.awayWins}</p>
          <p className="text-xs text-zinc-400">{awayWinPercentage}%</p>
        </Card>
      </div>

      {/* Részletes statisztika */}
      <Card className="mt-6 ring-1 ring-white/10 bg-white/5 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-white">Részletes statisztika</h3>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Icon icon="lucide:chart-bar" width={16} height={16} />
            <span>Megoszlások</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-300">Eredmény megoszlás (H/D/V)</p>
              <Tooltip content="Diagram exportálása PNG formátumban">
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  isIconOnly
                  aria-label="Eredmény diagram exportálása"
                  onPress={() => exportChart(resultsChartRef, 'eredmenyek')}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <Icon icon="lucide:download" width={14} height={14} />
                </Button>
              </Tooltip>
            </div>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56">
                <ResultsChart 
                  ref={resultsChartRef}
                  homeWins={stats.homeWins} 
                  draws={stats.draws} 
                  awayWins={stats.awayWins} 
                />
              </div>
            </div>
          </Card>
          <Card className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-300">BTTS (Mindkét csapat gólt szerzett)</p>
              <Tooltip content="Diagram exportálása PNG formátumban">
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  isIconOnly
                  aria-label="BTTS diagram exportálása"
                  onPress={() => exportChart(bttsChartRef, 'btts')}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <Icon icon="lucide:download" width={14} height={14} />
                </Button>
              </Tooltip>
            </div>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56">
                <BTTSChart 
                  ref={bttsChartRef}
                  bttsCount={stats.bttsCount} 
                  nonBttsCount={stats.total - stats.bttsCount} 
                />
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Add trend analysis section */}
      <Card className="mt-6 ring-1 ring-white/10 bg-white/5 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-white">Eredmény trendek</h3>
          <Button
            variant="flat"
            color="default"
            size="sm"
            className="text-zinc-300"
            onPress={() => setShowTrends(!showTrends)}
          >
            {showTrends ? 'Elrejtés' : 'Megjelenítés'}
            <Icon icon={showTrends ? "lucide:chevron-up" : "lucide:chevron-down"} width={16} height={16} className="ml-1" />
          </Button>
        </div>
        
        {showTrends && (
          <div className="mt-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c0f16', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="homeWins" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                    name="Hazai győzelmek"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="draws" 
                    stackId="1"
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.3}
                    name="Döntetlenek"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="awayWins" 
                    stackId="1"
                    stroke="#0ea5e9" 
                    fill="#0ea5e9" 
                    fillOpacity={0.3}
                    name="Vendég győzelmek"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400 mt-2 text-center">
              Eredmények havi eloszlása az elmúlt egy évben
            </p>
          </div>
        )}
      </Card>
    </section>
  );
};