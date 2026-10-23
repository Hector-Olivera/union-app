import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { injectWebGlobalStyles } from '@utils/webStyles';
import { useStoreStore } from '@stores/storeStore';
import { useBlockStore } from '@stores/blockStore';
import { initMonitoring, setMonitoringUser, withMonitoring } from '@services/monitoring';
import { LEGAL } from '@constants/legal';

// Se inicializa una sola vez, antes de definir el componente
initMonitoring();

function RootLayout() {
  const { loadStore, clearStore } = useStoreStore();
  const { initialize, isAuthenticated, loading, user } = useAuthStore();
  const { loadUserTheme, resetTheme } = useThemeStore();
  const segments = useSegments();
  const { startBlocksListener, clearBlocks } = useBlockStore();

  useEffect(() => {
    setMonitoringUser(isAuthenticated && user ? user.id : null);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    injectWebGlobalStyles();
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearBlocks();
      return;
    }
    const unsubscribe = startBlocksListener(user.id);
    return unsubscribe;
  }, [isAuthenticated, user?.id]);

  // Cuando cambia el estado de auth: carga o resetea el tema y la tienda
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user) {
      loadUserTheme(user.id);
      loadStore(user.id);
    } else {
      resetTheme();
      clearStore();
    }
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    if (loading) return;

    const seg = segments[0];
    const inAuthGroup = seg === '(auth)';
    const inAppGroup = seg === '(app)';
    const inAcceptTerms = seg === 'accept-terms';
    // Las páginas legales se pueden leer con o sin sesión
    const inLegal = seg === 'terms' || seg === 'privacy' || seg === 'data-deletion';

    if (!isAuthenticated) {
      if (inAppGroup || inAcceptTerms) router.replace('/(auth)/login');
      return;
    }

    // Con sesión pero sin haber aceptado la versión vigente: solo la
    // pantalla de aceptación (y poder leer los textos)
    if (user?.termsAcceptedVersion !== LEGAL.termsVersion) {
      if (!inAcceptTerms && !inLegal) router.replace('/accept-terms' as any);
      return;
    }

    if (inAuthGroup || inAcceptTerms) router.replace('/(app)');
  }, [isAuthenticated, loading, segments, user?.termsAcceptedVersion]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}

export default withMonitoring(RootLayout);