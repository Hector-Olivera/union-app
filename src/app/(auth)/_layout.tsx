import { Stack } from 'expo-router';
import { Colors } from '@constants/theme';

// Este layout envuelve login y register
// headerShown: false porque diseñamos nuestro propio header visual
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
        animation: 'fade',
        // Transición fade entre login y register — más elegante que el slide
      }}
    />
  );
}
