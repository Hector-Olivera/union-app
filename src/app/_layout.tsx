import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@stores/authStore';
import { injectWebGlobalStyles } from '@utils/webStyles';

export default function RootLayout() {
  const { initialize, isAuthenticated, loading } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    injectWebGlobalStyles();
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
    } else if (!isAuthenticated && inAppGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, loading, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}