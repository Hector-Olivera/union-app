import { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStorePreview } from '@features/qr/hooks/useStorePreview';
import { StoreSectionRenderer } from '@features/store/components/StoreSectionRenderer';
import { THEME_OPTIONS } from '@stores/themeStore';
import { useAuthStore } from '@stores/authStore';
import { useStoreStore } from '@stores/storeStore';
import { Colors, Typography, Spacing } from '@constants/theme';
import { useProducts } from '@features/store/hooks/useProducts';
import { useCommunity } from '@features/community/hooks/useCommunity';
import { getOrCreateConversation } from '@services/firebase/messaging';
import { Ionicons } from '@expo/vector-icons';


// Vista pública de una tienda — lo que ve cualquier visitante.
// Renderiza las secciones visibles del layout configurado por el dueño,
// usando el tema de color propio de la tienda (no el del visitante).
export default function StoreViewScreen() {

  const insets = useSafeAreaInsets();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { store, loading } = useStorePreview(storeId || null);
  const { user } = useAuthStore();
  const { store: myStore } = useStoreStore();
  const { isFavorite, toggleFav, visitStore } = useCommunity();
  const { products } = useProducts(store?.id);

  useEffect(() => {
  if (store?.id) visitStore(store.id);
}, [store?.id]);

const handleBack = () => {
    // Si la tienda que estoy viendo es la mía, vuelvo al dashboard de Tienda
    // Si es de otro usuario, vuelvo a Explorar (donde se descubren tiendas)
    if (myStore && store && myStore.id === store.id) {
      router.push('/(app)/store');
    } else {
      router.push('/(app)/explore');
    }
  };

  const handleMessage = async () => {
    if (!user || !store) return;
    if (user.id === store.ownerId) return; // no te podés mensajear a vos mismo

    const conversationId = await getOrCreateConversation(
      user.id,
      { name: user.displayName, avatarUrl: user.avatarUrl },
      store.ownerId,
      { name: store.name, avatarUrl: store.logoUrl }
    );
    router.push(`/(app)/chat/${conversationId}` as any);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>Tienda no encontrada</Text>
        <Text style={styles.notFoundText}>
          El enlace puede estar roto o la tienda ya no existe.
        </Text>
      </View>
    );
  }
 
  const theme = THEME_OPTIONS.find(t => t.id === store.themeId) || THEME_OPTIONS[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header simple con botón volver */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFav(store.id)} style={styles.favButton}>
          <Text style={[styles.favIcon, { color: isFavorite(store.id) ? theme.secondary : Colors.dark.icon }]}>
            {isFavorite(store.id) ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        {user?.id !== store.ownerId && (
          <TouchableOpacity onPress={handleMessage} style={styles.messageButton}>
            <Ionicons name="chatbubble-outline" size={30} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StoreSectionRenderer store={store} products={products} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  notFoundText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  content: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  favButton: {
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.xxl,
  },
  favIcon: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  messageButton: {
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.sm,
  },
});