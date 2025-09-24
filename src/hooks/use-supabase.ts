import { useState, useEffect } from 'react';

export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simple check - in a real app this would check actual Supabase connection
    setIsConnected(false); // Set to false for now since we don't have Supabase setup
  }, []);

  return {
    isConnected
  };
};