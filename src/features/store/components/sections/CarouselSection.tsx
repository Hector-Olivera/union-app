import { useRef, useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

type Props = {
  primaryColor: string;
  images?: string[];
};

export const CarouselSection = ({ primaryColor, images = [] }: Props) => {
  const { isWeb } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView>(null);
  const currentOffset = useRef(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  if (images.length === 0) return null;

  const maxOffset = Math.max(0, contentWidth - containerWidth);

  const handleScroll = (amount: number) => () => {
    const next = Math.max(0, Math.min(currentOffset.current + amount, maxOffset));
    scrollRef.current?.scrollTo({ x: next, animated: true });
    currentOffset.current = next;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.scrollWrapper} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {isWeb && (
          <TouchableOpacity style={[styles.arrowButton, { left: -16 }]} onPress={handleScroll(-240)}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          onContentSizeChange={(w) => setContentWidth(w)}
          onScroll={(e) => { currentOffset.current = e.nativeEvent.contentOffset.x; }}
          scrollEventThrottle={16}
        >
          {images.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.slide} resizeMode="cover" />
          ))}
        </ScrollView>

        {isWeb && (
          <TouchableOpacity style={[styles.arrowButton, { right: -16 }]} onPress={handleScroll(240)}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    );
  };


const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  scroll: { gap: Spacing.sm, paddingRight: Spacing.md },
  slide: {
    width: 220,
    height: 130,
    borderRadius: Radius.lg,
  },
  scrollWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
     position: 'absolute',
    top: '50%',
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    transform: [{ translateY: -16 }],
  },
  arrowText: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
  },
});
