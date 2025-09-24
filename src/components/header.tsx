import React from 'react';
import { Button, Switch, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import { useMatchData } from '../hooks/use-match-data'; // Add this import

interface HeaderProps {
  onExtendedStatsClick: () => void;
  onSearchClick: () => void;
}

import { ConnectionStatus } from './connection-status';

export const Header: React.FC<HeaderProps> = ({ onExtendedStatsClick, onSearchClick }) => {
  const { isSupabaseConnected } = useMatchData();
  
  return (
    <header className="relative z-50 sticky top-0 backdrop-blur-xl bg-background/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_0_2px_rgba(255,255,255,0.06)_inset]">
              <Icon icon="lucide:asterisk" className="text-white" width={16} height={16} />
            </span>
            <span className="text-lg font-semibold tracking-tight">WinMix</span>
          </a>

          <nav className="hidden md:flex gap-1 border border-white/5 rounded-full px-3 items-center">
            <a href="#" className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">Mérkőzések</a>
            <a href="#stats" className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">Statisztikák</a>
            <a href="#results" className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">Eredmények</a>
          </nav>

          <div className="flex gap-2 items-center">
            {/* Kapcsolat állapot jelző */}
            {isSupabaseConnected === false && (
              <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                <span>Offline mód</span>
              </div>
            )}
            
            <Button 
              variant="flat" 
              color="default" 
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-md px-3 py-2 hover:bg-white/5"
              onPress={onExtendedStatsClick}
            >
              <Icon icon="lucide:chart-line" width={18} height={18} />
              Bővített stat.
            </Button>
            <Button 
              className="group relative inline-flex transition duration-300 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 text-white rounded-md p-[1px] items-center justify-center shadow-[0_8px_16px_-4px_rgba(151,65,252,0.2)] hover:shadow-[0_12px_24px_-6px_rgba(151,65,252,0.3)]" 
              style={{ backgroundImage: 'linear-gradient(144deg,#AF40FF, #5B42F3 50%, #00DDEB)' }}
              onPress={onSearchClick}
            >
              <span className="flex items-center justify-center gap-2 text-[14px] leading-none h-full w-full transition-colors duration-300 group-hover:bg-transparent font-medium bg-[#0b0f17] rounded-md px-4 py-2">
                <Icon icon="lucide:search" width={20} height={20} />
                <span>Keresés</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};