import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Team } from '../types/match';

interface FilterSectionProps {
  homeTeams: Team[];
  awayTeams: Team[];
  selectedHomeTeam: Team | null;
  selectedAwayTeam: Team | null;
  selectedBTTS: boolean | null;
  selectedComeback: boolean | null;
  onHomeTeamChange: (team: Team | null) => void;
  onAwayTeamChange: (team: Team | null) => void;
  onBTTSChange: (value: boolean | null) => void;
  onComebackChange: (value: boolean | null) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  homeTeams,
  awayTeams,
  selectedHomeTeam,
  selectedAwayTeam,
  selectedBTTS,
  selectedComeback,
  onHomeTeamChange,
  onAwayTeamChange,
  onBTTSChange,
  onComebackChange,
  onApplyFilters,
  onResetFilters,
  onExportCSV
}) => {
  return (
    <div className="mt-8 ring-1 ring-white/10 bg-white/5 rounded-2xl backdrop-blur">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300">
          <Icon icon="lucide:filter" width={18} height={18} />
          <span className="text-sm font-medium">Szűrők</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button
            color="primary"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transform-gpu transition"
            onPress={onApplyFilters}
          >
            <Icon icon="lucide:sliders-horizontal" width={18} height={18} />
            Szűrés
          </Button>
          <Button
            variant="flat"
            color="default"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5"
            onPress={onResetFilters}
          >
            <Icon icon="lucide:rotate-ccw" width={18} height={18} />
            Visszaállítás
          </Button>
          <Button
            variant="flat"
            color="default"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5"
            onPress={onExportCSV}
          >
            <Icon icon="lucide:download" width={18} height={18} />
            CSV Export
          </Button>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Hazai csapat - Replace dropdown with Autocomplete */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5" id="home-team-label">Hazai csapat</label>
            <Autocomplete
              aria-labelledby="home-team-label"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              defaultItems={homeTeams}
              placeholder="Keresés..."
              selectedKey={selectedHomeTeam?.id}
              onSelectionChange={(key) => {
                if (key === null) {
                  onHomeTeamChange(null);
                } else {
                  const team = homeTeams.find(t => t.id === key);
                  if (team) onHomeTeamChange(team);
                }
              }}
              startContent={
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 ring-1 ring-white/20">
                  <Icon icon="lucide:home" className="text-white" width={16} height={16} />
                </span>
              }
              isClearable
              classNames={{
                base: "bg-transparent",
                listbox: "bg-[#0c0f16] text-zinc-200",
                popoverContent: "bg-[#0c0f16] border border-white/10"
              }}
            >
              {(team) => (
                <AutocompleteItem key={team.id} textValue={team.name}>
                  <div className="flex items-center gap-2">
                    {team.logo && (
                      <img 
                        src={team.logo} 
                        alt={`${team.name} logo`} 
                        className="h-6 w-6 rounded-full ring-1 ring-white/10 object-cover"
                        loading="lazy"
                      />
                    )}
                    <span>{team.name}</span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          {/* Vendég csapat - Replace dropdown with Autocomplete */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5" id="away-team-label">Vendég csapat</label>
            <Autocomplete
              aria-labelledby="away-team-label"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              defaultItems={awayTeams}
              placeholder="Keresés..."
              selectedKey={selectedAwayTeam?.id}
              onSelectionChange={(key) => {
                if (key === null) {
                  onAwayTeamChange(null);
                } else {
                  const team = awayTeams.find(t => t.id === key);
                  if (team) onAwayTeamChange(team);
                }
              }}
              startContent={
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 ring-1 ring-white/20">
                  <Icon icon="lucide:flag" className="text-white" width={16} height={16} />
                </span>
              }
              isClearable
              classNames={{
                base: "bg-transparent",
                listbox: "bg-[#0c0f16] text-zinc-200",
                popoverContent: "bg-[#0c0f16] border border-white/10"
              }}
            >
              {(team) => (
                <AutocompleteItem key={team.id} textValue={team.name}>
                  <div className="flex items-center gap-2">
                    {team.logo && (
                      <img 
                        src={team.logo} 
                        alt={`${team.name} logo`} 
                        className="h-6 w-6 rounded-full ring-1 ring-white/10 object-cover"
                        loading="lazy"
                      />
                    )}
                    <span>{team.name}</span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          {/* BTTS */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Mindkét csapat gólt szerzett</label>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Icon icon="lucide:target" className="text-zinc-200" width={16} height={16} />
                    </span>
                    <span className="text-sm text-zinc-200 font-medium">
                      {selectedBTTS === null ? "Válassz: Igen / Nem" : selectedBTTS ? "Igen" : "Nem"}
                    </span>
                  </div>
                  <Icon icon="lucide:chevron-down" className="text-zinc-300" width={18} height={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="BTTS opciók" 
                onAction={(key) => {
                  if (key === "clear") {
                    onBTTSChange(null);
                  } else if (key === "yes") {
                    onBTTSChange(true);
                  } else {
                    onBTTSChange(false);
                  }
                }}
              >
                <DropdownItem key="clear" className="text-zinc-400">
                  -- Bármelyik --
                </DropdownItem>
                <DropdownItem key="yes" className="text-zinc-200">
                  Igen
                </DropdownItem>
                <DropdownItem key="no" className="text-zinc-200">
                  Nem
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="mt-1 text-xs text-zinc-500">
              <span>btts_computed mező alapján</span>
            </div>
          </div>

          {/* Fordítás */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Fordítás történt</label>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Icon icon="lucide:shuffle" className="text-zinc-200" width={16} height={16} />
                    </span>
                    <span className="text-sm text-zinc-200 font-medium">
                      {selectedComeback === null ? "Válassz: Igen / Nem" : selectedComeback ? "Igen" : "Nem"}
                    </span>
                  </div>
                  <Icon icon="lucide:chevron-down" className="text-zinc-300" width={18} height={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Fordítás opciók" 
                onAction={(key) => {
                  if (key === "clear") {
                    onComebackChange(null);
                  } else if (key === "yes") {
                    onComebackChange(true);
                  } else {
                    onComebackChange(false);
                  }
                }}
              >
                <DropdownItem key="clear" className="text-zinc-400">
                  -- Bármelyik --
                </DropdownItem>
                <DropdownItem key="yes" className="text-zinc-200">
                  Igen
                </DropdownItem>
                <DropdownItem key="no" className="text-zinc-200">
                  Nem
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="mt-1 text-xs text-zinc-500">
              <span>comeback_computed mező alapján</span>
            </div>
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="mt-4 flex sm:hidden items-center gap-3">
          <Button
            color="primary"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg"
            onPress={onApplyFilters}
          >
            <Icon icon="lucide:sliders-horizontal" width={18} height={18} />
            Szűrés
          </Button>
          <Button
            variant="flat"
            color="default"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5"
            onPress={onResetFilters}
          >
            <Icon icon="lucide:rotate-ccw" width={18} height={18} />
            Visszaállítás
          </Button>
          <Button
            variant="flat"
            color="default"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5"
            onPress={onExportCSV}
          >
            <Icon icon="lucide:download" width={18} height={18} />
            CSV Export
          </Button>
        </div>
      </div>
    </div>
  );
};