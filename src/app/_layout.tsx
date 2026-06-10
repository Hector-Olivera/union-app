import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';

export default function RootLayout() {
  const { initialize, isAuthenticated, loading } = useAuthStore();
  const segments = useSegments();
  // useSegments devuelve un array con los segmentos de la ruta actual.
  // Ejemplo: en /(app)/profile devuelve ['(app)', 'profile']
  // Nos permite saber en qué grupo de rutas estamos

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    // No hacer nada mientras carga la sesión inicial
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (isAuthenticated && inAuthGroup) {
      // Tiene sesión pero está en login/register → llevar a la app
      router.replace('/(app)');
    } else if (!isAuthenticated && inAppGroup) {
      // No tiene sesión pero está en la app → llevar al login
      router.replace('/(auth)/login');
    }
    // Si está en index.tsx (portero), el Redirect lo maneja
  }, [isAuthenticated, loading, segments]);
  // Este efecto se ejecuta cada vez que cambia isAuthenticated
  // Es decir: cuando hace login O cuando hace logout → navega automáticamente

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}