// SearchScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { Note } from '../types';
import NoteCard from '../components/notes/NoteCard';
import { RootStackParamList } from '../../App';
import { LIGHT_THEME, DARK_THEME } from '../utils/constants';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  
  const { notes, updateNote } = useNotes();
  const { settings } = useSettings();

  // Filter notes based on search query
  const filteredNotes = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      !note.isDeleted &&
      (note.title?.toLowerCase().includes(query) || 
       note.content?.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleNotePress = (note: Note) => {
    navigation.navigate('NoteView', { noteId: note.id });
  };

  const handleNoteUpdate = (updatedNote: Partial<Note> & { id: string }) => {
    updateNote(updatedNote.id, {
      ...updatedNote,
      updatedAt: new Date(),
    });
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item)}
      onUpdate={handleNoteUpdate}
      viewMode={settings.viewMode}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>Search</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="search-outline" size={20} color={theme.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.foreground }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            placeholderTextColor={theme.mutedForeground}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {searchQuery.trim() === '' ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={theme.mutedForeground} />
            <Text style={[styles.emptyStateText, { color: theme.mutedForeground }]}>Search your notes</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.mutedForeground }]}>
              Type in the search box above to find notes
            </Text>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={theme.mutedForeground} />
            <Text style={[styles.emptyStateText, { color: theme.mutedForeground }]}>No results found</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.mutedForeground }]}>
              Try different keywords
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 120 },
            ]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen;