import { View, Text, Image, StyleSheet } from 'react-native';
import { Radius } from '@constants/theme';

type Props = {
  storeName: string;
  primaryColor: string;
  logoUrl?: string;
};

// Sección logo: por ahora muestra la inicial del nombre.
// Cuando exista subida de imágenes, recibe logoUrl y renderiza <Image>.
export const LogoSection = ({ storeName, primaryColor, logoUrl }: Props) => {
  const initial = storeName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={styles.logoImage} resizeMode="cover" />
      ) : (
        <View style={[styles.logo, { backgroundColor: primaryColor }]}>
          <Text style={styles.logoText}>{initial}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
  },
});