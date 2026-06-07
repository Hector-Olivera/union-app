import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';

export default function RootLayout() {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // Aquí irá la inicialización de Firebase Auth
    // Por ahora simula el chequeo inicial de sesión
    const checkSession = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };
    checkSession();
  }, []);

  return (
    // GestureHandlerRootView es requerido por react-native-gesture-handler
    // Debe envolver TODA la app para que los gestos funcionen correctamente
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}