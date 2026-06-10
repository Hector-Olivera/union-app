import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Leemos las claves desde variables de entorno
// Nunca hardcodeamos claves en el código fuente
const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};
// El "!" al final le dice a TypeScript "confía en mí, este valor existe".
// Si la variable no está definida, fallará en runtime con un error claro.

// getApps() devuelve las apps Firebase ya inicializadas.
// Este patrón evita el error "Firebase already initialized"
// que ocurre cuando el módulo se recarga en desarrollo (hot reload).
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// initializeAuth con AsyncStorage como persistencia
// Esto hace que la sesión del usuario sobreviva al cerrar la app.
// En React Native no existe localStorage (que es lo que usa la web),
// entonces Firebase necesita que le indiquemos dónde guardar la sesión.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Instancia de Firestore — la base de datos en tiempo real
export const db = getFirestore(app);

export default app;