import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Announcement } from '@/types/store';

type Props = {
  announcements: Announcement[] | undefined;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
};

// Formatea una fecha ISO a texto relativo simple ("hace 5 min", "hace 2 días")
const formatRelativeTime = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'ahora mismo';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${days} d`;
};

export const AnnouncementsFeed = ({ announcements = [], onAdd, onDelete }: Props) => {
  const { colors } = useAppTheme();
  const [input, setInput] = useState('');

  const handlePublish = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novedades</Text>
      <Text style={styles.subtitle}>
        Publicá avisos que verán quienes visiten tu tienda.
      </Text>

      <TextInput
        style={styles.textArea}
        value={input}
        onChangeText={setInput}
        placeholder="Ej: Este fin de semana 20% de descuento..."
        placeholderTextColor={Colors.dark.icon}
        multiline
        maxLength={200}
      />
      <TouchableOpacity
        style={[
          styles.publishButton,
          { backgroundColor: input.trim() ? colors.brand.primary : 'rgba(255,255,255,0.08)' }
        ]}
        onPress={handlePublish}
        disabled={!input.trim()}
      >
        <Text style={[
          styles.publishText,
          { color: input.trim() ? '#fff' : Colors.dark.icon }
        ]}>
          Publicar
        </Text>
      </TouchableOpacity>

      {announcements.length === 0 ? (
        <Text style={styles.emptyText}>Todavía no publicaste novedades.</Text>
      ) : (
        announcements.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTime}>{formatRelativeTime(item.createdAt)}</Text>
              <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{item.text}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  textArea: {
    minHeight: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    textAlignVertical: 'top',
    marginBottom: Spacing.sm,
  },
  publishButton: {
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  publishText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cardTime: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
  },
  deleteText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  cardText: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
});