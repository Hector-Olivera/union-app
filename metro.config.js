const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Reemplaza a getDefaultConfig de Expo: mantiene la misma configuración
// y agrega los identificadores que Sentry usa para unir cada error con su source map
const config = getSentryExpoConfig(__dirname);

module.exports = config;