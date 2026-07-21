import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

// Botón de Google Sign-In. El fondo blanco y el ícono son parte de
// las guías de marca de Google — no las personalizamos con el tema
// de la app, a diferencia del resto de nuestros botones.
export const GoogleSignInButton = ({ onPress, loading = false, disabled = false }: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#1a1a1a" size="small" />
      ) : (
        <>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>G</Text>
          </View>
          <Text style={styles.label}>Continuar con Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  label: {
    color: '#1a1a1a',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});