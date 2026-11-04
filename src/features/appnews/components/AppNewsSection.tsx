import { View, Text, Image, StyleSheet } from 'react-native';
import { useAppNews } from '@features/appnews/hooks/useAppNews';
import { useAppTheme } from '@hooks/useAppTheme';
import { LEGAL } from '@constants/legal';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { AppNewsItem } from '@/types/appNews';

const defaultNews = (): AppNewsItem[] => [{
  id: 'default',
  title: 'Tu negocio, a un toque de tu comunidad',
  body: [
    `${LEGAL.appName} es la plataforma para que emprendedores y negocios locales se den a conocer y se conecten con su comunidad.`,
    'Creá tu tienda virtual 100% gratuita y personalizala con tu logo, tus colores, tus productos y tus horarios de atención.',
    'Compartí el QR de tu tienda: tus clientes te encuentran con solo escanearlo desde la cámara de la app.',
    'Publicá novedades, que se muestran durante 36 horas, ofrecé regalos y descuentos, y chateá directo con quienes te escriben.',
    'Explorá la comunidad: descubrí tiendas nuevas, guardá tus favoritas y enterate de sus novedades.',
    'Para que otras personas encuentren tu tienda, acordate de publicarla: tocá "Privada" en la parte de arriba de tu tienda.',
  ].join('\n\n'),
  order: 0,
}];

export const AppNewsSection = () => {
  const { colors } = useAppTheme();
  const { items } = useAppNews();
  const news = items.length > 0 ? items : defaultNews();

  return (
    <View>
      {news.map((item) => (
        <View key={item.id} style={styles.item}>
          {!!item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          )}
          {!!item.title && (
            <Text style={[styles.title, { color: colors.brand.secondary }]}>{item.title}</Text>
          )}
          {/* En la consola se puede escribir \n para separar párrafos */}
          {!!item.body && (
            <Text style={styles.body}>{item.body.replace(/\\n/g, '\n')}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: { marginBottom: Spacing.xl },
  image: { width: '100%', aspectRatio: 16 / 9, borderRadius: Radius.lg, marginBottom: Spacing.md },
  title: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.md },
  body: { color: Colors.dark.text, fontSize: Typography.sizes.md, lineHeight: 24 },
});