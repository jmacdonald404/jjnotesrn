// Port from your existing types
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
}

export enum SortBy {
  CREATED_DESC = 'created_desc',
  CREATED_ASC = 'created_asc',
  MODIFIED_DESC = 'modified_desc',
  ALPHA_ASC = 'alpha_asc',
  ALPHA_DESC = 'alpha_desc',
}

export enum NoteType {
  STANDARD = 'standard',
  TODO = 'todo',
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title?: string;
  content?: string;
  type: NoteType;
  color: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  todoItems?: TodoItem[];
}

export interface UserSettings {
  theme: Theme;
  fontSize: number;
  viewMode: ViewMode;
  sortBy: SortBy;
  backupEnabled: boolean;
}

export interface ColorOption {
  label: string;
  value: string;
  border: string;
}

// Add the Color interface that was missing
export interface Color {
  label: string;
  value: string;
  border: string;
}

// Navigation types
export type RootTabParamList = {
  Notes: undefined;
  Calendar: undefined;
  Search: undefined;
  Settings: undefined;
};

export type NotesStackParamList = {
  NotesList: undefined;
  NoteView: { noteId: string };
  CreateNote: { type?: NoteType };
};