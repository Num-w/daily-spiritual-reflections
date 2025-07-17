import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  fr: {
    // Header
    'app.title': 'Daily Meditations',
    'app.subtitle': 'Votre journal spirituel',
    
    // Navigation
    'nav.meditations': 'Méditations',
    'nav.favorites': 'Favoris',
    'nav.sermons': 'Sermons',
    'nav.stats': 'Statistiques',
    'nav.settings': 'Paramètres',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.general': 'Général',
    'settings.appearance': 'Apparence',
    'settings.notifications': 'Notifications',
    'settings.backup': 'Sauvegarde',
    'settings.search': 'Recherche',
    'settings.features': 'Fonctionnalités',
    'settings.language': 'Langue',
    
    // Appearance
    'appearance.title': 'Apparence',
    'appearance.darkMode': 'Mode sombre',
    'appearance.fontSize': 'Taille de police',
    'appearance.fontSize.small': 'Petite',
    'appearance.fontSize.normal': 'Normale',
    'appearance.fontSize.large': 'Grande',
    'appearance.fontSize.xlarge': 'Très grande',
    
    // Security
    'security.title': 'Sécurité',
    'security.changePassword': 'Changer le mot de passe',
    'security.autoLock': 'Verrouillage automatique',
    'security.cancel': 'Annuler',
    
    // Notifications
    'notifications.title': 'Rappels',
    'notifications.morning': 'Rappel matin',
    
    // Backup
    'backup.export': 'Exporter mes données',
    'backup.import': 'Importer des données',
    'backup.cloud': 'Synchronisation Cloud',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English'
  },
  en: {
    // Header
    'app.title': 'Daily Meditations',
    'app.subtitle': 'Your spiritual journal',
    
    // Navigation
    'nav.meditations': 'Meditations',
    'nav.favorites': 'Favorites',
    'nav.sermons': 'Sermons',
    'nav.stats': 'Statistics',
    'nav.settings': 'Settings',
    
    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.backup': 'Backup',
    'settings.search': 'Search',
    'settings.features': 'Features',
    'settings.language': 'Language',
    
    // Appearance
    'appearance.title': 'Appearance',
    'appearance.darkMode': 'Dark mode',
    'appearance.fontSize': 'Font size',
    'appearance.fontSize.small': 'Small',
    'appearance.fontSize.normal': 'Normal',
    'appearance.fontSize.large': 'Large',
    'appearance.fontSize.xlarge': 'Extra large',
    
    // Security
    'security.title': 'Security',
    'security.changePassword': 'Change password',
    'security.autoLock': 'Auto lock',
    'security.cancel': 'Cancel',
    
    // Notifications
    'notifications.title': 'Reminders',
    'notifications.morning': 'Morning reminder',
    
    // Backup
    'backup.export': 'Export my data',
    'backup.import': 'Import data',
    'backup.cloud': 'Cloud synchronization',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English'
  }
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageState = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  return { language, setLanguage, t };
};