import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { AuthButton } from '@features/auth/components/AuthButton';

type Props = {
  nameInput: string;
  nameError: string | null;
  loading: boolean;
  onChangeName: (text: string) => void;
  onActivate: () => void;
};

// Formulario de creación de tienda.
// Simple intencionalmente — el usuario solo necesita un nombre para arrancar.
// Todo lo demás (logo, descripción, productos) lo configura después.
export const StoreSetup = ({
  nameInput, nameError, loading, onChangeName, onActivate
}: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>

      {/* Ícono decorativo */}
      <View style={[styles.iconContainer, { borderColor: colors.brand.secondary }]}>
        <Text style={[styles.icon, { color: colors.brand.secondary }]}>◈</Text>
      </View>

      <Text style={styles.title}>Creá tu tienda</Text>
      <Text style={styles.subtitle}>
        Vendé productos, ofrecé servicios y generá tu QR personalizado dentro del ecosistema Union App.
      </Text>

      {/* Campo nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NOMBRE DE LA TIENDA</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: nameError ? Colors.status.error : 'rgba(255,255,255,0.15)' }
          ]}
          value={nameInput}
          onChangeText={onChangeName}
          placeholder="Ej: Ropa Vintage BA"
          placeholderTextColor={Colors.dark.icon}
          maxLength={40}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {/* Contador de caracteres */}
        <Text style={styles.charCount}>{nameInput.length}/40</Text>
        {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
      </View>

      <AuthButton
        label="Activar mi tienda"
        onPress={onActivate}
        loading={loading}
      />

      <Text style={styles.disclaimer}>
        Podés cambiar el nombre y personalizar todo después.
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(255,101,132,0.08)',
  },
  icon: {
    fontSize: 32,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1.5,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  charCount: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'right',
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
  },
  disclaimer: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});