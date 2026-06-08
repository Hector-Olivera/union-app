import { Stack } from 'expo-router';
import { Colors } from '@constants/theme';

// Layout placeholder para las rutas protegidas.
// Acá irá el Tab Navigator cuando construyamos el interior de la app.
export default function AppLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.dark.background },
    }} />
  );
}