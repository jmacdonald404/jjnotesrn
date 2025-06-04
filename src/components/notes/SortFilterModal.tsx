// components/notes/SortFilterModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortBy, ViewMode, NoteType } from '../../types';
import { LIGHT_THEME, DARK_THEME } from '../../utils/constants';

interface FilterOptions {
  sortBy: SortBy;
  viewMode: ViewMode;
  showArchived: boolean;
  showDeleted: boolean;
  noteType?: NoteType;
}

interface SortFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Default filter options
const DEFAULT_FILTERS: FilterOptions = {
  sortBy: SortBy.CREATED_DESC,
  viewMode: ViewMode.GRID,
  showArchived: false,
  showDeleted: false,
  noteType: undefined,
};

const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  // Use default filters if filters prop is undefined, and initialize with a safe fallback
  const [localFilters, setLocalFilters] = useState<FilterOptions>(() => {
    return filters || DEFAULT_FILTERS;
  });

  useEffect(() => {
    // Only update if filters is defined
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const getSortLabel = (sortBy: SortBy): string => {
    switch (sortBy) {
      case SortBy.CREATED_DESC:
        return 'Newest First';
      case SortBy.CREATED_ASC:
        return 'Oldest First';
      case SortBy.MODIFIED_DESC:
        return 'Recently Modified';
      case SortBy.ALPHA_ASC:
        return 'A to Z';
      case SortBy.ALPHA_DESC:
        return 'Z to A';
      default:
        return 'Newest First';
    }
  };

  const getSortIcon = (sortBy: SortBy): keyof typeof Ionicons.glyphMap => {
    switch (sortBy) {
      case SortBy.CREATED_DESC:
      case SortBy.MODIFIED_DESC:
        return 'arrow-down-outline';
      case SortBy.CREATED_ASC:
        return 'arrow-up-outline';
      case SortBy.ALPHA_ASC:
        return 'text-outline';
      case SortBy.ALPHA_DESC:
        return 'text-outline';
      default:
        return 'arrow-down-outline';
    }
  };

  const renderOptionRow = (
    title: string,
    value: boolean,
    onPress: () => void,
    icon?: keyof typeof Ionicons.glyphMap
  ) => (
    <TouchableOpacity
      style={[styles.optionRow, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={theme.mutedForeground}
            style={styles.optionIcon}
          />
        )}
        <Text style={[styles.optionText, { color: theme.foreground }]}>
          {title}
        </Text>
      </View>
      <View style={[
        styles.checkbox,
        {
          backgroundColor: value ? theme.primary : 'transparent',
          borderColor: value ? theme.primary : theme.border,
        }
      ]}>
        {value && (
          <Ionicons
            name="checkmark"
            size={16}
            color={theme.primaryForeground}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSortOption = (sortBy: SortBy) => (
    <TouchableOpacity
      key={sortBy}
      style={[
        styles.sortOption,
        {
          backgroundColor: localFilters.sortBy === sortBy ? theme.accent : 'transparent',
          borderColor: theme.border,
        }
      ]}
      onPress={() => updateFilter('sortBy', sortBy)}
      activeOpacity={0.7}
    >
      <View style={styles.sortOptionContent}>
        <Ionicons
          name={getSortIcon(sortBy)}
          size={18}
          color={localFilters.sortBy === sortBy ? theme.primary : theme.mutedForeground}
        />
        <Text
          style={[
            styles.sortOptionText,
            {
              color: localFilters.sortBy === sortBy ? theme.foreground : theme.mutedForeground,
              fontWeight: localFilters.sortBy === sortBy ? '600' : '400',
            }
          ]}
        >
          {getSortLabel(sortBy)}
        </Text>
      </View>
      {localFilters.sortBy === sortBy && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.primary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.foreground }]}>
            Sort & Filter
          </Text>
          
          <TouchableOpacity onPress={handleApply} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
              Sort By
            </Text>
            <View style={styles.sortOptions}>
              {Object.values(SortBy).map(renderSortOption)}
            </View>
          </View>

          {/* View Mode Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
              View Mode
            </Text>
            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  {
                    backgroundColor: localFilters.viewMode === ViewMode.GRID ? theme.primary : theme.card,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => updateFilter('viewMode', ViewMode.GRID)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color={localFilters.viewMode === ViewMode.GRID ? theme.primaryForeground : theme.mutedForeground}
                />
                <Text
                  style={[
                    styles.viewModeText,
                    {
                      color: localFilters.viewMode === ViewMode.GRID ? theme.primaryForeground : theme.mutedForeground,
                    }
                  ]}
                >
                  Grid
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  {
                    backgroundColor: localFilters.viewMode === ViewMode.LIST ? theme.primary : theme.card,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => updateFilter('viewMode', ViewMode.LIST)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="list-outline"
                  size={20}
                  color={localFilters.viewMode === ViewMode.LIST ? theme.primaryForeground : theme.mutedForeground}
                />
                <Text
                  style={[
                    styles.viewModeText,
                    {
                      color: localFilters.viewMode === ViewMode.LIST ? theme.primaryForeground : theme.mutedForeground,
                    }
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Note Type Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
              Note Type
            </Text>
            <View style={styles.noteTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.noteTypeButton,
                  {
                    backgroundColor: !localFilters.noteType ? theme.primary : theme.card,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => updateFilter('noteType', undefined)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.noteTypeText,
                    {
                      color: !localFilters.noteType ? theme.primaryForeground : theme.mutedForeground,
                    }
                  ]}
                >
                  All Notes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.noteTypeButton,
                  {
                    backgroundColor: localFilters.noteType === NoteType.STANDARD ? theme.primary : theme.card,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => updateFilter('noteType', NoteType.STANDARD)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={localFilters.noteType === NoteType.STANDARD ? theme.primaryForeground : theme.mutedForeground}
                  style={styles.noteTypeIcon}
                />
                <Text
                  style={[
                    styles.noteTypeText,
                    {
                      color: localFilters.noteType === NoteType.STANDARD ? theme.primaryForeground : theme.mutedForeground,
                    }
                  ]}
                >
                  Notes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.noteTypeButton,
                  {
                    backgroundColor: localFilters.noteType === NoteType.TODO ? theme.primary : theme.card,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => updateFilter('noteType', NoteType.TODO)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkbox-outline"
                  size={16}
                  color={localFilters.noteType === NoteType.TODO ? theme.primaryForeground : theme.mutedForeground}
                  style={styles.noteTypeIcon}
                />
                <Text
                  style={[
                    styles.noteTypeText,
                    {
                      color: localFilters.noteType === NoteType.TODO ? theme.primaryForeground : theme.mutedForeground,
                    }
                  ]}
                >
                  Checklists
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
              Show
            </Text>
            <View style={[styles.optionsContainer, { backgroundColor: theme.card }]}>
              {renderOptionRow(
                'Archived Notes',
                localFilters.showArchived,
                () => updateFilter('showArchived', !localFilters.showArchived),
                'archive-outline'
              )}
              {renderOptionRow(
                'Deleted Notes',
                localFilters.showDeleted,
                () => updateFilter('showDeleted', !localFilters.showDeleted),
                'trash-outline'
              )}
            </View>
          </View>

          {/* Reset Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.border }]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color={theme.mutedForeground}
              />
              <Text style={[styles.resetButtonText, { color: theme.mutedForeground }]}>
                Reset to Default
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sortOptionText: {
    fontSize: 15,
    marginLeft: 12,
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewModeText: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  noteTypeContainer: {
    gap: 8,
  },
  noteTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  noteTypeIcon: {
    marginRight: 8,
  },
  noteTypeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SortFilterModal;