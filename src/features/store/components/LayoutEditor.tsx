import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { StoreSection } from '@/types/store';
import { SECTION_LABELS } from '@/types/store';

type Props = {
  layout: StoreSection[];
  onUpdate: (layout: StoreSection[]) => void;
};

// Editor de secciones de la tienda.
// El usuario puede: mostrar/ocultar cada sección con un toggle,
// y cambiar el orden con botones arriba/abajo.
// Las secciones ocultas no aparecen en la vista pública de la tienda.
export const LayoutEditor = ({ layout, onUpdate }: Props) => {
  const { colors } = useAppTheme();

  // Ordenamos por el campo 'order' para mostrar en el orden correcto
  const sorted = [...layout].sort((a, b) => a.order - b.order);

  const toggleVisibility = (sectionId: string) => {
    const updated = layout.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    onUpdate(updated);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sorted = [...layout].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(s => s.id === sectionId);

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Intercambiamos los valores de order entre las dos secciones
    const newLayout = layout.map(s => {
      if (s.id === sorted[index].id) return { ...s, order: sorted[swapIndex].order };
      if (s.id === sorted[swapIndex].id) return { ...s, order: sorted[index].order };
      return s;
    });

    onUpdate(newLayout);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secciones de la tienda</Text>
      <Text style={styles.subtitle}>
        Activá, desactivá y ordená las secciones de tu tienda.
      </Text>

      {sorted.map((section, index) => (
        <View
          key={section.id}
          style={[
            styles.sectionRow,
            { borderColor: section.visible ? `${colors.brand.primary}40` : 'rgba(255,255,255,0.06)' }
          ]}
        >
          {/* Indicador de visibilidad */}
          <View style={[
            styles.visibilityDot,
            { backgroundColor: section.visible ? colors.brand.primary : Colors.dark.icon }
          ]} />

          {/* Nombre de la sección */}
          <Text style={[
            styles.sectionName,
            !section.visible && styles.sectionNameHidden
          ]}>
            {SECTION_LABELS[section.type]}
          </Text>

          {/* Controles */}
          <View style={styles.controls}>
            {/* Mover arriba */}
            <TouchableOpacity
              onPress={() => moveSection(section.id, 'up')}
              disabled={index === 0}
              style={[styles.moveBtn, index === 0 && styles.moveBtnDisabled]}
            >
              <Text style={styles.moveBtnText}>↑</Text>
            </TouchableOpacity>

            {/* Mover abajo */}
            <TouchableOpacity
              onPress={() => moveSection(section.id, 'down')}
              disabled={index === sorted.length - 1}
              style={[styles.moveBtn, index === sorted.length - 1 && styles.moveBtnDisabled]}
            >
              <Text style={styles.moveBtnText}>↓</Text>
            </TouchableOpacity>

            {/* Toggle visibilidad */}
            <TouchableOpacity
              onPress={() => toggleVisibility(section.id)}
              style={[
                styles.toggleBtn,
                { backgroundColor: section.visible ? colors.brand.primary : 'rgba(255,255,255,0.08)' }
              ]}
            >
              <Text style={styles.toggleText}>
                {section.visible ? 'Visible' : 'Oculto'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  visibilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionName: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  sectionNameHidden: {
    color: Colors.dark.icon,
    opacity: 0.5,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  moveBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveBtnDisabled: {
    opacity: 0.3,
  },
  moveBtnText: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
});