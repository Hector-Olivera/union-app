import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { pruneExpiredAnnouncementsIfOwner } from '@services/firebase/store';
import { useAuthStore } from '@stores/authStore'; 
import { useStoreStore } from '@stores/storeStore';
import { router } from 'expo-router';
import { ThemePicker } from '@features/profile/components/ThemePicker';
import { LayoutEditor } from './LayoutEditor';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { StoreLivePreview } from './StoreLivePreview';
import { PreviewScrollButton } from './PreviewScrollButton';
import { StoreTabSelector, type DashboardTab } from './StoreTabSelector';
import { BusinessHoursEditor } from './management/BusinessHoursEditor';
import { TodoList } from './management/TodoList';
import { AnnouncementsFeed } from './management/AnnouncementsFeed';
import { ImagePickerField } from './ImagePickerField';
import { useProducts } from '@features/store/hooks/useProducts';
import { ProductCatalogEditor } from './management/ProductCatalogEditor';
import { CarouselEditor } from './management/CarouselEditor';
import { AboutContactEditor } from './management/AboutContactEditor';
import type { Store, StoreSectionType } from '@/types/store';
import { SplitScreenLayout } from '@/components/ui/SplitScreenLayout';


type Props = {
  store: Store;
  onUpdateLayout: (layout: any) => void;
  onUpdateTheme: (themeId: string) => void;
};

export const StoreDashboard = ({ store, onUpdateLayout, onUpdateTheme }: Props) => {
  const [editingSectionType, setEditingSectionType] = useState<StoreSectionType | null>(null);
  const { updateCarouselImages, updateContact, updateStoreDescription } = useStoreStore();
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<DashboardTab>('manage');
  const {
      updateStoreName, updateHours, addTodo, toggleTodo, deleteTodo,
      addAnnouncement, deleteAnnouncement, updateLogoUrl, updateBannerUrl, updateIsPublic,
    } = useStoreStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(store.name);
  const [nameError, setNameError] = useState<string | null>(null);

  const { products, loading: productsLoading, add, edit, remove } = useProducts(store.id);

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

  const { user } = useAuthStore();

  useEffect(() => {
    if (store && user) {
      pruneExpiredAnnouncementsIfOwner(store, user.id);
    }
  }, [store?.announcements?.length]);

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

          <TouchableOpacity
            onPress={() => updateIsPublic(!store.isPublic)}
            style={[
              styles.statusBadge,
              { backgroundColor: store.isPublic ? `${colors.brand.accent}20` : 'rgba(255,255,255,0.06)' }
            ]}
          >
            <Text style={[
              styles.statusText,
              { color: store.isPublic ? colors.brand.accent : Colors.dark.icon }
            ]}>
              {store.isPublic ? '● Pública — toca para ocultar' : '○ Privada — toca para publicar'}
            </Text>
          </TouchableOpacity>
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

    {activeTab === 'manage' ? (
      renderManagementContent()
    ) : activeTab === 'products' ? (
        <ProductCatalogEditor
          products={products}
          loading={productsLoading}
          onAdd={add}
          onEdit={edit}
          onRemove={remove}
        />
      ) : (
    <>
      <ThemePicker
        selectedThemeId={store.themeId}
        onSelect={onUpdateTheme}
      />

      <View style={styles.divider} />

      <LayoutEditor
        layout={store.layout}
        onUpdate={onUpdateLayout}
        editableTypes={['logo', 'banner', 'carousel', 'about', 'contact']}
        onEditSection={(type) => setEditingSectionType(type)}
      />

      <View style={styles.divider} />
    </>
    )}

    <Modal
        visible={editingSectionType !== null}
        transparent
        animationType={useSplitLayout ? 'fade' : 'slide'}
        onRequestClose={() => setEditingSectionType(null)}
      >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.modalBackdrop, useSplitLayout && styles.backdropWeb]}>
          <View style={[styles.modalSheet, useSplitLayout && styles.sheetWeb]}>
            <TouchableOpacity onPress={() => setEditingSectionType(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕ Cerrar </Text>
            </TouchableOpacity>

            {editingSectionType === 'logo' && (
              <ImagePickerField
                currentUrl={store.logoUrl}
                onUploaded={updateLogoUrl}
                aspectRatio={[1, 1]}
                label="LOGO DE LA TIENDA"
                folder="union-app/logos"
                height={100}
                placeholderIcon="🏪"
              />
            )}

            {editingSectionType === 'banner' && (
              <ImagePickerField
                currentUrl={store.bannerUrl}
                onUploaded={updateBannerUrl}
                aspectRatio={[16, 9]}
                label="BANNER"
                folder="union-app/banners"
                height={useSplitLayout ? 140 : 90}
                placeholderIcon="🖼"
              />
            )}

            {editingSectionType === 'carousel' && (
              <CarouselEditor
                images={store.carouselImages}
                onUpdate={updateCarouselImages}
              />
            )}

            {(editingSectionType === 'about' || editingSectionType === 'contact') && (
              <AboutContactEditor
                store={store}
                onUpdateDescription={updateStoreDescription}
                onUpdateContact={updateContact}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>
  );

  


 if (useSplitLayout) {
  return (
    <SplitScreenLayout
      left={renderEditorContent()}
      right={<StoreLivePreview store={store} products={products} />}
      leftRatio={0.3}
    />
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
          <StoreLivePreview store={store} products={products}/>
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
    padding: Spacing.sm,
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
  previewSectionTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxHeight: '99%',
  },
  backdropWeb: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  sheetWeb: {
    borderRadius: Radius.lg,
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
  },
  modalCloseText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});