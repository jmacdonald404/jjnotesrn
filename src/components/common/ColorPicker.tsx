import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '../../types';
import { LIGHT_THEME, DARK_THEME, COLORS, DARK_COLORS } from '../../utils/constants';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  title?: string;
  showTitle?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  title = 'Choose Color',
  showTitle = true,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  const colorPalette = colorScheme === 'dark' ? DARK_COLORS : COLORS;

  const renderColorOption = (color: Color) => {
    const isSelected = selectedColor === color.value;

    return (
      <TouchableOpacity
        key={color.value}
        style={[
          styles.colorOption,
          {
            backgroundColor: color.value,
            borderColor: isSelected ? theme.primary : color.border,
          },
          isSelected && styles.selectedColorOption,
        ]}
        onPress={() => onColorSelect(color.value)}
        activeOpacity={0.7}
      >
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons
              name="checkmark"
              size={16}
              color={theme.primary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.title, { color: theme.foreground }]}>
          {title}
        </Text>
      )}
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {colorPalette.map(renderColorOption)}
      </ScrollView>
      
      {/* Color labels for accessibility */}
      <View style={styles.labelsContainer}>
        {colorPalette.map((color) => (
          <TouchableOpacity
            key={`label-${color.value}`}
            style={[
              styles.labelOption,
              selectedColor === color.value && {
                backgroundColor: theme.accent,
              },
            ]}
            onPress={() => onColorSelect(color.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.labelText,
                {
                  color: selectedColor === color.value ? theme.background : theme.mutedForeground,
                },
              ]}
            >
              {color.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColorOption: {
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  selectedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  labelOption: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ColorPicker;