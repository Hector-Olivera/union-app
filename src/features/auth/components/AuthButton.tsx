import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, View
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  // variant ghost = botón sin relleno, para acciones secundarias
};

export const AuthButton = ({
  label, onPress, loading = false,
  disabled = false, variant = 'primary'
}: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        variant === 'ghost' && styles.buttonGhost,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : Colors.brand.primary}
          size="small"
        />
      ) : (
        <Text style={[
          styles.label,
          variant === 'ghost' && styles.labelGhost,
          isDisabled && styles.labelDisabled,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xs,
    // Sin sombra externa en dark theme — el color propio es suficiente
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.5,
  },
  labelGhost: {
    color: Colors.dark.text,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});