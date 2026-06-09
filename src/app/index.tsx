import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { Colors } from '@constants/theme';

export default function Index() {
  const { isAuthenticated, loading } = useAuthStore();

  // Mientras Firebase verifica la sesión guardada, mostramos loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center',
        alignItems: 'center', backgroundColor: Colors.dark.background }}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  // Redirect declarativo — Expo Router lo maneja sin push manual
  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/login'} />;
}