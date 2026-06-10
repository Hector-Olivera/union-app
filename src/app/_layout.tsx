import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';

export default function RootLayout() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Inicia el observer y guarda el unsubscribe
    const unsubscribe = initialize();
    // Cuando el componente se desmonta, cancela el observer
    // Esto evita memory leaks y llamadas a setState en componentes muertos
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}