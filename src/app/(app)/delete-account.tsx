import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '@stores/storeStore';
import { deleteAccount } from '@services/firebase/auth';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const { store } = useStoreStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestDelete = () => {
    if (!password) {
      setError('Ingresá tu contraseña para confirmar');
      return;
    }
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await deleteAccount(password);
      // Al eliminar la cuenta, el observer de auth detecta la sesión
      // cerrada automáticamente y redirige a login — no hace falta
      // navegar manualmente acá
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('La contraseña es incorrecta');
      } else {
        setError('No pudimos eliminar la cuenta. Intentá de nuevo.');
      }
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Eliminar cuenta</Text>
        <Text style={styles.warning}>
          Esta acción es irreversible. Se eliminarán tu perfil, tu tienda{store ? ` ("${store.name}")` : ''} y todos tus datos asociados.
        </Text>

        <Text style={styles.label}>CONFIRMÁ TU CONTRASEÑA</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.dark.icon}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleRequestDelete}
          disabled={loading}
        >
          <Text style={styles.deleteText}>{loading ? 'Eliminando...' : 'Eliminar mi cuenta'}</Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={showConfirm}
        title="¿Eliminar cuenta definitivamente?"
        message="No vas a poder recuperar tu perfil, tienda ni datos. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.dark.background 
  },
  backButton: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.sm },
  backText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  content: { 
    paddingHorizontal: Spacing.xl,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    gap: Spacing.sm,  
  },
  title: { color: Colors.status.error, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.sm },
  warning: { color: Colors.dark.icon, fontSize: Typography.sizes.md, lineHeight: 22, marginBottom: Spacing.xl },
  label: { color: Colors.dark.text, fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, letterSpacing: 1, marginBottom: Spacing.xs },
  input: {
    height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    color: Colors.dark.text, fontSize: Typography.sizes.md, marginBottom: Spacing.sm,
  },
  errorText: { color: Colors.status.error, fontSize: Typography.sizes.xs, marginBottom: Spacing.md },
  deleteButton: {
    height: 48, borderRadius: Radius.md, backgroundColor: Colors.status.error,
    justifyContent: 'center', alignItems: 'center', marginTop: Spacing.md,
  },
  deleteText: { color: '#fff', fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
});