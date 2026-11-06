import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { Colors } from '@constants/theme';

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const ProfileTabIcon = ({ focused }: { focused: boolean }) => {
  const user = useAuthStore(s => s.user);
  const { activeTheme } = useThemeStore();

  if (!user) {
    return <Ionicons name="person" size={24} color={focused ? activeTheme.secondary : Colors.dark.icon} />;
  }

  return (
    <View
      style={[
        styles.ring,
        { borderColor: focused ? activeTheme.secondary : 'transparent', opacity: focused ? 1 : 0.75 },
      ]}
    >
      {user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>{getInitials(user.displayName || 'U')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: { width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  image: { width: 28, height: 28, borderRadius: 14 },
  placeholder: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center',
  },
  initials: { color: Colors.dark.text, fontSize: 10, fontWeight: '700' },
});