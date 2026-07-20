import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@constants/theme';

export const AuthDivider = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>o</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});