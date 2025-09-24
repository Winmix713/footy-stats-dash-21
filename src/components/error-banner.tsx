import React from 'react';
import { Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMatchData } from '../hooks/use-match-data';

export const ErrorBanner: React.FC = () => {
  const { isSupabaseConnected, errorMessage } = useMatchData();

  // Ha nincs hiba vagy még ellenőrizzük a kapcsolatot, ne jelenítsünk meg semmit
  if (isSupabaseConnected === true || isSupabaseConnected === null) {
    return null;
  }

  return (
    <Alert
      color="danger"
      variant="solid"
      className="fixed bottom-4 right-4 z-50 max-w-md shadow-lg"
      title="Adatbázis hiba"
      description={errorMessage || "Adatbázis kapcsolódási hiba. Minta adatok használata."}
      icon={<Icon icon="lucide:alert-triangle" width={24} height={24} />}
      isClosable
    >
      <div className="mt-2 text-xs">
        A minta adatok használata korlátozott funkcionalitást biztosít.
      </div>
    </Alert>
  );
};