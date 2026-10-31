import * as Sentry from '@sentry/react-native';
import type { ComponentType } from 'react';

let initialized = false;

export const initMonitoring = () => {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  // Solo en builds reales y con DSN configurado: en desarrollo no se reporta nada
  if (__DEV__ || !dsn || initialized) return;

  Sentry.init({
    dsn,
    environment: 'production',
    sendDefaultPii: false,   // no enviar datos personales por defecto
    tracesSampleRate: 0,     // solo errores, sin métricas de rendimiento
    ignoreErrors: ['Unable to activate keep awake'], // ruido conocido de Expo
  });
  initialized = true;
};

// Solo el ID interno: sin nombre ni correo
export const setMonitoringUser = (userId: string | null) => {
  if (!initialized) return;
  Sentry.setUser(userId ? { id: userId } : null);
};

export const captureError = (error: unknown, context?: string) => {
  if (!initialized) return;
  Sentry.captureException(error, context ? { tags: { context } } : undefined);
};

// Envuelve la raíz de la app para capturar errores de renderizado
export const withMonitoring = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
  if (!initialized) return Component;
  // Sentry.wrap exige un tipo de props más estricto que el genérico P.
  // El cast es seguro: devuelve el mismo componente, envuelto.
  return Sentry.wrap(
    Component as unknown as ComponentType<Record<string, unknown>>
  ) as unknown as ComponentType<P>;
};

// Sirve para diagnosticar: ¿se inicializó Sentry en este build?
export const isMonitoringActive = () => initialized;