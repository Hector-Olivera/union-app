import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Store } from '@/types/store';

type Props = {
  primaryColor: string;
  contact?: Store['contact'];
};

export const ContactSection = ({ primaryColor, contact }: Props) =>  {
  if (!contact || (!contact.phone && !contact.whatsapp && !contact.address && !contact.instagram)) {
    return null;
  }

  return (
    <View style={[styles.container, { borderColor: `${primaryColor}30` }]}>
      <Text style={styles.title}>Contacto</Text>

      {!!contact.whatsapp && (
        <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${contact.whatsapp}`)}>
          <Text style={[styles.link, { color: primaryColor }]}>WhatsApp: {contact.whatsapp}</Text>
        </TouchableOpacity>
      )}
      {!!contact.phone && <Text style={styles.text}>Tel: {contact.phone}</Text>}
      {!!contact.address && <Text style={styles.text}>{contact.address}</Text>}
      {!!contact.instagram && (
        <TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${contact.instagram!.replace('@', '')}`)}>
          <Text style={[styles.link, { color: primaryColor }]}>{contact.instagram}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.xs,
  },
  text: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  link: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});