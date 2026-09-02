import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing } from '@constants/theme';

export type CommunityTab = 'community' | 'notifications' | 'messages';

type Props = {
  activeTab: CommunityTab;
  onSelectTab: (index: number) => void;
};

export const TABS: { key: CommunityTab; label: string }[] = [
  { key: 'community', label: 'Favoritos / visitadas' },
  { key: 'notifications', label: 'Novedades' },
  { key: 'messages', label: 'Mensajes' },
];

// Ahora este componente es solo la fila de etiquetas — el swipe
// real ocurre en el ScrollView horizontal que vive en explore.tsx,
// envolviendo el contenido visible de cada pestaña.
export const CommunityTabCarousel = ({ activeTab, onSelectTab }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.labelsRow}>
      {TABS.map((tab, index) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(index)}
            style={styles.labelButton}
          >
            <Text
              style={[styles.labelText, isActive && { color: colors.brand.primary, fontWeight: Typography.weights.bold }]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.brand.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  labelButton: { alignItems: 'center', gap: 4, flex: 1 },
  labelText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, textAlign: 'center' },
  activeIndicator: { width: 24, height: 2, borderRadius: 1 },
});