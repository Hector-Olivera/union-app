import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStorePreview } from '@features/qr/hooks/useStorePreview';
import { Colors, Typography, Spacing } from '@constants/theme';

// Vista pública de una tienda ajena, navegable por ID.
// Placeholder hasta construir feature/store-public-view completa
// con catálogo, banner y el resto de las secciones configurables.
export default function StoreViewScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { store, loading } = useStorePreview(storeId || null);

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
        <Text style={styles.text}>Tienda no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>{store.name}</Text>
      <Text style={styles.text}>
        Vista pública completa — próximamente
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  text: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
  },
});