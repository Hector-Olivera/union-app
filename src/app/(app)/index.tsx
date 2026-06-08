import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@constants/theme';

// Pantalla temporal — placeholder hasta construir el Home real con el mapa AR
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home — próximamente el mapa AR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
});