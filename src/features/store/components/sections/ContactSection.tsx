import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  primaryColor: string;
};

// Placeholder hasta tener campos reales de contacto en el modelo Store
export const ContactSection = ({ primaryColor }: Props) => (
  <View style={[styles.container, { borderColor: `${primaryColor}30` }]}>
    <Text style={styles.title}>Contacto</Text>
    <Text style={styles.text}>
      Información de contacto próximamente.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.xs,
  },
  text: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});