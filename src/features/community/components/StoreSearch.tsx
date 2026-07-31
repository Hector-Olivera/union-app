import { useState, useEffect } from 'react';
import { View, TextInput, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StoreListItem } from './StoreListItem';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { StoreSummary } from '@/types/community';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onSearch: (query: string) => Promise<StoreSummary[]>;
  onVisitStore: (storeId: string) => void;
};

export const StoreSearch = ({ onSearch, onVisitStore }: Props) => {
  const { colors } = useAppTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce: esperamos 400ms sin cambios antes de buscar,
    // evita disparar una consulta a Firestore en cada letra tipeada
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const found = await onSearch(query);
      setResults(found);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={styles.container}>

      <View style={[styles.inputWrapper, { borderColor: `${colors.brand.primary}30` }]}>
        <Ionicons name="search" size={18} color={Colors.dark.icon} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar tiendas..."
          placeholderTextColor={Colors.dark.icon}
        />
      </View>

      {loading && <ActivityIndicator style={styles.loader} color={colors.brand.primary} size="small" />}

      {!loading && query.trim().length > 0 && results.length === 0 && (
        <Text style={styles.emptyText}>No encontramos tiendas con ese nombre.</Text>
      )}

      {results.map((store) => (
        <StoreListItem
          key={store.id}
          store={store}
          onPress={() => onVisitStore(store.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  height: 48,
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderWidth: 1,
  borderRadius: Radius.md,
  paddingHorizontal: Spacing.md,
  gap: Spacing.sm,
  marginBottom: Spacing.md,
  },
  searchIcon: {},
  input: {
    flex: 1,
    height: '100%',
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  loader: { marginVertical: Spacing.md },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
});