// components/NoteCard.tsx
import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, NoteType, ViewMode } from '../../types';
import { LIGHT_THEME, DARK_THEME, COLORS, DARK_COLORS } from '../../utils/constants';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
  onPress: () => void;
  onLongPress?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = memo(({ 
  note, 
  viewMode, 
  onPress, 
  onLongPress 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const colorPalette = isDark ? DARK_COLORS : COLORS;

  const noteColor = colorPalette.find(c => c.value === note.color) || colorPalette[0];
  const isGrid = viewMode === ViewMode.GRID;

  const getPreviewText = () => {
    if (note.type === NoteType.TODO && note.todoItems) {
      const completed = note.todoItems.filter(item => item.completed).length;
      const total = note.todoItems.length;
      if (total === 0) return 'Empty checklist';
      return `${completed}/${total} completed`;
    }
    return note.content ? note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '') : '';
  };

  const containerStyle = [
    styles.container,
    isGrid ? styles.gridContainer : styles.listContainer,
    {
      backgroundColor: noteColor.value,
      borderColor: noteColor.border,
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Color indicator */}
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: note.color !== COLORS[0].value ? note.color : theme.border }
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name={note.type === NoteType.TODO ? 'checkbox-outline' : 'document-text-outline'}
              size={16}
              color={theme.mutedForeground}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.title,
                { color: theme.foreground },
                !note.title && { color: theme.mutedForeground }
              ]}
              numberOfLines={isGrid ? 2 : 1}
            >
              {note.title || 'Untitled'}
            </Text>
          </View>
          
          {(note.isArchived || note.isDeleted) && (
            <Ionicons
              name={note.isArchived ? 'archive-outline' : 'trash-outline'}
              size={14}
              color={theme.mutedForeground}
            />
          )}
        </View>

        {/* Preview text */}
        {getPreviewText() && (
          <Text
            style={[styles.preview, { color: theme.mutedForeground }]}
            numberOfLines={isGrid ? 3 : 2}
          >
            {getPreviewText()}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.date, { color: theme.mutedForeground }]}>
            {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  gridContainer: {
    minHeight: 120,
  },
  listContainer: {
    minHeight: 80,
  },
  colorIndicator: {
    width: 4,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
});

NoteCard.displayName = 'NoteCard';

export default NoteCard;