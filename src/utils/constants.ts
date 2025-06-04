// utils/constants.ts
import { ColorOption, Theme, ViewMode, SortBy, UserSettings } from '../types';

export const COLORS: ColorOption[] = [
  { label: 'Default', value: '#ffffff', border: '#e4e4e7' },
  { label: 'Red', value: '#fef2f2', border: '#fecaca' },
  { label: 'Orange', value: '#fff7ed', border: '#fed7aa' },
  { label: 'Yellow', value: '#fefce8', border: '#fde047' },
  { label: 'Green', value: '#f0fdf4', border: '#bbf7d0' },
  { label: 'Blue', value: '#eff6ff', border: '#93c5fd' },
  { label: 'Purple', value: '#faf5ff', border: '#c4b5fd' },
  { label: 'Pink', value: '#fdf2f8', border: '#f9a8d4' },
];

export const DARK_COLORS: ColorOption[] = [
  { label: 'Default', value: '#1f1f23', border: '#27272a' },
  { label: 'Red', value: '#450a0a', border: '#7f1d1d' },
  { label: 'Orange', value: '#431407', border: '#9a3412' },
  { label: 'Yellow', value: '#422006', border: '#a16207' },
  { label: 'Green', value: '#052e16', border: '#166534' },
  { label: 'Blue', value: '#0c1e3e', border: '#1e3a8a' },
  { label: 'Purple', value: '#2e1065', border: '#6b21a8' },
  { label: 'Pink', value: '#500724', border: '#be185d' },
];

export const LIGHT_THEME = {
  background: '#ffffff',
  foreground: '#000000',
  card: '#f8f9fa',
  cardForeground: '#000000',
  primary: '#007AFF',
  primaryForeground: '#ffffff',
  secondary: '#f1f3f4',
  secondaryForeground: '#000000',
  muted: '#f1f3f4',
  mutedForeground: '#6b7280',
  border: '#e5e7eb',
  input: '#ffffff',
  accent: '#f1f3f4',
  accentForeground: '#000000',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
};

export const DARK_THEME = {
  background: '#000000',
  foreground: '#ffffff',
  card: '#1c1c1e',
  cardForeground: '#ffffff',
  primary: '#007AFF',
  primaryForeground: '#ffffff',
  secondary: '#2c2c2e',
  secondaryForeground: '#ffffff',
  muted: '#2c2c2e',
  mutedForeground: '#8e8e93',
  border: '#38383a',
  input: '#1c1c1e',
  accent: '#2c2c2e',
  accentForeground: '#ffffff',
  destructive: '#ff453a',
  destructiveForeground: '#ffffff',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: Theme.SYSTEM,
  fontSize: 16,
  viewMode: ViewMode.GRID,
  sortBy: SortBy.CREATED_DESC,
  backupEnabled: false,
};

export const STORAGE_KEYS = {
  NOTES: '@jjnotes/notes',
  SETTINGS: '@jjnotes/settings',
};