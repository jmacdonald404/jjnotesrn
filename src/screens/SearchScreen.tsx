// SearchScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            placeholderTextColor="#999"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {searchQuery.trim() === '' ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>Search your notes</Text>
            <Text style={styles.emptyStateSubtext}>
              Type in the search box above to find notes
            </Text>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>No results found</Text>
            <Text style={styles.emptyStateSubtext}>
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
export default SearchScreen;