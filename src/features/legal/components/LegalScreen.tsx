import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LEGAL } from '@constants/legal';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { LegalDocument } from '@/types/legal';

type Props = {
  content: LegalDocument;
};

export const LegalScreen = ({ content }: Props) => {
  const insets = useSafeAreaInsets();

  // Si se abrió desde un link directo (web) no hay historial al que volver
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.updated}>Última actualización: {LEGAL.lastUpdated}</Text>

          {content.sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text style={styles.heading}>{section.heading}</Text>
              {section.paragraphs.map((p, i) => (
                <Text key={i} style={styles.paragraph}>{p}</Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  backButton: { paddingTop: Spacing.xl, paddingBottom: Spacing.md, alignSelf: 'flex-start' },
  backText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  title: { color: Colors.dark.text, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold },
  updated: { color: Colors.dark.icon, fontSize: Typography.sizes.xs, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.lg },
  heading: { color: Colors.dark.text, fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold, marginBottom: Spacing.sm },
  paragraph: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, lineHeight: 22, marginBottom: Spacing.sm },
});