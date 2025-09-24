import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Match, Team, MatchStats, SortKey, SortDirection } from '../types/match';
import { addToast } from '@heroui/react';
import { supabase, fetchMatches, MatchFilters as SupabaseMatchFilters } from '../lib/supabase';
import { mockMatches } from '../data/mock-data';

// Create a context for match data
interface MatchDataContextType {
  isLoading: boolean;
  matches: Match[];
  filteredMatches: Match[];
  homeTeams: Team[];
  awayTeams: Team[];
  selectedHomeTeam: Team | null;
  selectedAwayTeam: Team | null;
  selectedBTTS: boolean | null;
  selectedComeback: boolean | null;
  setSelectedHomeTeam: (team: Team | null) => void;
  setSelectedAwayTeam: (team: Team | null) => void;
  setSelectedBTTS: (value: boolean | null) => void;
  setSelectedComeback: (value: boolean | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  exportToCSV: () => void;
  stats: MatchStats;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  setSortKey: (key: SortKey) => void;
  setSortDirection: (direction: SortDirection) => void;
  isExtendedStatsModalOpen: boolean;
  setIsExtendedStatsModalOpen: (isOpen: boolean) => void;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  totalMatchCount: number;
  isLoadingPage: boolean;
  isSupabaseConnected: boolean | null;
  errorMessage: string | null;
  minHomeGoals: string;
  maxHomeGoals: string;
  minAwayGoals: string;
  maxAwayGoals: string;
  resultType: string | null;
  htftCombination: string | null;
  setMinHomeGoals: (value: string) => void;
  setMaxHomeGoals: (value: string) => void;
  setMinAwayGoals: (value: string) => void;
  setMaxAwayGoals: (value: string) => void;
  setResultType: (value: string | null) => void;
  setHtftCombination: (value: string | null) => void;
}

const MatchDataContext = createContext<MatchDataContextType | undefined>(undefined);

// Storage key for persisting filters
const STORAGE_KEY = 'winmix-filters';

interface MatchDataProviderProps {
  children: React.ReactNode;
}

// Provider component
export const MatchDataProvider: React.FC<MatchDataProviderProps> = ({ children }) => {
  // Move all the state and logic from useMatchData here
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [totalMatchCount, setTotalMatchCount] = useState(0);
  
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team | null>(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team | null>(null);
  const [selectedBTTS, setSelectedBTTS] = useState<boolean | null>(null);
  const [selectedComeback, setSelectedComeback] = useState<boolean | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // Add missing state declarations for the new filter variables
  const [minHomeGoals, setMinHomeGoals] = useState<string>("");
  const [maxHomeGoals, setMaxHomeGoals] = useState<string>("");
  const [minAwayGoals, setMinAwayGoals] = useState<string>("");
  const [maxAwayGoals, setMaxAwayGoals] = useState<string>("");
  const [resultType, setResultType] = useState<string | null>(null);
  const [htftCombination, setHtftCombination] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  const [sortKey, setSortKey] = useState<SortKey>('home');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const [stats, setStats] = useState<MatchStats>({
    total: 0,
    homeWins: 0,
    draws: 0,
    awayWins: 0,
    bttsCount: 0,
    comebackCount: 0,
    homeGoals: 0,
    awayGoals: 0,
    frequentResults: []
  });
  
  const [isExtendedStatsModalOpen, setIsExtendedStatsModalOpen] = useState(false);
  
  // REMOVE ALL THE DUPLICATE CONNECTION CHECK useEffect HOOKS
// Replace them with this SINGLE, simple connection check

useEffect(() => {
  const checkSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Don't check environment variables in the browser - they might not be available
      // Just test if the imported supabase client works
      if (!supabase) {
        console.error('Supabase client is not available');
        setIsSupabaseConnected(false);
        setErrorMessage('Supabase kliens nincs elérhető. Minta adatok használata.');
        return;
      }

      // Simple connection test - if this works, Supabase is connected
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        setIsSupabaseConnected(false);
        setErrorMessage(`Adatbázis hiba: ${error.message}. Minta adatok használata.`);
      } else {
        console.log('Supabase connection successful!');
        setIsSupabaseConnected(true);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
      setIsSupabaseConnected(false);
      setErrorMessage('Supabase kapcsolódási hiba. Minta adatok használata.');
    }
  };

  // Small delay to ensure initialization
  const timer = setTimeout(checkSupabaseConnection, 50);
  return () => clearTimeout(timer);
}, []);

// IMPORTANT: Remove these duplicate useEffect hooks from your code:
// 1. The one starting with "Fixed version of the Supabase connection check"
// 2. The one starting with "Alternative approach - delayed initialization check"  
// 3. The one starting with "Recommended approach - create a proper Supabase client initialization check"
// Keep ONLY the one above.
// Remove the other duplicate useEffect hooks for Supabase connection checking

// Alternative approach - delayed initialization check
useEffect(() => {
  // Add a small delay to ensure client initialization
  const timer = setTimeout(() => {
    const checkSupabaseConnection = async () => {
      try {
        console.log('Supabase client:', supabase); // Debug log
        
        if (!supabase) {
          console.error('Supabase client is null');
          setIsSupabaseConnected(false);
          setErrorMessage('Supabase kliens nincs inicializálva. Minta adatok használata.');
          return;
        }

        // Test the connection
        const { data, error } = await supabase
          .from('matches')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setIsSupabaseConnected(false);
          setErrorMessage(`Adatbázis kapcsolódási hiba: ${error.message}. Minta adatok használata.`);
        } else {
          console.log('Supabase connection successful');
          setIsSupabaseConnected(true);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsSupabaseConnected(false);
        setErrorMessage('Adatbázis kapcsolódási hiba. Minta adatok használata.');
      }
    };

    checkSupabaseConnection();
  }, 100); // 100ms delay

  return () => clearTimeout(timer);
}, []);

// Recommended approach - create a proper Supabase client initialization check
useEffect(() => {
  const initializeAndCheckSupabase = async () => {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        console.warn('Supabase client not available on server side');
        setIsSupabaseConnected(false);
        setErrorMessage('Szerver oldali renderelés. Minta adatok használata.');
        return;
      }

      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        setIsSupabaseConnected(false);
        setErrorMessage('Supabase környezeti változók hiányoznak. Minta adatok használata.');
        return;
      }

      // Check if supabase client exists and is properly initialized
      if (!supabase || typeof supabase.from !== 'function') {
        console.error('Supabase client is not properly initialized');
        setIsSupabaseConnected(false);
        setErrorMessage('Supabase kliens nincs megfelelően inicializálva. Minta adatok használata.');
        return;
      }

      // Test the actual connection
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        setIsSupabaseConnected(false);
        setErrorMessage(`Adatbázis kapcsolódási hiba: ${error.message}. Minta adatok használata.`);
      } else {
        console.log('Supabase connection successful');
        setIsSupabaseConnected(true);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error during Supabase initialization check:', error);
      setIsSupabaseConnected(false);
      setErrorMessage('Supabase inicializálási hiba. Minta adatok használata.');
    }
  };

  initializeAndCheckSupabase();
}, []);

  // Extract unique teams from Supabase data with alphabetical sorting
  const homeTeams = useMemo(() => {
    if (isSupabaseConnected) {
      // For Supabase, we'll create team objects from match data
      const teams = new Map<string, Team>();
      matches.forEach(match => {
        if (match.home_team && !teams.has(match.home_team)) {
          teams.set(match.home_team, {
            id: match.home_team,
            name: match.home_team,
            logo: ''
          });
        }
      });
      // Sort alphabetically by name
      return Array.from(teams.values()).sort((a, b) => a.name.localeCompare(b.name, 'hu'));
    } else {
      // For mock data, use the existing logic
      const teams = new Map<string, Team>();
      matches.forEach(match => {
        if (!teams.has(match.home.id)) {
          teams.set(match.home.id, match.home);
        }
      });
      return Array.from(teams.values()).sort((a, b) => a.name.localeCompare(b.name, 'hu'));
    }
  }, [matches, isSupabaseConnected]);

  const awayTeams = useMemo(() => {
    if (isSupabaseConnected) {
      // For Supabase, we'll create team objects from match data
      const teams = new Map<string, Team>();
      matches.forEach(match => {
        if (match.away_team && !teams.has(match.away_team)) {
          teams.set(match.away_team, {
            id: match.away_team,
            name: match.away_team,
            logo: ''
          });
        }
      });
      // Sort alphabetically by name
      return Array.from(teams.values()).sort((a, b) => a.name.localeCompare(b.name, 'hu'));
    } else {
      // For mock data, use the existing logic
      const teams = new Map<string, Team>();
      matches.forEach(match => {
        if (!teams.has(match.away.id)) {
          teams.set(match.away.id, match.away);
        }
      });
      return Array.from(teams.values()).sort((a, b) => a.name.localeCompare(b.name, 'hu'));
    }
  }, [matches, isSupabaseConnected]);

  // Save filters to storage
  const saveFiltersToStorage = useCallback(() => {
    try {
      const filters = {
        home: selectedHomeTeam,
        away: selectedAwayTeam,
        btts: selectedBTTS,
        comeback: selectedComeback,
        startDate,
        endDate
      };
      
      const data = {
        filters,
        itemsPerPage,
        sortKey,
        sortDirection
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save filters to storage:', error);
    }
  }, [selectedHomeTeam, selectedAwayTeam, selectedBTTS, selectedComeback, startDate, endDate, itemsPerPage, sortKey, sortDirection]);

  // Clear filters from storage
  const clearFiltersFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Could not clear filters from storage:', error);
    }
  }, []);

  // Sort matches
  const sortMatches = useCallback((matchesToSort: Match[], key: SortKey, direction: SortDirection): Match[] => {
    return [...matchesToSort].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (key) {
        case 'home':
          valueA = a.home.name;
          valueB = b.home.name;
          break;
        case 'away':
          valueA = a.away.name;
          valueB = b.away.name;
          break;
        case 'ht':
          valueA = `${a.htScore.home}-${a.htScore.away}`;
          valueB = `${b.htScore.home}-${b.htScore.away}`;
          break;
        case 'ft':
          valueA = `${a.ftScore.home}-${a.ftScore.away}`;
          valueB = `${b.ftScore.home}-${b.ftScore.away}`;
          break;
        case 'btts':
          valueA = a.btts ? 1 : 0;
          valueB = b.btts ? 1 : 0;
          break;
        case 'comeback':
          valueA = a.comeback ? 1 : 0;
          valueB = b.comeback ? 1 : 0;
          break;
        default:
          valueA = a.home.name;
          valueB = b.home.name;
      }
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, []);

  // Calculate statistics based on filtered matches
  const calculateStats = useCallback((matchesToCalculate: Match[]) => {
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;
    let bttsCount = 0;
    let comebackCount = 0;
    let homeGoals = 0;
    let awayGoals = 0;
    
    // For frequent results
    const resultCounts: Record<string, number> = {};
    
    matchesToCalculate.forEach(match => {
      // Count match results
      if (match.ftScore.home > match.ftScore.away) {
        homeWins++;
      } else if (match.ftScore.home === match.ftScore.away) {
        draws++;
      } else {
        awayWins++;
      }
      
      // Count BTTS and comebacks
      if (match.btts) bttsCount++;
      if (match.comeback) comebackCount++;
      
      // Count goals
      homeGoals += match.ftScore.home;
      awayGoals += match.ftScore.away;
      
      // Count result frequencies
      const resultKey = `${match.ftScore.home}-${match.ftScore.away}`;
      resultCounts[resultKey] = (resultCounts[resultKey] || 0) + 1;
    });
    
    // Sort results by frequency
    const frequentResults = Object.entries(resultCounts)
      .map(([result, count]) => ({
        result,
        count,
        percentage: (count / matchesToCalculate.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setStats({
      total: matchesToCalculate.length,
      homeWins,
      draws,
      awayWins,
      bttsCount,
      comebackCount,
      homeGoals,
      awayGoals,
      frequentResults
    });
  }, []);

  // Map our sort keys to database field names
  const mapSortKeyToDbField = useCallback((key: SortKey): string => {
    switch (key) {
      case 'home':
        return 'home_team';
      case 'away':
        return 'away_team';
      case 'ht':
        return 'half_time_home_goals';
      case 'ft':
        return 'full_time_home_goals';
      case 'btts':
        return 'btts_computed';
      case 'comeback':
        return 'comeback_computed';
      default:
        return 'match_time';
    }
  }, []);

  // Apply filters - modified to use Supabase when connected
  const applyFilters = useCallback(() => {
    setIsLoadingPage(true);
    
    try {
      if (isSupabaseConnected) {
        // When using Supabase, we'll refetch data with new filters
        // This will trigger the useEffect above with the new filter values
        setCurrentPage(1); // Reset to first page
        saveFiltersToStorage();
        
        addToast({
          title: "Szűrés alkalmazva",
          description: "Szűrők alkalmazva, adatok frissítése...",
          severity: "success",
        });
      } else {
        // When using mock data, filter locally
        let filtered = [...matches];
        
        // Apply existing filters
        if (selectedHomeTeam) {
          filtered = filtered.filter(match => match.home.id === selectedHomeTeam.id);
        }
        
        if (selectedAwayTeam) {
          filtered = filtered.filter(match => match.away.id === selectedAwayTeam.id);
        }
        
        if (selectedBTTS !== null) {
          filtered = filtered.filter(match => match.btts === selectedBTTS);
        }
        
        if (selectedComeback !== null) {
          filtered = filtered.filter(match => match.comeback === selectedComeback);
        }
        
        // Apply date range filters
        if (startDate) {
          const startDateObj = new Date(startDate);
          filtered = filtered.filter(match => new Date(match.date) >= startDateObj);
        }
        
        if (endDate) {
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999); // End of day
          filtered = filtered.filter(match => new Date(match.date) <= endDateObj);
        }
        
        // Apply new filters
        // Home goals range
        if (minHomeGoals !== "") {
          const min = parseInt(minHomeGoals);
          filtered = filtered.filter(match => match.ftScore.home >= min);
        }
        
        if (maxHomeGoals !== "") {
          const max = parseInt(maxHomeGoals);
          filtered = filtered.filter(match => match.ftScore.home <= max);
        }
        
        // Away goals range
        if (minAwayGoals !== "") {
          const min = parseInt(minAwayGoals);
          filtered = filtered.filter(match => match.ftScore.away >= min);
        }
        
        if (maxAwayGoals !== "") {
          const max = parseInt(maxAwayGoals);
          filtered = filtered.filter(match => match.ftScore.away <= max);
        }
        
        // Result type
        if (resultType) {
          if (resultType === "H") {
            filtered = filtered.filter(match => match.ftScore.home > match.ftScore.away);
          } else if (resultType === "D") {
            filtered = filtered.filter(match => match.ftScore.home === match.ftScore.away);
          } else if (resultType === "A") {
            filtered = filtered.filter(match => match.ftScore.home < match.ftScore.away);
          }
        }
        
        // HT/FT combination
        if (htftCombination) {
          const [ht, ft] = htftCombination.split("");
          
          // Half-time result
          if (ht === "H") {
            filtered = filtered.filter(match => match.htScore.home > match.htScore.away);
          } else if (ht === "D") {
            filtered = filtered.filter(match => match.htScore.home === match.htScore.away);
          } else if (ht === "A") {
            filtered = filtered.filter(match => match.htScore.home < match.htScore.away);
          }
          
          // Full-time result
          if (ft === "H") {
            filtered = filtered.filter(match => match.ftScore.home > match.ftScore.away);
          } else if (ft === "D") {
            filtered = filtered.filter(match => match.ftScore.home === match.ftScore.away);
          } else if (ft === "A") {
            filtered = filtered.filter(match => match.ftScore.home < match.ftScore.away);
          }
        }
        
        // Apply sorting
        filtered = sortMatches(filtered, sortKey, sortDirection);
        
        setFilteredMatches(filtered);
        calculateStats(filtered);
        setCurrentPage(1); // Reset to first page
        setTotalMatchCount(filtered.length); // Update total count to reflect filtered results
        
        // Save filters to storage
        saveFiltersToStorage();
        
        addToast({
          title: "Szűrés alkalmazva",
          description: `${filtered.length} mérkőzés található a megadott feltételekkel.`,
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setErrorMessage(`Szűrési hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
      
      addToast({
        title: "Hiba történt",
        description: "A szűrés alkalmazása sikertelen.",
        severity: "danger",
      });
    } finally {
      setIsLoadingPage(false);
    }
  }, [
    matches, 
    selectedHomeTeam, 
    selectedAwayTeam, 
    selectedBTTS, 
    selectedComeback, 
    startDate, 
    endDate, 
    sortKey, 
    sortDirection, 
    calculateStats,
    saveFiltersToStorage,
    sortMatches,
    isSupabaseConnected,
    minHomeGoals,
    maxHomeGoals,
    minAwayGoals,
    maxAwayGoals,
    resultType,
    htftCombination
  ]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedHomeTeam(null);
    setSelectedAwayTeam(null);
    setSelectedBTTS(null);
    setSelectedComeback(null);
    setStartDate(null);
    setEndDate(null);
    
    // Reset new filters
    setMinHomeGoals("");
    setMaxHomeGoals("");
    setMinAwayGoals("");
    setMaxAwayGoals("");
    setResultType(null);
    setHtftCombination(null);
    
    setFilteredMatches(matches);
    calculateStats(matches);
    setCurrentPage(1);
    
    // Clear filters from storage
    clearFiltersFromStorage();
    
    addToast({
      title: "Szűrők visszaállítva",
      description: "Az összes szűrő visszaállítva alapértelmezettre.",
      severity: "primary",
    });
  }, [matches, calculateStats, clearFiltersFromStorage]);

  // Load initial data - modified to handle "all" results
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsLoadingPage(true);
      
      try {
        // First check if Supabase is connected
        if (isSupabaseConnected === null) {
          // Still checking connection, wait
          return;
        }
        
        if (isSupabaseConnected) {
          // Use Supabase to fetch data
          const filters: SupabaseMatchFilters = {};
          
          // Apply filters
          if (selectedHomeTeam) {
            filters.home_team = selectedHomeTeam.id;
          }
          
          if (selectedAwayTeam) {
            filters.away_team = selectedAwayTeam.id;
          }
          
          if (selectedBTTS !== null) {
            filters.btts = selectedBTTS;
          }
          
          if (selectedComeback !== null) {
            filters.comeback = selectedComeback;
          }
          
          if (startDate) {
            filters.startDate = startDate;
          }
          
          if (endDate) {
            filters.endDate = endDate;
          }
          
          // Apply new filters
          if (minHomeGoals !== "") {
            filters.minHomeGoals = parseInt(minHomeGoals);
          }
          
          if (maxHomeGoals !== "") {
            filters.maxHomeGoals = parseInt(maxHomeGoals);
          }
          
          if (minAwayGoals !== "") {
            filters.minAwayGoals = parseInt(minAwayGoals);
          }
          
          if (maxAwayGoals !== "") {
            filters.maxAwayGoals = parseInt(maxAwayGoals);
          }
          
          if (resultType) {
            filters.result = resultType as 'H' | 'D' | 'A';
          }
          
          console.log('Fetching with filters:', filters);
          
          try {
            // If itemsPerPage is very large, we're requesting all results
            const isRequestingAll = itemsPerPage > 1000;
            
            // For "all" requests, use a different approach to avoid pagination limits
            if (isRequestingAll) {
              // Fetch all results in chunks and combine
              const CHUNK_SIZE = 100; // Reduced chunk size for better stability
              let allResults: Match[] = [];
              let hasMore = true;
              let page = 1;
              let totalCount = 0;
              
              while (hasMore) {
                console.log(`Fetching chunk ${page} with size ${CHUNK_SIZE}`);
                const { data, count } = await fetchMatches(
                  filters,
                  page,
                  CHUNK_SIZE,
                  mapSortKeyToDbField(sortKey),
                  sortDirection
                );
                
                if (page === 1) totalCount = count || 0;
                
                if (data && data.length > 0) {
                  console.log(`Received ${data.length} matches in chunk ${page}`);
                  allResults = [...allResults, ...data];
                  if (data.length < CHUNK_SIZE) {
                    hasMore = false;
                  } else {
                    page++;
                  }
                } else {
                  hasMore = false;
                }
              }
              
              console.log(`Total matches fetched: ${allResults.length}`);
              setMatches(allResults);
              setFilteredMatches(allResults);
              setTotalMatchCount(totalCount);
              calculateStats(allResults);
              
              addToast({
                title: "Összes adat betöltve",
                description: `${allResults.length} mérkőzés betöltve sikeresen.`,
                severity: "success",
              });
            } else {
              // Regular paginated fetch
              console.log(`Fetching page ${currentPage} with size ${itemsPerPage}`);
              const { data, count } = await fetchMatches(
                filters,
                currentPage,
                itemsPerPage,
                mapSortKeyToDbField(sortKey),
                sortDirection
              );
              
              console.log(`Received ${data.length} matches, total count: ${count}`);
              setMatches(data);
              setFilteredMatches(data);
              setTotalMatchCount(count || 0);
              calculateStats(data);
            }
          } catch (fetchError) {
            console.error('Error during fetch operation:', fetchError);
            throw fetchError;
          }
        } else {
          // Use mock data as fallback
          console.log("Using mock data as fallback");
          setMatches(mockMatches);
          
          // Apply filters to mock data
          let filtered = [...mockMatches];
          
          if (selectedHomeTeam) {
            filtered = filtered.filter(match => match.home.id === selectedHomeTeam.id);
          }
          
          if (selectedAwayTeam) {
            filtered = filtered.filter(match => match.away.id === selectedAwayTeam.id);
          }
          
          if (selectedBTTS !== null) {
            filtered = filtered.filter(match => match.btts === selectedBTTS);
          }
          
          if (selectedComeback !== null) {
            filtered = filtered.filter(match => match.comeback === selectedComeback);
          }
          
          // Apply date range filters
          if (startDate) {
            const startDateObj = new Date(startDate);
            filtered = filtered.filter(match => new Date(match.date) >= startDateObj);
          }
          
          if (endDate) {
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(match => new Date(match.date) <= endDateObj);
          }
          
          // Apply new filters
          if (minHomeGoals !== "") {
            const min = parseInt(minHomeGoals);
            filtered = filtered.filter(match => match.ftScore.home >= min);
          }
          
          if (maxHomeGoals !== "") {
            const max = parseInt(maxHomeGoals);
            filtered = filtered.filter(match => match.ftScore.home <= max);
          }
          
          if (minAwayGoals !== "") {
            const min = parseInt(minAwayGoals);
            filtered = filtered.filter(match => match.ftScore.away >= min);
          }
          
          if (maxAwayGoals !== "") {
            const max = parseInt(maxAwayGoals);
            filtered = filtered.filter(match => match.ftScore.away <= max);
          }
          
          if (resultType) {
            if (resultType === "H") {
              filtered = filtered.filter(match => match.ftScore.home > match.ftScore.away);
            } else if (resultType === "D") {
              filtered = filtered.filter(match => match.ftScore.home === match.ftScore.away);
            } else if (resultType === "A") {
              filtered = filtered.filter(match => match.ftScore.home < match.ftScore.away);
            }
          }
          
          // Apply sorting
          filtered = sortMatches(filtered, sortKey, sortDirection);
          
          // If requesting all, don't paginate the mock data
          if (itemsPerPage > 1000) {
            setFilteredMatches(filtered);
          } else {
            // Apply pagination to mock data
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setFilteredMatches(filtered.slice(startIndex, endIndex));
          }
          
          setTotalMatchCount(filtered.length);
          calculateStats(filtered);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
        setErrorMessage(`Adatbetöltési hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
        
        // Fallback to mock data in case of error
        console.log("Falling back to mock data due to error");
        setMatches(mockMatches);
        setFilteredMatches(mockMatches.slice(0, itemsPerPage));
        setTotalMatchCount(mockMatches.length);
        calculateStats(mockMatches.slice(0, itemsPerPage));
        
        addToast({
          title: "Hiba történt",
          description: "Az adatok betöltése sikertelen. Minta adatok megjelenítése.",
          severity: "danger",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingPage(false);
      }
    };
    
    fetchData();
  }, [
    isSupabaseConnected,
    currentPage,
    itemsPerPage,
    sortKey,
    sortDirection,
    selectedHomeTeam,
    selectedAwayTeam,
    selectedBTTS,
    selectedComeback,
    startDate,
    endDate,
    minHomeGoals,
    maxHomeGoals,
    minAwayGoals,
    maxAwayGoals,
    resultType,
    htftCombination,
    calculateStats,
    sortMatches,
    mapSortKeyToDbField
  ]);

  // Add the missing exportToCSV function
  const exportToCSV = useCallback(() => {
    try {
      const headers = [
        "Hazai csapat",
        "Vendég csapat",
        "Félidő eredmény",
        "Végeredmény",
        "Mindkét csapat gólt szerzett",
        "Fordítás történt"
      ];
      
      const csvRows = [
        headers.join(','),
        ...filteredMatches.map(match => {
          return [
            `"${match.home.name}"`,
            `"${match.away.name}"`,
            `${match.htScore.home}-${match.htScore.away}`,
            `${match.ftScore.home}-${match.ftScore.away}`,
            match.btts ? "Igen" : "Nem",
            match.comeback ? "Igen" : "Nem"
          ].join(',');
        })
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `winmix-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast({
        title: "Exportálás sikeres",
        description: `${filteredMatches.length} mérkőzés exportálva CSV formátumban`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      addToast({
        title: "Hiba történt",
        description: "A CSV exportálása sikertelen.",
        severity: "danger",
      });
    }
  }, [filteredMatches]);

  // Create the context value object
  const contextValue: MatchDataContextType = useMemo(() => ({
    isLoading,
    matches,
    filteredMatches,
    homeTeams,
    awayTeams,
    selectedHomeTeam,
    selectedAwayTeam,
    selectedBTTS,
    selectedComeback,
    setSelectedHomeTeam,
    setSelectedAwayTeam,
    setSelectedBTTS,
    setSelectedComeback,
    applyFilters,
    resetFilters,
    exportToCSV,
    stats,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    isExtendedStatsModalOpen,
    setIsExtendedStatsModalOpen,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    totalMatchCount,
    isLoadingPage,
    isSupabaseConnected,
    errorMessage,
    
    // Add new filter properties
    minHomeGoals,
    maxHomeGoals,
    minAwayGoals,
    maxAwayGoals,
    resultType,
    htftCombination,
    setMinHomeGoals,
    setMaxHomeGoals,
    setMinAwayGoals,
    setMaxAwayGoals,
    setResultType,
    setHtftCombination
  }), [
    isLoading,
    matches,
    filteredMatches,
    homeTeams,
    awayTeams,
    selectedHomeTeam,
    selectedAwayTeam,
    selectedBTTS,
    selectedComeback,
    setSelectedHomeTeam,
    setSelectedAwayTeam,
    setSelectedBTTS,
    setSelectedComeback,
    applyFilters,
    resetFilters,
    exportToCSV,
    stats,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    isExtendedStatsModalOpen,
    setIsExtendedStatsModalOpen,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    totalMatchCount,
    isLoadingPage,
    isSupabaseConnected,
    errorMessage,
    
    // Add new filter dependencies
    minHomeGoals,
    maxHomeGoals,
    minAwayGoals,
    maxAwayGoals,
    resultType,
    htftCombination,
    setMinHomeGoals,
    setMaxHomeGoals,
    setMinAwayGoals,
    setMaxAwayGoals,
    setResultType,
    setHtftCombination
  ]);

  return React.createElement(MatchDataContext.Provider, { value: contextValue }, children);
};

// Custom hook to use the match data context
export const useMatchData = (): MatchDataContextType => {
  const context = useContext(MatchDataContext);
  if (context === undefined) {
    throw new Error('useMatchData must be used within a MatchDataProvider');
  }
  return context;
};

// Split the large hook into smaller specialized hooks
export const useMatchFilters = () => {
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team | null>(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team | null>(null);
  const [selectedBTTS, setSelectedBTTS] = useState<boolean | null>(null);
  const [selectedComeback, setSelectedComeback] = useState<boolean | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // Load stored filters on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      
      const data = JSON.parse(stored);
      
      // Restore filters
      if (data.filters) {
        if (data.filters.home) setSelectedHomeTeam(data.filters.home);
        if (data.filters.away) setSelectedAwayTeam(data.filters.away);
        if (data.filters.btts !== null) setSelectedBTTS(data.filters.btts);
        if (data.filters.comeback !== null) setSelectedComeback(data.filters.comeback);
        if (data.filters.startDate) setStartDate(data.filters.startDate);
        if (data.filters.endDate) setEndDate(data.filters.endDate);
      }
    } catch (error) {
      console.warn('Could not load stored filters:', error);
    }
  }, []);
  
  const saveFiltersToStorage = useCallback(() => {
    try {
      const filters = {
        home: selectedHomeTeam,
        away: selectedAwayTeam,
        btts: selectedBTTS,
        comeback: selectedComeback,
        startDate,
        endDate
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ filters }));
    } catch (error) {
      console.warn('Could not save filters to storage:', error);
    }
  }, [selectedHomeTeam, selectedAwayTeam, selectedBTTS, selectedComeback, startDate, endDate]);
  
  const clearFiltersFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Could not clear filters from storage:', error);
    }
  }, []);
  
  return {
    selectedHomeTeam,
    selectedAwayTeam,
    selectedBTTS,
    selectedComeback,
    startDate,
    endDate,
    setSelectedHomeTeam,
    setSelectedAwayTeam,
    setSelectedBTTS,
    setSelectedComeback,
    setStartDate,
    setEndDate,
    saveFiltersToStorage,
    clearFiltersFromStorage
  };
};

export const useMatchPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortKey, setSortKey] = useState<SortKey>('home');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Load stored pagination settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      
      const data = JSON.parse(stored);
      
      // Restore settings
      if (data.itemsPerPage) {
        setItemsPerPage(data.itemsPerPage);
      }
      
      if (data.sortKey) {
        setSortKey(data.sortKey);
        setSortDirection(data.sortDirection || 'asc');
      }
    } catch (error) {
      console.warn('Could not load stored pagination settings:', error);
    }
  }, []);
  
  const savePaginationToStorage = useCallback(() => {
    try {
      const data = {
        itemsPerPage,
        sortKey,
        sortDirection
      };
      
      localStorage.setItem('winmix-pagination', JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save pagination to storage:', error);
    }
  }, [itemsPerPage, sortKey, sortDirection]);
  
  return {
    currentPage,
    itemsPerPage,
    sortKey,
    sortDirection,
    setCurrentPage,
    setItemsPerPage,
    setSortKey,
    setSortDirection,
    savePaginationToStorage
  };
};
