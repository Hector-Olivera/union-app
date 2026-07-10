import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@hooks/useAppTheme';
import { useProfile } from '@features/profile/hooks/useProfile';
import { AvatarPicker } from '@features/profile/components/AvatarPicker';
import { ThemePicker } from '@features/profile/components/ThemePicker';
import { StoreActivation } from '@features/profile/components/StoreActivation';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { useAuthStore } from '@stores/authStore';
import { Typography, Spacing, Radius, Colors } from '@constants/theme';
import { EmailVerificationBanner } from '@features/profile/components/EmailVerificationBanner';
import { router } from 'expo-router';
import { useStoreStore } from '@stores/storeStore';


export default function ProfileScreen() {
  const { store } = useStoreStore();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { signOut } = useAuthStore();
  const {
    user, saving, error,
    selectedThemeId,
    updateDisplayName,
    activateStore,
    changeTheme,
  } = useProfile();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  // editingName controla si mostramos el TextInput o el texto estático
  // Patrón inline edit — más fluido que navegar a otra pantalla

  const handleSaveName = async () => {
    await updateDisplayName(nameInput);
    setEditingName(false);
  };


 const handleSignOut = () => {
  setShowSignOutDialog(true);
};

  if (!user) return null;

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header del perfil */}
          <View style={styles.header}>
            <AvatarPicker
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              size={90}
            />

            <View style={styles.userInfo}>
                <TouchableOpacity>
                  <Text style={styles.displayName}>{user.displayName}</Text>
                </TouchableOpacity>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>

          <EmailVerificationBanner />

          {/* Error global */}
          {!!error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Separador con label */}
          <SectionLabel label="PERSONALIZACIÓN" color={colors.brand.primary} />

          {/* Selector de tema */}
          <ThemePicker
            selectedThemeId={selectedThemeId}
            onSelect={changeTheme}
          />

          <SectionLabel label="MI TIENDA" color={colors.brand.secondary} />

          {/* Activación de tienda */}
          <StoreActivation
            hasStore={!!store}           
            onActivate={activateStore}
            saving={saving}
          />

          <SectionLabel label="CUENTA" color={Colors.dark.icon} />

          {/* Opciones de cuenta */}
          <View style={styles.accountSection}>
            <TouchableOpacity style={styles.accountRow} onPress={() => router.push('/(app)/edit-profile')}>
              <Text style={styles.accountRowText}>Editar perfil  </Text>
              <Text style={styles.accountRowArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.accountRow} onPress={() => router.push('/(app)/change-password')}>
              <Text style={styles.accountRowText}>Cambiar contraseña </Text>
              <Text style={styles.accountRowArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Cerrar sesión */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Cerrar sesión</Text>
          </TouchableOpacity>

          {/* Versión de la app */}
          <Text style={styles.version}>Union App v0.3.0</Text>

          <ConfirmDialog
            visible={showSignOutDialog}
            title="Cerrar sesión"
            message="¿Estás seguro que querés cerrar sesión?"
            confirmLabel="Cerrar sesión"
            cancelLabel="Cancelar"
            destructive
            onConfirm={() => {
              setShowSignOutDialog(false);
              signOut();
            }}
            onCancel={() => setShowSignOutDialog(false)}
          />

        </ScrollView>
    </View>
  );
}

// Componente auxiliar para los labels de sección
const SectionLabel = ({ label, color }: { label: string; color: string }) => (
  <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
    flex: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  editHint: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  email: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
  },
  nameEditContainer: {
    gap: Spacing.xs,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontSize: Typography.sizes.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  nameEditActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  nameActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameActionText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  errorBanner: {
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderWidth: 1,
    borderColor: Colors.status.error,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.sm,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  accountSection: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  accountRowText: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  accountRowArrow: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xl,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: Spacing.lg,
  },
  signOutButton: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,82,82,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  signOutText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  version: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
    opacity: 0.5,
  },
});