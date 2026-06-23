import { View } from 'react-native';
import { LogoSection } from './sections/LogoSection';
import { BannerSection } from './sections/BannerSection';
import { ProductGridSection } from './sections/ProductGridSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { CarouselSection } from './sections/CarouselSection';
import type { Store } from '@/types/store';
import { THEME_OPTIONS } from '@stores/themeStore';

type Props = {
  store: Store;
};

// Renderiza las secciones visibles del layout de la tienda, en orden.
// El carrusel todavía no tiene componente propio — se omite hasta
// que tengamos imágenes reales que mostrar (no tiene sentido un
// placeholder de carrusel vacío).
export const StoreSectionRenderer = ({ store }: Props) => {
  const theme = THEME_OPTIONS.find(t => t.id === store.themeId) || THEME_OPTIONS[0];
  const visibleSections = store.layout
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <View>
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'logo':
            return (
              <LogoSection
                key={section.id}
                storeName={store.name}
                primaryColor={theme.primary}
              />
            );
          case 'banner':
            return (
              <BannerSection
                key={section.id}
                storeName={store.name}
                description={store.description}
                primaryColor={theme.primary}
                secondaryColor={theme.secondary}
              />
            );
          case 'product_grid':
            return (
              <ProductGridSection
                key={section.id}
                primaryColor={theme.primary}
              />
            );
          case 'about':
            return (
              <AboutSection
                key={section.id}
                description={store.description}
              />
            );
          case 'contact':
            return (
              <ContactSection
                key={section.id}
                primaryColor={theme.primary}
              />
            );
          case 'carousel':
            return (
              <CarouselSection
                key={section.id}
                primaryColor={theme.primary}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
};