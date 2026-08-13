import { StyleSheet, View, ViewProps } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = ViewProps & {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
};

export default function Card({ children, variant = 'default', style, ...props }: Props) {
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.elevatedCard,
        variant === 'outlined' && styles.outlinedCard,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  elevatedCard: {
    backgroundColor: COLORS.surfaceLight,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
