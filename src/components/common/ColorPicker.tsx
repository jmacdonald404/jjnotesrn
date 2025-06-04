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