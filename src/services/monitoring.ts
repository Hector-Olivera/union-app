import type { ComponentType } from 'react';

// Web: sin monitoreo por ahora. Misma interfaz que la versión nativa.
export const initMonitoring = () => {};
export const setMonitoringUser = (_userId: string | null) => {};
export const captureError = (_error: unknown, _context?: string) => {};
export const withMonitoring = <P extends object>(Component: ComponentType<P>): ComponentType<P> => Component;

export const isMonitoringActive = () => false;