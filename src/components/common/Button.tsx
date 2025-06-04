import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LIGHT_THEME, DARK_THEME } from '../../utils/constants';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 6;
        baseStyle.minHeight = 32;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = 24;
        baseStyle.paddingVertical = 16;
        baseStyle.minHeight = 56;
        break;
      default: // md
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 44;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = theme.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = theme.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.border;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'destructive':
        baseStyle.backgroundColor = theme.destructive;
        break;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size text styles
    switch (size) {
      case 'sm':
        baseTextStyle.fontSize = 14;
        break;
      case 'lg':
        baseTextStyle.fontSize = 18;
        break;
      default: // md
        baseTextStyle.fontSize = 16;
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
        baseTextStyle.color = theme.primaryForeground;
        break;
      case 'secondary':
        baseTextStyle.color = theme.secondaryForeground;
        break;
      case 'outline':
        baseTextStyle.color = theme.foreground;
        break;
      case 'ghost':
        baseTextStyle.color = theme.foreground;
        break;
      case 'destructive':
        baseTextStyle.color = theme.destructiveForeground;
        break;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextStyle().color}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;