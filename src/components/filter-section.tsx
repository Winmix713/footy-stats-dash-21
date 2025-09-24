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
  startDate: string | null;
  endDate: string | null;
  minHomeGoals: string;
  maxHomeGoals: string;
  minAwayGoals: string;
  maxAwayGoals: string;
  resultType: string | null;
  htftCombination: string | null;
  onHomeTeamChange: (team: Team | null) => void;
  onAwayTeamChange: (team: Team | null) => void;
  onBTTSChange: (value: boolean | null) => void;
  onComebackChange: (value: boolean | null) => void;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onMinHomeGoalsChange: (value: string) => void;
  onMaxHomeGoalsChange: (value: string) => void;
  onMinAwayGoalsChange: (value: string) => void;
  onMaxAwayGoalsChange: (value: string) => void;
  onResultTypeChange: (value: string | null) => void;
  onHtftCombinationChange: (value: string) => void;
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
  startDate,
  endDate,
  onHomeTeamChange,
  onAwayTeamChange,
  onBTTSChange,
  onComebackChange,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onResetFilters,
  onExportCSV
}) => {
  // Add state for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  
  // Add state for score range filters
  const [minHomeGoals, setMinHomeGoals] = React.useState<string>("");
  const [maxHomeGoals, setMaxHomeGoals] = React.useState<string>("");
  const [minAwayGoals, setMinAwayGoals] = React.useState<string>("");
  const [maxAwayGoals, setMaxAwayGoals] = React.useState<string>("");
  
  // Add state for result type filter
  const [resultType, setResultType] = React.useState<string | null>(null);

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

        {/* Add Date Range Filter */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5" id="start-date-label">Kezdő dátum</label>
            <Input
              aria-labelledby="start-date-label"
              type="date"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              value={startDate || ""}
              onValueChange={onStartDateChange}
              startContent={
                <Icon icon="lucide:calendar" className="text-zinc-400" width={16} height={16} />
              }
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5" id="end-date-label">Záró dátum</label>
            <Input
              aria-labelledby="end-date-label"
              type="date"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              value={endDate || ""}
              onValueChange={onEndDateChange}
              startContent={
                <Icon icon="lucide:calendar" className="text-zinc-400" width={16} height={16} />
              }
            />
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="mt-6">
          <Button
            variant="flat"
            color="default"
            className="text-zinc-300 flex items-center gap-2"
            onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Icon icon={showAdvancedFilters ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} height={18} />
            {showAdvancedFilters ? "Kevesebb szűrő" : "További szűrők"}
          </Button>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Speciális szűrők</h3>
            
            {/* Goal Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Hazai gólok tartománya</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                    value={minHomeGoals}
                    onValueChange={setMinHomeGoals}
                  />
                  <span className="text-zinc-400">-</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                    value={maxHomeGoals}
                    onValueChange={setMaxHomeGoals}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Vendég gólok tartománya</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                    value={minAwayGoals}
                    onValueChange={setMinAwayGoals}
                  />
                  <span className="text-zinc-400">-</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                    value={maxAwayGoals}
                    onValueChange={setMaxAwayGoals}
                  />
                </div>
              </div>
            </div>
            
            {/* Result Type Filter */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-1.5">Eredmény típusa</label>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="w-full md:w-auto flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                        <Icon icon="lucide:trophy" className="text-zinc-200" width={16} height={16} />
                      </span>
                      <span className="text-sm text-zinc-200 font-medium">
                        {resultType === null ? "Válassz eredményt" : 
                         resultType === "H" ? "Hazai győzelem" : 
                         resultType === "D" ? "Döntetlen" : "Vendég győzelem"}
                      </span>
                    </div>
                    <Icon icon="lucide:chevron-down" className="text-zinc-300" width={18} height={18} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Eredmény típus opciók" 
                  onAction={(key) => {
                    if (key === "clear") {
                      setResultType(null);
                    } else {
                      setResultType(key as string);
                    }
                  }}
                >
                  <DropdownItem key="clear" className="text-zinc-400">
                    -- Bármelyik --
                  </DropdownItem>
                  <DropdownItem key="H" className="text-zinc-200">
                    Hazai győzelem
                  </DropdownItem>
                  <DropdownItem key="D" className="text-zinc-200">
                    Döntetlen
                  </DropdownItem>
                  <DropdownItem key="A" className="text-zinc-200">
                    Vendég győzelem
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            
            {/* Half-time/Full-time Filter */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-1.5">Félidő/Végeredmény kombináció</label>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="w-full md:w-auto flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                        <Icon icon="lucide:timer" className="text-zinc-200" width={16} height={16} />
                      </span>
                      <span className="text-sm text-zinc-200 font-medium">
                        Válassz kombinációt
                      </span>
                    </div>
                    <Icon icon="lucide:chevron-down" className="text-zinc-300" width={18} height={18} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Félidő/Végeredmény opciók">
                  <DropdownItem key="clear" className="text-zinc-400">
                    -- Bármelyik --
                  </DropdownItem>
                  <DropdownItem key="HH" className="text-zinc-200">
                    Hazai/Hazai
                  </DropdownItem>
                  <DropdownItem key="HD" className="text-zinc-200">
                    Hazai/Döntetlen
                  </DropdownItem>
                  <DropdownItem key="HA" className="text-zinc-200">
                    Hazai/Vendég
                  </DropdownItem>
                  <DropdownItem key="DH" className="text-zinc-200">
                    Döntetlen/Hazai
                  </DropdownItem>
                  <DropdownItem key="DD" className="text-zinc-200">
                    Döntetlen/Döntetlen
                  </DropdownItem>
                  <DropdownItem key="DA" className="text-zinc-200">
                    Döntetlen/Vendég
                  </DropdownItem>
                  <DropdownItem key="AH" className="text-zinc-200">
                    Vendég/Hazai
                  </DropdownItem>
                  <DropdownItem key="AD" className="text-zinc-200">
                    Vendég/Döntetlen
                  </DropdownItem>
                  <DropdownItem key="AA" className="text-zinc-200">
                    Vendég/Vendég
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}

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