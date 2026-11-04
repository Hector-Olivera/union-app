import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  displayName: string;
  avatarUrl?: string;
  size?: number;
  onPress?: () => void;
};

// Genera un color de fondo determinista basado en el nombre.
// El mismo nombre siempre genera el mismo color — sin randomness.
const getAvatarColor = (name: string): string => {
  const colors = ['#CB0B0B', '#0369A1', '#0F766E', '#B45309', '#6D28D9', '#BE185D'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Obtiene las iniciales del nombre (máximo 2 caracteres)
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const AvatarPicker = ({ displayName, avatarUrl, size = 80, onPress }: Props) => {
  const { colors } = useAppTheme();
  const bgColor = getAvatarColor(displayName);
  const initials = getInitials(displayName);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: avatarUrl ? 'transparent' : bgColor,
        borderColor: colors.brand.secondary,
      }]}
      activeOpacity={0.8}
    >
      {avatarUrl ? (        
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
          {initials}
        </Text>
      )}

      {/* Indicador de edición */}
      {onPress && (
        <View style={[styles.editBadge, { backgroundColor: colors.brand.primary }]}>
          <Text style={styles.editIcon}>✎</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    color: '#fff',
    fontSize: 12,
  },
});