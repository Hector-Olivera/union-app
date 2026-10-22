import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '@stores/storeStore';
import { deleteAccount, hasPasswordProvider } from '@services/firebase/auth';
import { LEGAL } from '@constants/legal';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const { store } = useStoreStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const needsPassword = hasPasswordProvider();
  // En web no hay Google Sign-In: una cuenta de Google no se puede reautenticar ahí
  const canDeleteHere = needsPassword || Platform.OS !== 'web';

  const handleRequestDelete = () => {
    if (needsPassword && !password) {
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
      await deleteAccount(needsPassword ? password : undefined);
      // Al borrarse la cuenta, el observer de auth cierra la sesión y redirige solo
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('La contraseña es incorrecta');
      } else if (e.code === 'auth/user-mismatch') {
        setError('Elegí la misma cuenta de Google con la que iniciaste sesión.');
      } else if (e.code === 'SIGN_IN_CANCELLED' || e.message?.includes('cancel')) {
        setError(null); // cerró el selector de cuentas: no es un error
      } else {
        console.error('[DeleteAccount] error:', e);
        setError('No pudimos eliminar la cuenta. Intentá de nuevo.');
      }
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Eliminar cuenta</Text>
        <Text style={styles.warning}>
          Esta acción es irreversible. Se eliminarán tu perfil, tu tienda{store ? ` ("${store.name}")` : ''} y tus datos asociados.
          Tus conversaciones se conservan para las otras personas, que te van a ver como "Usuario eliminado".
        </Text>

        {canDeleteHere ? (
          <>
            {needsPassword ? (
              <>
                <Text style={styles.label}>CONFIRMÁ TU CONTRASEÑA</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={Colors.dark.icon}
                />
              </>
            ) : (
              <Text style={styles.warning}>
                Para confirmar vas a tener que elegir de nuevo tu cuenta de Google.
              </Text>
            )}

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.deleteButton} onPress={handleRequestDelete} disabled={loading}>
              <Text style={styles.deleteText}>{loading ? 'Eliminando...' : 'Eliminar mi cuenta'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.warning}>
            Tu cuenta usa Google. Para eliminarla, hacelo desde la app en tu teléfono o escribinos a {LEGAL.contactEmail}.
          </Text>
        )}

        <TouchableOpacity onPress={() => router.push('/data-deletion' as any)} style={styles.infoLink}>
          <Text style={styles.infoLinkText}>Ver cómo se eliminan los datos </Text>
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
  infoLink: { alignSelf: 'flex-start', marginTop: Spacing.xl },
  infoLinkText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, textDecorationLine: 'underline' },
});