import { useState, useEffect } from 'react';

export type Language = 'en' | 'hu';

interface Translations {
  [key: string]: {
    en: string;
    hu: string;
  };
}

const translations: Translations = {
  // CSV Upload translations
  'csvUpload.title': {
    en: 'Upload Match Data',
    hu: 'Meccs Adatok Feltöltése'
  },
  'csvUpload.uploadDate': {
    en: 'Upload Date',
    hu: 'Feltöltés Dátuma'
  },
  'csvUpload.selectFile': {
    en: 'Select CSV File',
    hu: 'CSV Fájl Kiválasztása'
  },
  'csvUpload.preview': {
    en: 'Preview Data',
    hu: 'Adatok Előnézete'
  },
  'csvUpload.validMatches': {
    en: 'Valid Matches',
    hu: 'Érvényes Meccsek'
  },
  'csvUpload.errorMatches': {
    en: 'Error Matches',
    hu: 'Hibás Meccsek'
  },
  'csvUpload.save': {
    en: 'Save Data',
    hu: 'Adatok Mentése'
  },
  'csvUpload.cancel': {
    en: 'Cancel',
    hu: 'Mégsem'
  },
  'csvUpload.saving': {
    en: 'Saving...',
    hu: 'Mentés...'
  },
  'csvUpload.success': {
    en: 'matches saved successfully',
    hu: 'meccs sikeresen mentve'
  },
  'csvUpload.errors': {
    en: 'errors occurred',
    hu: 'hiba történt'
  },
  'csvUpload.exportErrors': {
    en: 'Export Errors',
    hu: 'Hibák Exportálása'
  },
  'csvUpload.fixSuggestion': {
    en: 'Fix Suggestion',
    hu: 'Javítási Javaslat'
  },
  
  // Error messages
  'error.teamNotFound': {
    en: 'Team not found',
    hu: 'Csapat nem található'
  },
  'error.invalidTimeFormat': {
    en: 'Invalid time format',
    hu: 'Érvénytelen időformátum'
  },
  'error.invalidGoals': {
    en: 'Invalid goal numbers',
    hu: 'Érvénytelen gólszámok'
  },
  'error.duplicateMatch': {
    en: 'Duplicate match',
    hu: 'Duplikált meccs'
  },
  'error.databaseError': {
    en: 'Database error',
    hu: 'Adatbázis hiba'
  },
  
  // Team suggestions
  'suggestion.exactMatch': {
    en: 'Exact match found',
    hu: 'Pontos egyezés találva'
  },
  'suggestion.closeMatch': {
    en: 'Close match',
    hu: 'Hasonló egyezés'
  },
  'suggestion.possibleMatch': {
    en: 'Possible match',
    hu: 'Lehetséges egyezés'
  },
  'suggestion.containsMatch': {
    en: 'Contains match',
    hu: 'Tartalmaz egyezést'
  },
  
  // UI elements
  'ui.language': {
    en: 'Language',
    hu: 'Nyelv'
  },
  'ui.english': {
    en: 'English',
    hu: 'Angol'
  },
  'ui.hungarian': {
    en: 'Hungarian',
    hu: 'Magyar'
  }
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('hu');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hu')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return {
    language,
    changeLanguage,
    t
  };
}