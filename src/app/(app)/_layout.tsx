import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useThemeStore } from '@stores/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const { activeTheme } = useThemeStore();
  // useThemeStore re-renderiza el layout cuando cambia el tema
  // Así la tab bar reactiva al color elegido por el usuario

  return (
    <View style={styles.wrapper}>
       <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.dark.surface,
              borderTopColor: `${activeTheme.primary}4D`,
              borderTopWidth: 1,
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: Spacing.sm,
              padding: 0,
              elevation: 0,
            },
            tabBarActiveTintColor: activeTheme.primary,
            tabBarInactiveTintColor: Colors.dark.icon,
            tabBarShowLabel: false,              
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home-outline" />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explorar',
              tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="compass-outline" />,
            }}
          />
          <Tabs.Screen
            name="camera"
            options={{
              title: 'Cámara',
              tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="qr-code-outline" color="secondary" />
            }}
          />
          <Tabs.Screen
            name="store"
            options={{
              title: 'Tienda',
              tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="storefront-outline" />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person-circle-outline" />,
            }}
          />
          <Tabs.Screen
            name="qrgenerator"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="store-view/[storeId]"
            options={{ href: null }}
          />
          <Tabs.Screen name="edit-profile" options={{ href: null }} />
          <Tabs.Screen name="change-password" options={{ href: null }} />
        </Tabs>
    </View>
  );
}

const TabIcon = ({ focused, name, color = 'primary' }: {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  color?: 'primary' | 'secondary';
}) => {
  const { activeTheme } = useThemeStore();
  const activeColor = color === 'secondary'
    ? activeTheme.secondary
    : activeTheme.primary;

  return (
    <Ionicons
      name={name}
      size={28}
      color={focused ? activeColor : Colors.dark.icon}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  inner: {
    flex: 1,
    width: '100%',
  },
  iconContainer: {
    width: 36,
    height: 28,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.icon,
  },
});