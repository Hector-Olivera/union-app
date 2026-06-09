import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

// Ícono simple con texto — sin dependencias externas por ahora.
// Cuando integremos una librería de íconos, se reemplaza solo este componente.
type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
};

const TabIcon = ({ emoji, label, focused }: TabIconProps) => (
  <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
    <View style={styles.emojiWrapper}>
      <View style={[styles.emojiContainer, focused && styles.emojiContainerFocused]}>
        <View>
          {/* Emoji como placeholder — reemplazable por SVG o librería */}
        </View>
      </View>
    </View>
  </View>
);

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  // useSafeAreaInsets da el espacio del notch y la barra de navegación
  // del dispositivo. Sin esto la tab bar queda tapada en iPhones y
  // algunos Android con gestos de navegación.

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: 'rgba(108,99,255,0.3)',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: Spacing.sm,
          elevation: 0,
          // elevation: 0 elimina la sombra de Android que se ve rara en dark theme
        },
        tabBarActiveTintColor: Colors.brand.primary,
        tabBarInactiveTintColor: Colors.dark.icon,
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontWeight: Typography.weights.medium,
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIconSimple emoji="⬡" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ focused }) => (
            <TabIconSimple emoji="◎" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Cámara',
          tabBarIcon: ({ focused }) => (
            <TabIconSimple emoji="⊕" focused={focused} color="secondary" />
          ),
          // La cámara es la acción principal de la plataforma
          // Por eso tiene color secundario — se destaca visualmente
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Tienda',
          tabBarIcon: ({ focused }) => (
            <TabIconSimple emoji="◈" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIconSimple emoji="◉" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// Componente simplificado — más limpio que el anterior
type SimpleIconProps = {
  emoji: string;
  focused: boolean;
  color?: 'primary' | 'secondary';
};

const TabIconSimple = ({ emoji, focused, color = 'primary' }: SimpleIconProps) => {
  const activeColor = color === 'secondary' ? Colors.brand.secondary : Colors.brand.primary;
  return (
    <View style={[
      styles.iconContainer,
      focused && { backgroundColor: `${activeColor}20` },
      // El "20" al final del hex es la opacidad en hexadecimal (12.5%)
      // Genera un glow sutil detrás del ícono activo
    ]}>
      <View style={[styles.dot, focused && { backgroundColor: activeColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabIcon: { alignItems: 'center', justifyContent: 'center' },
  tabIconFocused: {},
  emojiWrapper: {},
  emojiContainer: { padding: 4 },
  emojiContainerFocused: {},
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