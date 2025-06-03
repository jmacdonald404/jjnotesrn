// src/hooks/useSettings.ts
import { useNotes } from './useNotes';

export const useSettings = () => {
  const { settings, updateSettings } = useNotes();
  return { settings, updateSettings };
};
