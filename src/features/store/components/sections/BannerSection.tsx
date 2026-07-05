import { View, Text, Image, StyleSheet } from 'react-native';
import { Typography } from '@constants/theme';

type Props = {
  storeName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  bannerUrl?: string;
};

export const BannerSection = ({
   storeName, description, primaryColor, secondaryColor, bannerUrl
   }: Props) => {
  if (bannerUrl) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: bannerUrl }} style={styles.bannerImage} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.placeholderContainer, { backgroundColor: primaryColor }]}>
      <View style={[styles.overlay, { backgroundColor: secondaryColor }]} />
      <View style={styles.textOverlay}>
        <Text style={styles.name}>{storeName}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    minHeight: 80,
  },
   placeholderContainer: {
    justifyContent: 'flex-end',
  },
   bannerImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.25,
  },
  textOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  name: {
    color: '#fff',
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.sizes.sm,
  },
});