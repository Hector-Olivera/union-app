import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { injectWebGlobalStyles } from '@utils/webStyles';
import { useStoreStore } from '@stores/storeStore';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { db } from '@services/firebase/config';

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

  useEffect(() => {
  const reconnect = async () => {
    try {
      await disableNetwork(db);
      await enableNetwork(db);
    } catch (e) {
      console.error('[Firestore] reconnect error:', e);
    }
  };

  const interval = setInterval(reconnect, 60000); // cada 60 segundos

  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === 'active') reconnect();
  };
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    clearInterval(interval);
    subscription.remove();
  };
}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}