import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { useStoreStore } from '@stores/storeStore';
import { router } from 'expo-router';
import { ThemePicker } from '@features/profile/components/ThemePicker';
import { LayoutEditor } from './LayoutEditor';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useRef } from 'react';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { StoreLivePreview } from './StoreLivePreview';
import { PreviewScrollButton } from './PreviewScrollButton';
import { StoreTabSelector, type DashboardTab } from './StoreTabSelector';
import { BusinessHoursEditor } from './management/BusinessHoursEditor';
import { TodoList } from './management/TodoList';
import { AnnouncementsFeed } from './management/AnnouncementsFeed';
import type { Store } from '@/types/store';


type Props = {
  store: Store;
  onUpdateLayout: (layout: any) => void;
  onUpdateTheme: (themeId: string) => void;
};

export const StoreDashboard = ({ store, onUpdateLayout, onUpdateTheme }: Props) => {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<DashboardTab>('edit');
  const {
      updateStoreName, updateHours, addTodo, toggleTodo, deleteTodo,
      addAnnouncement, deleteAnnouncement,
    } = useStoreStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(store.name);
  const [nameError, setNameError] = useState<string | null>(null);

  const { useSplitLayout } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView>(null);
  const previewYRef = useRef(0);

  const scrollToPreview = () => {
    scrollRef.current?.scrollTo({ y: previewYRef.current, animated: true });
  };

  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    // Si estamos a menos de 100px del final del scroll, mostramos "volver arriba"
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;
    setShowBackToTop(isNearBottom);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

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

  const renderManagementContent = () => (
  <>
    <BusinessHoursEditor
      hours={store.businessHours}
      onUpdate={updateHours}
    />
    <View style={styles.divider} />
    <TodoList
      todos={store.todos}
      onAdd={addTodo}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
    <View style={styles.divider} />
    <AnnouncementsFeed
      announcements={store.announcements}
      onAdd={addAnnouncement}
      onDelete={deleteAnnouncement}
    />
  </>
);

  const renderEditorContent = () => (
  <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {editingName ? (
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
            Mi Tienda
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <StoreTabSelector activeTab={activeTab} onChange={setActiveTab} />

      <View style={styles.divider} />

    {activeTab === 'edit' ? (
    <>

      <ThemePicker
        selectedThemeId={store.themeId}
        onSelect={onUpdateTheme}
      />

      <View style={styles.divider} />

      <LayoutEditor
        layout={store.layout}
        onUpdate={onUpdateLayout}
      />
    </>
      ) : (
      renderManagementContent()
    )}
  </>
  );



 if (useSplitLayout) {
  // Layout dividido para web ancha: controles | preview fija
  return (
    <View style={styles.splitContainer}>
      <ScrollView
        style={styles.splitLeft}
        contentContainerStyle={styles.splitLeftContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Todo el contenido de edición: header, nombre, acciones, tema, layout */}
        {renderEditorContent()}
      </ScrollView>

      <View style={styles.splitRight}>
        <StoreLivePreview store={store} />
      </View>
    </View>
  );
}

// Layout apilado para mobile: todo en columna + botón flotante
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderEditorContent()}

        {/* La preview vive al final del scroll en mobile */}
        <View
          onLayout={(e) => { previewYRef.current = e.nativeEvent.layout.y; }}
          // onLayout mide automáticamente la posición Y de este View
          // apenas se renderiza — sin esto no sabríamos a dónde scrollear
        >
          <Text style={styles.previewSectionTitle}>Vista previa</Text>
          <StoreLivePreview store={store} />
        </View>
      </ScrollView>

      <PreviewScrollButton 
        onPress={showBackToTop ? scrollToTop : scrollToPreview}
        mode={showBackToTop ? 'up' : 'down'}
       />
      
    </View>
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
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  splitLeft: {
    flex: 1.4,
    paddingRight: Spacing.lg,
  },
  splitLeftContent: {
    padding: Spacing.xl,
  },
  splitRight: {
    flex: 1,
    padding: Spacing.xl,
    alignSelf: 'center',
  },
  previewSectionTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
});