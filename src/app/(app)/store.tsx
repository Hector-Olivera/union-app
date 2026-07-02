import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreDashboard } from '@features/store/hooks/useStoreDashboard';
import { StoreSetup } from '@features/store/components/StoreSetup';
import { StoreDashboard } from '@features/store/components/StoreDashboard';
import { Colors } from '@constants/theme';
import { useAppTheme } from '@hooks/useAppTheme';

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const {
    store, loading,
    nameInput, nameError,
    setNameInput, handleActivate,
    updateLayout, updateStoreTheme: updateTheme,
  } = useStoreDashboard();

  // Estado 1: cargando datos de Firestore
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  // Estado 2: sin tienda — mostrar formulario de activación
  if (!store) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StoreSetup
          nameInput={nameInput}
          nameError={nameError}
          loading={loading}
          onChangeName={setNameInput}
          onActivate={handleActivate}
        />
      </View>
    );
  }

  // Estado 3: tienda activa — mostrar dashboard
  return (
    <View style={[styles.container, { paddingTop: insets.top, flex: 1  }]}>
      <StoreDashboard
        store={store}
        onUpdateLayout={updateLayout}
        onUpdateTheme={updateTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});