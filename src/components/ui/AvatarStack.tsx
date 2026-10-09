import { View, Text, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors } from '@constants/theme';

type AvatarItem = {
  id: string;
  name: string;
  imageUrl?: string;
  hasNew?: boolean;
};

type Props = {
  items: AvatarItem[];
  maxVisible?: number;
  size?: number;
};

const getColor = (name: string): string => {
  const colors = ['#6C63FF', '#FF6584', '#43E8D8', '#FF6B35', '#0077B6', '#2D6A4F'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const AvatarStack = ({ items, maxVisible = 5, size = 36 }: Props) => {
  const visible = items.slice(0, maxVisible);
  const remaining = items.length - visible.length;

  return (
    <View style={styles.row}>
      {visible.map((item, index) => (
        <View
          key={item.id}
          style={{ width: size, height: size, marginLeft: index === 0 ? 0 : -size * 0.3 }}
        >
           <View style={[styles.avatarWrapper, { width: size, height: size, borderRadius: size / 2 }]}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={[styles.avatarImage, { borderRadius: size / 2 }]} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: getColor(item.name), borderRadius: size / 2 }]}>
                    <Text style={[styles.avatarInitial, { fontSize: size * 0.4 }]}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Capa 2: el punto, hijo del contenedor exterior — nunca se recorta */}
              {item.hasNew && (
                <View style={[styles.newDot, { width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16 }]} />
              )}
            </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.avatarWrapper, styles.moreBadge, { width: size, height: size, borderRadius: size / 2, marginLeft: -size * 0.3 }]}>
          <Text style={styles.moreText}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: Colors.dark.background,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontWeight: '900' },
  moreBadge: { backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  moreText: { color: Colors.dark.text, fontSize: 11, fontWeight: '700' },
  newDot: {
  position: 'absolute',
  bottom: -2,
  right: -2,
  backgroundColor: Colors.status.success,
  borderWidth: 1.5,
  borderColor: Colors.dark.background,
  },  
});