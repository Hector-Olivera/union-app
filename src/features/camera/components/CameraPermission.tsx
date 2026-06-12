import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  onRequestPermission: () => void;
  isDenied?: boolean;
  // isDenied: true cuando el usuario rechazó el permiso previamente
  // Requiere ir a configuración del sistema — no podemos pedirlo de nuevo
};

export const CameraPermission = ({ onRequestPermission, isDenied = false }: Props) => {
  return (
    <View style={styles.container}>

      {/* Ícono decorativo */}
      <View style={styles.iconContainer}>
        <View style={styles.iconRing}>
          <Text style={styles.iconText}>◎</Text>
        </View>
      </View>

      <Text style={styles.title}>
        {isDenied ? 'Permiso denegado' : 'Acceso a la cámara'}
      </Text>

      <Text style={styles.description}>
        {isDenied
          ? 'Para usar esta función, habilitá el permiso de cámara en Configuración del sistema.'
          : 'Union App necesita acceso a la cámara para la experiencia AR y el escaneo de códigos QR.'
        }
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onRequestPermission}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isDenied ? 'Ir a Configuración' : 'Permitir acceso'}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(108,99,255,0.08)',
    // Glow sutil — consistente con el estilo del resto de la plataforma
  },
  iconText: {
    fontSize: 36,
    color: Colors.brand.primary,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    lineHeight: 24,
    // lineHeight = fontSize * 1.6 — regla estándar para legibilidad
    marginBottom: Spacing.xxl,
  },
  button: {
    backgroundColor: Colors.brand.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radius.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});