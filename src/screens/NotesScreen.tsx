import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { Note, ViewMode, SortBy } from '../types';
import NoteCard from '../components/NoteCard';
import SortFilterModal from '../components/SortFilterModal';
import { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const NotesScreen: React.FC = () => {
  const [showSortModal, setShowSortModal] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const { notes, updateNote } = useNotes();
  const { settings } = useSettings();

  // Filter notes (active and archived separately)
  const activeNotes = notes.filter(note => !note.isDeleted && !note.isArchived);
  const archivedNotes = notes.filter(note => !note.isDeleted && note.isArchived);

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

  const getItemLayout = (data: any, index: number) => {
    const itemHeight = settings.viewMode === ViewMode.GRID ? 120 : 80;
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  };

  const numColumns = settings.viewMode === ViewMode.GRID ? 2 : 1;
  const key = `${settings.viewMode}-${numColumns}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>JJNotes</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="funnel-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>No notes yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to create your first note
            </Text>
          </View>
        ) : (
          <FlatList
            key={key}
            data={activeNotes}
            renderItem={renderNoteItem}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 120 }, // Account for FAB and tab bar
            ]}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={
              archivedNotes.length > 0 ? (
                <View style={styles.archivedSection}>
                  <Text style={styles.sectionTitle}>Archived Notes</Text>
                  {archivedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onPress={() => handleNotePress(note)}
                      onUpdate={handleNoteUpdate}
                      viewMode={settings.viewMode}
                    />
                  ))}
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Sort/Filter Modal */}
      <SortFilterModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        notes={notes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -50,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#CCC',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  archivedSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
});

export default NotesScreen;