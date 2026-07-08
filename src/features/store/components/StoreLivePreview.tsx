import { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { StoreSectionRenderer } from './StoreSectionRenderer';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Store } from '@/types/store';
import { Product } from '@/types/product';

type Props = {
  store: Store;
  products?: Product[];
};


const REFERENCE_WIDTH = 360;

const FRAME_VIEWPORT_HEIGHT = 650;

const CONTENT_PADDING = Spacing.md;

export const StoreLivePreview = ({ store, products = [] }: Props) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  

  const handleContentLayout = (e: LayoutChangeEvent) => {
    
    const height = e.nativeEvent.layout.height;
  if (height > 0 && Math.abs(height - contentHeight) > 1) {
    setContentHeight(height);
  }
  };

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
    }
  };

  
  const scale = containerWidth > 0
    ? (containerWidth - CONTENT_PADDING * 2) / REFERENCE_WIDTH
    : 1;

  const scaledContentHeight = contentHeight * scale;

  return (
    <View style={styles.frame}>
      <View style={styles.frameHeader}>
        <View style={styles.dot} />
        <Text style={styles.frameLabel}>VISTA PREVIA</Text>
      </View>

      <ScrollView
        style={styles.frameViewport}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled
      >
        <View onLayout={handleContainerLayout} style={styles.widthMeasurer}>
          {/* Medidor invisible a ancho fijo — mide el alto real una sola vez */}
          <View style={styles.measurer} pointerEvents="none">
            <View style={{ width: REFERENCE_WIDTH }} onLayout={handleContentLayout}>
              <StoreSectionRenderer store={store} products={products}/>
            </View>
          </View>

          {/* Contenido visible, escalado para llenar el ancho, alto libre */}
          <View
            style={[
              styles.scaledWrapper,
              {
                width: REFERENCE_WIDTH,
                height: contentHeight,
                transform: [{ scale }],
                left: CONTENT_PADDING,
                top: CONTENT_PADDING,
              }
            ]}
            pointerEvents="none"
          >
            <StoreSectionRenderer store={store} products={products}/>
          </View>

          {/* Spacer: reserva el espacio real que ocupa el contenido
              ya escalado, para que el ScrollView sepa cuánto scrollear.
              El scaledWrapper es absolute y no aporta tamaño por sí solo. */}
          <View style={{ height: scaledContentHeight + CONTENT_PADDING * 2}} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  frameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.status.success,
  },
  frameLabel: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1.5,
  },
  frameViewport: {
    width: '100%',
    height: FRAME_VIEWPORT_HEIGHT,
  },
  widthMeasurer: {
    width: '100%',
    position: 'relative',
  },
  measurer: {
    position: 'absolute',
    opacity: 0,
    top: -9999,
    left: -9999,
  },
  scaledWrapper: {
    position: 'absolute',
    transformOrigin: 'top left',
  },
});