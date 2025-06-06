// src/hooks/useNotes.ts
import { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
