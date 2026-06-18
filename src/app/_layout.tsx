import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { injectWebGlobalStyles } from '@utils/webStyles';
import { useStoreStore } from '@stores/storeStore';

export default function RootLayout() {
  const { loadStore, clearStore } = useStoreStore();
  const { initialize, isAuthenticated, loading, user } = useAuthStore();
  const { loadUserTheme, resetTheme } = useThemeStore();
  const segments = useSegments();
  

  useEffect(() => {
    injectWebGlobalStyles();
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  // Cuando cambia el estado de auth: carga o resetea el tema
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user) {
      // Usuario logueado → cargar su tema personalizado desde Firestore
      loadUserTheme(user.id);
      loadStore(user.id);
    } else {
      // Usuario deslogueado → volver al tema default
      resetTheme();
      clearStore();
    }
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    if (isAuthenticated && inAuthGroup) router.replace('/(app)');
    else if (!isAuthenticated && inAppGroup) router.replace('/(auth)/login');
  }, [isAuthenticated, loading, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}