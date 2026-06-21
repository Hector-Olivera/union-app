import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { AvatarPicker } from '@features/profile/components/AvatarPicker';
import { CURRENT_APP_CONFIG } from '@constants/appConfig';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useStoreStore } from '@stores/storeStore';
import type { Store } from '@/types/store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { activeTheme } = useThemeStore();
  const { store } = useStoreStore();

  if (!user) return null;

  // Saludo según la hora del día 
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Solo el primer nombre 
  const firstName = user.displayName.split(' ')[0];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={[styles.userName, { color: activeTheme.primary }]}>
            {firstName}
          </Text>
          <Text style={styles.tagline}>
            {CURRENT_APP_CONFIG.appTagline}
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
          <AvatarPicker
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
            size={56}
            // Sin onPress acá — el TouchableOpacity padre lo maneja
          />
        </TouchableOpacity>
      </View>

      {/* ── ACCIONES RÁPIDAS ── */}
      <SectionTitle title="Acciones rápidas" />
      <View style={styles.quickActionsGrid}>
        {CURRENT_APP_CONFIG.homeQuickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { borderColor: `${activeTheme.primary}30` }]}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.75}
          >
            {/* Indicador de color del módulo */}
            <View style={[styles.actionDot, { backgroundColor: activeTheme.primary }]} />
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── STORE CARD ── */}
      <SectionTitle title="Mi Tienda" />
      <StoreCard activeTheme={activeTheme} store={store}/>

      {/* ── ACTIVIDAD ── */}
      <SectionTitle title="Actividad reciente" />
      <ActivityPlaceholder activeTheme={activeTheme} />

    </ScrollView>
  );
}

// ── COMPONENTES AUXILIARES ──
// Definidos en el mismo archivo porque son específicos del Home.
// Si crecen o se reutilizan, se mueven a features/home/components/

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const StoreCard = ({ 
  activeTheme, store 
}: { 
  activeTheme: { primary: string; secondary: string; accent: string };
  store: Store | null;
 }) => {
   if (store) {
    return (
      <TouchableOpacity
        style={[styles.storeCard, { borderColor: `${activeTheme.primary}30` }]}
        onPress={() => router.push('/(app)/store')}
        activeOpacity={0.8}
      >
        <View style={styles.storeCardHeader}>
          <Text style={styles.storeCardTitle}>{store.name}</Text>
          <View style={[
            styles.storeCardBadge,
            { backgroundColor: `${activeTheme.primary}20`, borderColor: activeTheme.primary }
          ]}>
            <Text style={[styles.storeCardBadgeText, { color: activeTheme.primary }]}>
              {store.isPublic ? 'PÚBLICA' : 'PRIVADA'}
            </Text>
          </View>
        </View>
        <Text style={styles.storeCardDescription}>
          Gestioná tu tienda, tu QR y tus productos.
        </Text>
        <Text style={[styles.storeCardAction, { color: activeTheme.primary }]}>
          Ver mi tienda →
        </Text>
      </TouchableOpacity>
    );
  }
  return (
      <TouchableOpacity
    style={[styles.storeCard, { borderColor: `${activeTheme.secondary}30` }]}
    onPress={() => router.push('/(app)/store')}
    activeOpacity={0.8}
  >
    <View style={styles.storeCardHeader}>
      <Text style={styles.storeCardTitle}>Activá tu tienda</Text>
      <View style={[styles.storeCardBadge, { backgroundColor: `${activeTheme.secondary}20`, borderColor: activeTheme.secondary }]}>
        <Text style={[styles.storeCardBadgeText, { color: activeTheme.secondary }]}>
          NUEVO
        </Text>
      </View>
    </View>
    <Text style={styles.storeCardDescription}>
      Vendé productos, ofrecé servicios y generá tu QR personalizado dentro del ecosistema.
    </Text>
    <Text style={[styles.storeCardAction, { color: activeTheme.secondary }]}>
      Ir a tienda →
    </Text>
    {/* TODO: cuando hasStore === true, mostrar estadísticas y notificaciones */}
  </TouchableOpacity>
  )
 };

const ActivityPlaceholder = ({ activeTheme }: { activeTheme: { primary: string; secondary: string; accent: string } }) => (
  <View style={[styles.activityCard, { borderColor: `${activeTheme.accent}20` }]}>
    <View style={[styles.activityDot, { backgroundColor: `${activeTheme.accent}40` }]} />
    <View style={styles.activityText}>
      <Text style={styles.activityTitle}>Sin actividad reciente</Text>
      <Text style={styles.activitySub}>
        Acá aparecerán pedidos, mensajes y novedades del ecosistema.
      </Text>
    </View>
  </View>
  // TODO: cuando tengamos mensajería y tienda activa,
  // este componente se reemplaza por un FlatList con actividad real
);

// ── ESTILOS ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xl,
  },
  headerText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
  },
  userName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  tagline: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },

  // Secciones
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },

  // Quick actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickActionCard: {
    // Dos columnas: cada card ocupa ~48% del ancho disponible
    flexBasis: '48%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  actionDescription: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    lineHeight: 16,
  },

  // Store card
  storeCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeCardTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  storeCardBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  storeCardBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  storeCardDescription: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  storeCardAction: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },

  // Activity
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  activityDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  activitySub: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
});