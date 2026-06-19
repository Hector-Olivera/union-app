import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useThemeStore } from '@stores/themeStore';

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
              elevation: 0,
            },
            tabBarActiveTintColor: activeTheme.primary,
            tabBarInactiveTintColor: Colors.dark.icon,
            tabBarLabelStyle: {
              fontSize: Typography.sizes.xs,
              fontWeight: Typography.weights.medium,
              marginTop: 2,
            },
            tabBarShowLabel: true,
              // El contenido de cada tab se limita en ancho desde cada screen
              // La tab bar ocupa el 100% del ancho siempre
              sceneStyle: Platform.OS === 'web' ? {
                maxWidth: 480,
                alignSelf: 'center',
                width: '100%',
              } : {},
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ focused }) => (
                <TabDot focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explorar',
              tabBarIcon: ({ focused }) => (
                <TabDot focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="camera"
            options={{
              title: 'Cámara',
              tabBarIcon: ({ focused }) => (
                <TabDot focused={focused} color="secondary" />
              ),
            }}
          />
          <Tabs.Screen
            name="store"
            options={{
              title: 'Tienda',
              tabBarIcon: ({ focused }) => (
                <TabDot focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ focused }) => (
                <TabDot focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="qrgenerator"
            options={{
              // href: null oculta esta ruta de la tab bar
              // pero sigue siendo navegable con router.push()
              href: null,
            }}
          />
        </Tabs>
    </View>
  );
}

// TabDot lee del themeStore directamente para ser reactivo
const TabDot = ({ focused, color = 'primary' }: {
  focused: boolean;
  color?: 'primary' | 'secondary';
}) => {
  const { activeTheme } = useThemeStore();
  const activeColor = color === 'secondary'
    ? activeTheme.secondary
    : activeTheme.primary;

  return (
    <View style={[
      styles.iconContainer,
      focused && { backgroundColor: `${activeColor}20` },
    ]}>
      <View style={[
        styles.dot,
        focused && { backgroundColor: activeColor },
      ]} />
    </View>
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