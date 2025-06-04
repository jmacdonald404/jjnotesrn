import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Animated,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NoteType } from '../types';
import { LIGHT_THEME, DARK_THEME } from '../utils/constants';

const FloatingActionButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  const handlePress = () => {
    // Scale animation for press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setModalVisible(true);
  };

  const handleCreateNote = (type: NoteType) => {
    setModalVisible(false);
    // For now, just log the type. You'll implement navigation to CreateNote screen later
    console.log('Creating note of type:', type);
    // navigation.navigate('CreateNote' as never, { type } as never);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 90 + 10, // Tab bar height + spacing
            transform: [{ scale: scaleAnim }],
            backgroundColor: theme.primary,
            shadowColor: theme.foreground,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={28}
            color={theme.primaryForeground}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Note Type Selection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <Pressable
              style={[styles.modalContent, { backgroundColor: theme.card }]}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: theme.foreground }]}>
                Create New
              </Text>
              
              {/* Note Option */}
              <TouchableOpacity
                style={[styles.optionButton, { borderBottomColor: theme.border }]}
                onPress={() => handleCreateNote(NoteType.STANDARD)}
              >
                <View style={styles.optionContent}>
                  <View style={[styles.optionIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: theme.foreground }]}>
                      Note
                    </Text>
                    <Text style={[styles.optionDescription, { color: theme.mutedForeground }]}>
                      Create a new text note
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Checklist Option */}
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleCreateNote(NoteType.TODO)}
              >
                <View style={styles.optionContent}>
                  <View style={[styles.optionIcon, { backgroundColor: theme.secondary + '40' }]}>
                    <Ionicons
                      name="checkbox-outline"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: theme.foreground }]}>
                      Checklist
                    </Text>
                    <Text style={[styles.optionDescription, { color: theme.mutedForeground }]}>
                      Create a new todo checklist
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.cancelButton, { borderTopColor: theme.border }]}
                onPress={closeModal}
              >
                <Text style={[styles.cancelText, { color: theme.mutedForeground }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: '50%',
    marginLeft: -28, // Half of button width to center
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 320,
  },
  modalContent: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  cancelButton: {
    paddingVertical: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FloatingActionButton;