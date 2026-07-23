import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  primaryColor: string;
  images?: string[];
};

export const CarouselSection = ({ primaryColor, images = [] }: Props) => {
  if (images.length === 0) return null;
  // Sin imágenes, la sección no ocupa espacio — mejor que placeholders vacíos

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {images.map((url, i) => (
          <Image key={i} source={{ uri: url }} style={styles.slide} resizeMode="cover" />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  scroll: { gap: Spacing.sm },
  slide: {
    width: 220,
    height: 130,
    borderRadius: Radius.lg,
  },
});


/*import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  primaryColor: string;
};

// Carrusel de imágenes: placeholder horizontal scrolleable.
// Cuando exista subida de imágenes (Firebase Storage), cada card
// renderiza la imagen real en lugar del bloque de color.
export const CarouselSection = ({ primaryColor }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galería</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.slide, { backgroundColor: `${primaryColor}15` }]}
          >
            <Text style={[styles.slideText, { color: primaryColor }]}>
              Imagen {i}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  scroll: {
    gap: Spacing.sm,
  },
  slide: {
    width: 200,
    height: 130,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});*/