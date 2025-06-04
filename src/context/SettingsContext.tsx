import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, Theme, ViewMode, SortBy } from '../types';
import { storage } from '../utils/storage';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: Theme.SYSTEM,
  fontSize: 16,
  viewMode: ViewMode.GRID,
  sortBy: SortBy.CREATED_DESC,
  backupEnabled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  const loadSettings = async () => {
    const savedSettings = await storage.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      resetSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsContextProvider');
  }
  return context;
};