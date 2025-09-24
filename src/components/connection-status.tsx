import React from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMatchData } from '../hooks/use-match-data';

export const ConnectionStatus: React.FC = () => {
  const { isSupabaseConnected, isLoading } = useMatchData();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Tooltip content="Adatbázis kapcsolat ellenőrzése...">
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-black/40 border border-white/10"
            size="sm"
          >
            <Icon icon="lucide:loader" className="w-4 h-4 text-zinc-300 animate-spin" />
          </Button>
        </Tooltip>
      </div>
    );
  }

  if (isSupabaseConnected === false) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Tooltip content="Adatbázis kapcsolat megszakadt. Offline mód aktív.">
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            className="bg-danger-500/20 border border-danger-500/30"
            size="sm"
          >
            <Icon icon="lucide:wifi-off" className="w-4 h-4 text-danger-300" />
          </Button>
        </Tooltip>
      </div>
    );
  }

  if (isSupabaseConnected === true) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Tooltip content="Adatbázis kapcsolat aktív">
          <Button
            isIconOnly
            variant="flat"
            color="success"
            className="bg-success-500/20 border border-success-500/30"
            size="sm"
          >
            <Icon icon="lucide:database" className="w-4 h-4 text-success-300" />
          </Button>
        </Tooltip>
      </div>
    );
  }

  return null;
};