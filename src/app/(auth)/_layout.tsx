import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@constants/theme';

export default function AuthLayout() {
  return (
    // En web centramos el contenido con un ancho máximo
    // En native ocupa toda la pantalla normalmente
    <View style={styles.wrapper}>
      <View style={styles.inner}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.dark.background },
            animation: 'fade',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    // En web: centrar horizontalmente
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  inner: {
    flex: 1,
    // En web limitamos el ancho para que no se estire en pantallas grandes
    width: Platform.OS === 'web' ? 420 : '100%',
    // 420px es el ancho estándar para formularios de auth en web
  },
});