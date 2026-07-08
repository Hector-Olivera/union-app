import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export type DashboardTab = 'manage' | 'products' | 'edit' ;

type Props = {
  activeTab: DashboardTab;
  onChange: (tab: DashboardTab) => void;
};

const TAB_LABELS: Record<DashboardTab, string> = {
  manage: 'Gestión',
  products: 'Productos',
  edit: 'Edición',
};

export const StoreTabSelector = ({ activeTab, onChange }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {(['manage', 'products', 'edit'] as DashboardTab[]).map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              isActive && { backgroundColor: colors.brand.primary }
            ]}
            onPress={() => onChange(tab)}
          >
            <Text style={[
              styles.tabText,
              { color: isActive ? '#fff' : Colors.dark.icon }
            ]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});