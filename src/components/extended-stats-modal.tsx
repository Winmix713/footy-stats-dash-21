import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Team, MatchStats } from '../types/match';

interface ExtendedStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHomeTeam: Team | null;
  selectedAwayTeam: Team | null;
  stats: MatchStats;
}

export const ExtendedStatsModal: React.FC<ExtendedStatsModalProps> = ({
  isOpen,
  onClose,
  selectedHomeTeam,
  selectedAwayTeam,
  stats
}) => {
  // Add more detailed stats calculation
  const homeGoalAvg = stats.total > 0 ? (stats.homeGoals / stats.total).toFixed(2) : '0.0';
  const awayGoalAvg = stats.total > 0 ? (stats.awayGoals / stats.total).toFixed(2) : '0.0';
  const bttsPercentage = stats.total > 0 ? ((stats.bttsCount / stats.total) * 100).toFixed(1) : '0';
  const comebackPercentage = stats.total > 0 ? ((stats.comebackCount / stats.total) * 100).toFixed(1) : '0';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      className="modal-animation"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:chart-line" className="text-violet-300" width={20} height={20} />
                  <h3 className="text-2xl font-semibold tracking-tight">Bővített statisztika</h3>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="flex items-center gap-3">
                  {selectedHomeTeam ? (
                    <>
                      {selectedHomeTeam.logo && (
                        <img 
                          src={selectedHomeTeam.logo} 
                          alt="Hazai csapat logó" 
                          className="h-10 w-10 rounded-full ring-1 ring-white/10 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{selectedHomeTeam.name}</div>
                        <div className="text-xs text-zinc-400">Hazai csapat</div>
                      </div>
                    </>
                  ) : (
                    <div className="font-medium text-white">Összes hazai csapat</div>
                  )}
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-zinc-300">
                    <Icon icon="lucide:circle-dot" width={16} height={16} />
                    vs
                    <Icon icon="lucide:circle" width={16} height={16} />
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    {selectedAwayTeam ? (
                      <>
                        <div className="font-medium text-white">{selectedAwayTeam.name}</div>
                        <div className="text-xs text-zinc-400">Vendég csapat</div>
                      </>
                    ) : (
                      <div className="font-medium text-white">Összes vendég csapat</div>
                    )}
                  </div>
                  {selectedAwayTeam && selectedAwayTeam.logo && (
                    <img 
                      src={selectedAwayTeam.logo} 
                      alt="Vendég csapat logó" 
                      className="h-10 w-10 rounded-full ring-1 ring-white/10 object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody className="px-6 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-emerald-300">{stats.total}</div>
                  <div className="text-xs text-emerald-200 mt-1">Mérkőzések száma</div>
                </div>
                <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-emerald-300">{stats.homeWins}</div>
                  <div className="text-xs text-emerald-200 mt-1">Hazai győzelmek (H)</div>
                </div>
                <div className="rounded-xl bg-amber-500/10 ring-1 ring-amber-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-amber-300">{stats.draws}</div>
                  <div className="text-xs text-amber-200 mt-1">Döntetlenek (D)</div>
                </div>
                <div className="rounded-xl bg-sky-500/10 ring-1 ring-sky-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-sky-300">{stats.awayWins}</div>
                  <div className="text-xs text-sky-200 mt-1">Vendég győzelmek (A)</div>
                </div>
                <div className="rounded-xl bg-violet-500/10 ring-1 ring-violet-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-violet-300">{homeGoalAvg}</div>
                  <div className="text-xs text-violet-200 mt-1">Hazai gól átlag</div>
                </div>
                <div className="rounded-xl bg-indigo-500/10 ring-1 ring-indigo-400/30 p-4 text-center">
                  <div className="text-2xl font-semibold tracking-tight text-indigo-300">{awayGoalAvg}</div>
                  <div className="text-xs text-indigo-200 mt-1">Vendég gól átlag</div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm text-zinc-300 mb-2">
                  Összes mérkőzésből hány mérkőzésen szerzett mind a két csapat gólt (btts_computed): 
                  <span className="font-semibold"> {bttsPercentage}%</span>
                </div>
                <div className="text-sm text-zinc-300">
                  Fordítások aránya az összes mérkőzéshez képest (comeback_computed): 
                  <span className="font-semibold"> {comebackPercentage}%</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-zinc-200 mb-2 inline-flex items-center gap-2">
                  <Icon icon="lucide:trophy" width={16} height={16} />
                  Leggyakoribb eredmények
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-300">
                  {stats.frequentResults.map((result, index) => (
                    <li key={index}>
                      {result.result} ({result.count} mérkőzés, {result.percentage.toFixed(1)}%)
                    </li>
                  ))}
                  {stats.frequentResults.length === 0 && (
                    <li className="text-zinc-400">Nincs elegendő adat</li>
                  )}
                </ol>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-zinc-200 mb-2 inline-flex items-center gap-2">
                  <Icon icon="lucide:info" width={16} height={16} />
                  Adatbázis információ
                </h4>
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-xs text-zinc-400">
                  <p className="mb-1">A statisztikák a PostgreSQL adatbázisban tárolt <code className="bg-white/10 px-1 py-0.5 rounded">matches</code> tábla alapján készültek.</p>
                  <p className="mb-1">A tábla automatikusan számított mezőket használ:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><code className="bg-white/10 px-1 py-0.5 rounded">btts_computed</code>: Mindkét csapat gólt szerzett</li>
                    <li><code className="bg-white/10 px-1 py-0.5 rounded">comeback_computed</code>: Fordítás történt</li>
                    <li><code className="bg-white/10 px-1 py-0.5 rounded">result_computed</code>: Mérkőzés eredménye (H/D/A)</li>
                  </ul>
                </div>
              </div>
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