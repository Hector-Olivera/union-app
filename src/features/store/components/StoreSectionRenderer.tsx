import { StyleSheet, View } from 'react-native';
import { LogoSection } from './sections/LogoSection';
import { BannerSection } from './sections/BannerSection';
import { ProductGridSection } from './sections/ProductGridSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { CarouselSection } from './sections/CarouselSection';
import type { Store } from '@/types/store';
import { THEME_OPTIONS } from '@stores/themeStore';
import { Product } from '@/types/product';
import { HoursSection } from './sections/HoursSection';
import { AnnouncementsSection } from './sections/AnnouncementsSection';

type Props = {
  store: Store;
  products?: Product[];
};

export const StoreSectionRenderer = ({ store, products = [] }: Props) => {
  const theme = THEME_OPTIONS.find(t => t.id === store.themeId) || THEME_OPTIONS[0];
  const visibleSections = store.layout
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <View style={styles.wrapContainer}>
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'logo':
            return <View key={section.id} style={styles.fullWidth}><LogoSection storeName={store.name} primaryColor={theme.primary} logoUrl={store.logoUrl} /></View>;
          case 'banner':
            return <View key={section.id} style={styles.fullWidth}><BannerSection storeName={store.name} description={store.description} primaryColor={theme.primary} secondaryColor={theme.secondary} bannerUrl={store.bannerUrl} /></View>;
          case 'product_grid':
            return <View key={section.id} style={styles.fullWidth}><ProductGridSection primaryColor={theme.primary} products={products} /></View>;
          case 'carousel':
            return <View key={section.id} style={styles.fullWidth}><CarouselSection primaryColor={theme.primary} images={store.carouselImages} /></View>;
          case 'about':
            return <View key={section.id} style={styles.inlineItem}><AboutSection description={store.description} /></View>;
          case 'contact':
            return <View key={section.id} style={styles.inlineItem}><ContactSection primaryColor={theme.primary} contact={store.contact} /></View>;
          case 'hours':
            return <View key={section.id} style={styles.inlineItem}><HoursSection hours={store.businessHours} primaryColor={theme.primary} /></View>;
          case 'announcements':
            return <View key={section.id} style={styles.inlineItem}><AnnouncementsSection announcements={store.announcements} primaryColor={theme.primary} /></View>;
          default:
            return null;
        }
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 16,
  },
  fullWidth: {
    width: '100%',
  },
  inlineItem: {
    width: '47%',
    maxWidth: 300,
    minWidth: 140, 
    flexGrow: 0,
  },
});