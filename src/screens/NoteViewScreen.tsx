import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import { Note, NoteType, TodoItem } from '../types';
import { LIGHT_THEME, DARK_THEME, COLORS, DARK_COLORS } from '../utils/constants';

type RootStackParamList = {
  NoteView: { noteId: string };
};

type NoteViewScreenRouteProp = RouteProp<RootStackParamList, 'NoteView'>;

const NoteViewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<NoteViewScreenRouteProp>();
  const { notes, updateNote, deleteNote } = useNotes();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  const colorPalette = colorScheme === 'dark' ? DARK_COLORS : COLORS;

  const noteId = route.params?.noteId;
  const existingNote = notes.find(n => n.id === noteId);

  const [note, setNote] = useState<Note>(
    existingNote || {
      id: noteId || Date.now().toString(),
      title: '',
      content: '',
      type: NoteType.STANDARD,
      color: COLORS[0].value,
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      todoItems: [],
    }
  );

  const [isEditing, setIsEditing] = useState(!existingNote);

  useEffect(() => {
    if (existingNote) {
      setNote(existingNote);
    }
  }, [existingNote]);

  const handleSave = () => {
    const updatedNote = {
      ...note,
      updatedAt: new Date(),
    };
    updateNote(updatedNote);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteNote(note.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddTodoItem = () => {
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      createdAt: new Date(),
    };
    setNote(prev => ({
      ...prev,
      todoItems: [...(prev.todoItems || []), newItem],
    }));
  };

  const handleUpdateTodoItem = (itemId: string, updates: Partial<TodoItem>) => {
    setNote(prev => ({
      ...prev,
      todoItems: prev.todoItems?.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  };

  const handleDeleteTodoItem = (itemId: string) => {
    setNote(prev => ({
      ...prev,
      todoItems: prev.todoItems?.filter(item => item.id !== itemId),
    }));
  };

  const renderTodoItems = () => {
    if (note.type !== NoteType.TODO) return null;

    return (
      <View style={styles.todoContainer}>
        {note.todoItems?.map((item, index) => (
          <View key={item.id} style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => handleUpdateTodoItem(item.id, { completed: !item.completed })}
              style={styles.checkbox}
            >
              <Ionicons
                name={item.completed ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={item.completed ? theme.primary : theme.mutedForeground}
              />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.todoInput,
                { color: theme.foreground },
                item.completed && styles.completedTodo,
              ]}
              value={item.text}
              onChangeText={(text) => handleUpdateTodoItem(item.id, { text })}
              placeholder="Enter task..."
              placeholderTextColor={theme.mutedForeground}
              editable={isEditing}
              multiline
            />
            {isEditing && (
              <TouchableOpacity
                onPress={() => handleDeleteTodoItem(item.id)}
                style={styles.deleteTodoButton}
              >
                <Ionicons name="close" size={20} color={theme.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {isEditing && (
          <TouchableOpacity
            onPress={handleAddTodoItem}
            style={[styles.addTodoButton, { borderColor: theme.border }]}
          >
            <Ionicons name="add" size={20} color={theme.mutedForeground} />
            <Text style={[styles.addTodoText, { color: theme.mutedForeground }]}>
              Add item
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const selectedColor = colorPalette.find(c => c.value === note.color) || colorPalette[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.foreground} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            {isEditing ? (
              <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, { color: theme.primary }]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.headerButton}
                >
                  <Ionicons name="pencil" size={20} color={theme.foreground} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                  <Ionicons name="trash-outline" size={20} color={theme.destructive} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={[styles.content, { backgroundColor: selectedColor.value }]}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Title */}
          <TextInput
            style={[styles.titleInput, { color: theme.foreground }]}
            value={note.title}
            onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
            placeholder="Note title..."
            placeholderTextColor={theme.mutedForeground}
            editable={isEditing}
            multiline
          />

          {/* Todo Items or Content */}
          {note.type === NoteType.TODO ? (
            renderTodoItems()
          ) : (
            <TextInput
              style={[styles.contentInput, { color: theme.foreground }]}
              value={note.content}
              onChangeText={(text) => setNote(prev => ({ ...prev, content: text }))}
              placeholder="Start writing..."
              placeholderTextColor={theme.mutedForeground}
              editable={isEditing}
              multiline
              textAlignVertical="top"
            />
          )}
        </ScrollView>

        {/* Color Picker */}
        {isEditing && (
          <View style={[styles.colorPicker, { backgroundColor: theme.card }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {colorPalette.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value, borderColor: color.border },
                    note.color === color.value && styles.selectedColor,
                  ]}
                  onPress={() => setNote(prev => ({ ...prev, color: color.value }))}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    minHeight: '100%',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
  },
  todoContainer: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  todoInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 4,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteTodoButton: {
    marginLeft: 8,
    padding: 4,
  },
  addTodoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 8,
  },
  addTodoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  colorPicker: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
});

export default NoteViewScreen;