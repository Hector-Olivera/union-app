import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { useStoreStore } from '@stores/storeStore';
import { router } from 'expo-router';
import { ThemePicker } from '@features/profile/components/ThemePicker';
import { LayoutEditor } from './LayoutEditor';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Store } from '@/types/store';

type Props = {
  store: Store;
  onUpdateLayout: (layout: any) => void;
  onUpdateTheme: (themeId: string) => void;
};

export const StoreDashboard = ({ store, onUpdateLayout, onUpdateTheme }: Props) => {
  const { colors } = useAppTheme();
  const { updateStoreName } = useStoreStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(store.name);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setNameError('Mínimo 2 caracteres');
      return;
    }
    if (trimmed.length > 40) {
      setNameError('Máximo 40 caracteres');
      return;
    }
    setNameError(null);
    await updateStoreName(trimmed);
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setNameInput(store.name);
    setNameError(null);
    setEditingName(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header de la tienda */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>

          {editingName ? (
            // Modo edición inline — mismo patrón que el nombre de usuario en perfil
            <View style={styles.nameEditContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  { borderColor: nameError ? Colors.status.error : colors.brand.primary }
                ]}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                maxLength={40}
                onSubmitEditing={handleSaveName}
              />
              {!!nameError && <Text style={styles.nameErrorText}>{nameError}</Text>}
              <View style={styles.nameEditActions}>
                <TouchableOpacity
                  onPress={handleSaveName}
                  style={[styles.nameActionBtn, { backgroundColor: colors.brand.primary }]}
                >
                  <Text style={styles.nameActionText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  style={[styles.nameActionBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                >
                  <Text style={styles.nameActionText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)} activeOpacity={0.7}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.editHint}>Toca para editar</Text>
            </TouchableOpacity>
          )}

          <View style={[
            styles.statusBadge,
            { backgroundColor: store.isPublic ? `${colors.brand.accent}20` : 'rgba(255,255,255,0.06)' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: store.isPublic ? colors.brand.accent : Colors.dark.icon }
            ]}>
              {store.isPublic ? '● Pública' : '○ Privada'}
            </Text>
          </View>
        </View>
      </View>

      {/* Acciones de navegación: QR y Vista pública */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.brand.primary }]}
          onPress={() => router.push('/(app)/qrgenerator')}
        >
          <Text style={[styles.actionButtonText, { color: colors.brand.primary }]}>
            Ver QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.brand.secondary }]}
          onPress={() => router.push(`/(app)/store-view/${store.id}`)}
        >
          <Text style={[styles.actionButtonText, { color: colors.brand.secondary }]}>
            Ver Tienda
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ThemePicker
        selectedThemeId={store.themeId}
        onSelect={onUpdateTheme}
      />

      <View style={styles.divider} />

      <LayoutEditor
        layout={store.layout}
        onUpdate={onUpdateLayout}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.md,
  },
  headerLeft: {
    gap: Spacing.sm,
  },
  storeName: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  editHint: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  nameEditContainer: {
    gap: Spacing.xs,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  nameErrorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: Spacing.lg,
  },
});