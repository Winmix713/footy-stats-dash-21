import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-white/10 md:hidden">
      <div className="flex items-center justify-around">
        <Link 
          to="/" 
          className={`flex flex-col items-center py-3 px-5 ${isActive('/') ? 'text-primary' : 'text-zinc-400'}`}
        >
          <Icon icon="lucide:home" width={20} height={20} />
          <span className="text-xs mt-1">Főoldal</span>
        </Link>
        
        <Link 
          to="/teams" 
          className={`flex flex-col items-center py-3 px-5 ${isActive('/teams') ? 'text-primary' : 'text-zinc-400'}`}
        >
          <Icon icon="lucide:users" width={20} height={20} />
          <span className="text-xs mt-1">Csapatok</span>
        </Link>
        
        <Link 
          to="/stats" 
          className={`flex flex-col items-center py-3 px-5 ${isActive('/stats') ? 'text-primary' : 'text-zinc-400'}`}
        >
          <Icon icon="lucide:bar-chart-2" width={20} height={20} />
          <span className="text-xs mt-1">Statisztikák</span>
        </Link>
        
        <Link 
          to="/results" 
          className={`flex flex-col items-center py-3 px-5 ${isActive('/results') ? 'text-primary' : 'text-zinc-400'}`}
        >
          <Icon icon="lucide:list" width={20} height={20} />
          <span className="text-xs mt-1">Eredmények</span>
        </Link>
      </div>
    </nav>
  );
};