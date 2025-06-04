import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, UserSettings, Theme, ViewMode, SortBy } from '../types';
import { storage } from '../utils/storage';

interface NotesContextType {
  notes: Note[];
  settings: UserSettings;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateSettings: (settings: UserSettings) => void;
}

const defaultSettings: UserSettings = {
  theme: Theme.SYSTEM,
  fontSize: 16,
  viewMode: ViewMode.GRID,
  sortBy: SortBy.CREATED_DESC,
  backupEnabled: false,
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  const loadData = async () => {
    const [savedNotes, savedSettings] = await Promise.all([
      storage.getNotes(),
      storage.getSettings(),
    ]);
    
    setNotes(savedNotes);
    if (savedSettings) setSettings(savedSettings);
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isDeleted: true, deletedAt: new Date() } : note
    ));
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      settings, 
      addNote, 
      updateNote, 
      deleteNote, 
      updateSettings 
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};