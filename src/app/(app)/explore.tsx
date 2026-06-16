import { PlaceholderScreen } from '@components/ui/PlaceholderScreen';
import { Colors } from '@constants/theme';

export default function ExploreScreen() {
  return (
    <PlaceholderScreen
      module="Módulo"
      title="Explorar"
      subtitle="Mapa + comunidad — próximamente"
      accentColor={Colors.brand.secondary}
    />
  );
}