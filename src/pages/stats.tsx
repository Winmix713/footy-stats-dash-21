import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMatchData } from '../hooks/use-match-data';
import { ResultsChart } from '../components/charts/results-chart';
import { BTTSChart } from '../components/charts/btts-chart';

const StatsPage: React.FC = () => {
  const { stats, setIsExtendedStatsModalOpen } = useMatchData();
  
  return (
    <div className="page-content">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">Részletes statisztikák</h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
          Az összes mérkőzés alapján készült részletes statisztikai elemzések.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Összes mérkőzés</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <Icon icon="lucide:list" className="text-zinc-200" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.total}</p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Hazai győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 ring-1 ring-emerald-400/30">
              <Icon icon="lucide:circle-dot" className="text-emerald-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.homeWins}</p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Döntetlen</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-400/10 ring-1 ring-amber-400/30">
              <Icon icon="lucide:minus" className="text-amber-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.draws}</p>
        </Card>
        <Card className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Vendég győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-sky-400/10 ring-1 ring-sky-400/30">
              <Icon icon="lucide:circle" className="text-sky-300" width={16} height={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{stats.awayWins}</p>
        </Card>
      </div>

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
            <p className="text-sm text-zinc-300 mb-2">Eredmény megoszlás (H/D/V)</p>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56">
                <ResultsChart 
                  homeWins={stats.homeWins} 
                  draws={stats.draws} 
                  awayWins={stats.awayWins} 
                />
              </div>
            </div>
          </Card>
          <Card className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-300 mb-2">BTTS (Mindkét csapat gólt szerzett)</p>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56">
                <BTTSChart 
                  bttsCount={stats.bttsCount} 
                  nonBttsCount={stats.total - stats.bttsCount} 
                />
              </div>
            </div>
          </Card>
        </div>
      </Card>
      
      <Card className="mt-6 ring-1 ring-white/10 bg-white/5 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold tracking-tight text-white">Leggyakoribb eredmények</h3>
          <button 
            className="text-sm text-primary flex items-center gap-1 hover:underline"
            onClick={() => setIsExtendedStatsModalOpen(true)}
          >
            <Icon icon="lucide:external-link" width={16} height={16} />
            Bővített statisztika
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.frequentResults.map((result, index) => (
            <Card key={index} className="bg-white/5 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-semibold text-white">{result.result}</div>
              <div className="text-xs text-zinc-400 mt-1">
                {result.count} mérkőzés ({result.percentage.toFixed(1)}%)
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatsPage;