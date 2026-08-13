import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { COLORS } from '@/constants/colors';

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme?: 'primary' | 'secondary';
  onPress: () => void;
  disabled?: boolean;
};

export default function AppButton({ title, icon, theme = 'secondary', onPress, disabled }: Props) {
  const [pressed, setPressed] = useState(false);

  if (theme === 'primary') {
    return (
      <View style={styles.buttonOuter}>
        <Pressable
          style={({ pressed: pressState }) => [
            styles.primaryButton,
            pressState && !disabled && styles.primaryButtonPressed,
            disabled && styles.buttonDisabled,
          ]}
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          disabled={disabled}
        >
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.textOnPrimary}
            style={styles.icon}
          />
          <Text style={styles.primaryLabel}>{title}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonOuter}>
      <Pressable
        style={({ pressed: pressState }) => [
          styles.secondaryButton,
          pressState && !disabled && styles.secondaryButtonPressed,
          disabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
      >
        <Ionicons
          name={icon}
          size={22}
          color={disabled ? COLORS.textTertiary : COLORS.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.secondaryLabel, disabled && styles.labelDisabled]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    width: '100%',
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  secondaryButtonPressed: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.primary,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: { 
    paddingRight: 10,
    marginBottom: 1,
  },
  primaryLabel: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: COLORS.textOnPrimary,
    letterSpacing: 0.2,
  },
  secondaryLabel: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: COLORS.textPrimary,
  },
  labelDisabled: {
    color: COLORS.textTertiary,
  },
});
