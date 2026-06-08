import { useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
  StyleSheet, Animated
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoComplete?: string;
};

export const AuthInput = ({
  label, value, onChangeText, onBlur,
  error, placeholder, secureTextEntry = false,
  autoCapitalize = 'none', keyboardType = 'default',
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(!secureTextEntry);
  // isVisible controla si se muestra la contraseña
  // Arranca en false si es campo de password, true si no lo es

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.(); // El ?. evita error si onBlur no fue pasado como prop
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        !!error && styles.inputWrapperError,
        // !! convierte el string a boolean para el condicional
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={Colors.dark.icon}
          secureTextEntry={secureTextEntry && !isVisible}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={false}
          // autoCorrect false en campos de auth evita que el corrector
          // cambie emails o contraseñas por "palabras correctas"
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsVisible(v => !v)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            // hitSlop agranda el área táctil sin cambiar el tamaño visual
          >
            <Text style={styles.eyeText}>{isVisible ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Solo renderiza el error si existe, evita espacio vacío */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    // Estética HUD: labels en uppercase con tracking
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: Colors.brand.primary,
    backgroundColor: 'rgba(108,99,255,0.08)',
    // Glow sutil al enfocar — característica visual del tema cyberpunk
  },
  inputWrapperError: {
    borderColor: Colors.status.error,
    backgroundColor: 'rgba(255,82,82,0.06)',
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    height: '100%',
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  eyeText: {
    fontSize: 16,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});