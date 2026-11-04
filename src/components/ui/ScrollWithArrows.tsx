import { useRef, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { Colors, Spacing } from '@constants/theme';

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  step?: number; // cuántos px se mueve con cada click
};

// Scroll horizontal con flechas, solo en web (en el celular alcanza con deslizar).
// Las flechas aparecen únicamente si el contenido no entra.
export const ScrollWithArrows = ({ children, contentContainerStyle, step = 150 }: Props) => {
  const { isWeb } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView>(null);
  const currentOffset = useRef(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const maxOffset = Math.max(0, contentWidth - containerWidth);
  const showArrows = isWeb && maxOffset > 0;

  const scrollBy = (amount: number) => () => {
    // Se limita al máximo real: así los clicks de más no se "acumulan"
    const next = Math.max(0, Math.min(currentOffset.current + amount, maxOffset));
    scrollRef.current?.scrollTo({ x: next, animated: true });
    currentOffset.current = next;
  };

  return (
    <View style={styles.wrapper}>
      {showArrows && (
        <TouchableOpacity style={styles.arrow} onPress={scrollBy(-step)}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        style={styles.scroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        // Se mide el ScrollView en sí, no el contenedor con las flechas
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentWidth(w)}
        onScroll={(e) => { currentOffset.current = e.nativeEvent.contentOffset.x; }}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {showArrows && (
        <TouchableOpacity style={styles.arrow} onPress={scrollBy(step)}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center' },
  scroll: { flex: 1 },
  arrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  arrowText: { color: Colors.dark.text, fontSize: 20, fontWeight: '700' },
});