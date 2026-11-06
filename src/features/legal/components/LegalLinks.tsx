import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@constants/theme';

export const LegalLinks = () => (
  <View style={styles.row}>
    <TouchableOpacity onPress={() => router.push('/terms' as any)}>
      <Text style={styles.link}>Términos y Condiciones  </Text>
    </TouchableOpacity>
    <Text style={styles.dot}>·</Text>
    <TouchableOpacity onPress={() => router.push('/privacy' as any)}>
      <Text style={styles.link}>Política de Privacidad  </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.sm, paddingBottom: Spacing.xl },
  link: { color: Colors.dark.icon, fontSize: Typography.sizes.xs, textDecorationLine: 'underline' },
  dot: { color: Colors.dark.icon, fontSize: Typography.sizes.xs },
});