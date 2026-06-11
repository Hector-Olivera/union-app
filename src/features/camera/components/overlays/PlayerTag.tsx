import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  name: string;
  level?: number;
  // level es opcional — no todos los módulos de la plataforma lo usan
  position?: { x: number; y: number };
  // position permite anclar el tag a coordenadas específicas de pantalla.
  // Cuando integremos detección de personas, recibirá las coordenadas
  // del bounding box del modelo de visión computacional.
};

// Tag flotante que se muestra sobre un jugador detectado.
// Por ahora se posiciona manualmente — en la Capa 3 lo anclaremos
// a personas reales detectadas por la cámara.
export const PlayerTag = ({ name, level, position }: Props) => {
  const positionStyle = position
    ? { position: 'absolute' as const, left: position.x, top: position.y }
    : {};
  // Si recibe position, se ancla en coordenadas absolutas.
  // Si no, se renderiza en el flujo normal del contenedor padre.

  return (
    <View style={[styles.container, positionStyle]} pointerEvents="none">

      {/* Línea vertical que conecta el tag con el jugador */}
      <View style={styles.connector} />

      {/* Card del tag */}
      <View style={styles.tag}>
        <Text style={styles.name}>{name}</Text>
        {level !== undefined && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Nv.{level}</Text>
          </View>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.85)',
    borderWidth: 1,
    borderColor: Colors.brand.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    // gap es spacing entre hijos — disponible en RN 0.71+
  },
  name: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.5,
  },
  levelBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  levelText: {
    color: '#fff',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  connector: {
    width: 1,
    height: 20,
    backgroundColor: Colors.brand.primary,
    opacity: 0.6,
    marginBottom: 2,
  },
});