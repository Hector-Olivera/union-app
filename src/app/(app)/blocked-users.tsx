import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBlockStore } from '@stores/blockStore';
import { AvatarPicker } from '@features/profile/components/AvatarPicker';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function BlockedUsersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const blocked = useBlockStore(s => s.blocked);
  const unblock = useBlockStore(s => s.unblock);

  const handleUnblock = async (blockedId: string) => {
    try {
      await unblock(blockedId);
    } catch (e) {
      console.error('[BlockedUsers] unblock error:', e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.brand.primary }]}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Usuarios bloqueados</Text>
        <Text style={styles.subtitle}>
          Las personas bloqueadas no pueden enviarte mensajes y su conversación y su tienda se ocultan.
        </Text>

        <FlatList
          data={blocked}
          keyExtractor={(item) => item.blockedId}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bloqueaste a nadie.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <AvatarPicker displayName={item.blockedName} avatarUrl={item.blockedAvatarUrl} size={44} />
              <Text style={styles.name} numberOfLines={1}>{item.blockedName}</Text>
              <TouchableOpacity
                style={[styles.unblockButton, { borderColor: colors.brand.primary }]}
                onPress={() => handleUnblock(item.blockedId)}
              >
                <Text style={[styles.unblockText, { color: colors.brand.primary }]}>Desbloquear</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  inner: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: Spacing.xl },
  backButton: { paddingTop: Spacing.xl, paddingBottom: Spacing.sm, alignSelf: 'flex-start' },
  backText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  title: { color: Colors.dark.text, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.xs },
  subtitle: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, lineHeight: 20, marginBottom: Spacing.xl },
  emptyText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, fontStyle: 'italic', textAlign: 'center', marginTop: Spacing.xl },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  name: { flex: 1, color: Colors.dark.text, fontSize: Typography.sizes.md },
  unblockButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.md, borderWidth: 1 },
  unblockText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});