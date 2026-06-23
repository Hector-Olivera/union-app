import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@constants/theme';

type Props = {
  description: string;
};

export const AboutSection = ({ description }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>Acerca de</Text>
    <Text style={styles.text}>
      {description || 'Esta tienda todavía no agregó una descripción.'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  text: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    lineHeight: 22,
  },
});