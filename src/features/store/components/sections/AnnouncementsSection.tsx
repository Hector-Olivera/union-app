import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Announcement } from '@/types/store';

type Props = {
  announcements?: Announcement[];
  primaryColor: string;
};

const formatRelativeTime = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (hours < 1) return 'hace un momento';
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${days} d`;
};

// Vista pública de novedades — solo lectura, sin controles de edición
export const AnnouncementsSection = ({ announcements = [], primaryColor }: Props) => {
  if (announcements.length === 0) return null;
  // Si no hay novedades, la sección directamente no ocupa espacio en la tienda pública

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novedades</Text>
      {announcements.slice(0, 5).map((item) => (
        // Mostramos máximo 5 en la vista pública — evita una tienda
        // interminable si el dueño publicó muchas novedades viejas
        <View key={item.id} style={[styles.card, { borderLeftColor: primaryColor }]}>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderLeftWidth: 3,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  text: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
  },
});