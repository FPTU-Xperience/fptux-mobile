// components/scan/ScanFrame.tsx
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const ORANGE = '#F97316';
const CORNER = 40;
const THICK = 4;

type Props = { size: number };

export default function ScanFrame({ size }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(progress, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, size - 12],
  });

  return (
    <View style={{ width: size, height: size }}>
      {/* Đường ngắm */}
      <View style={[styles.lineH, { top: size / 2 }]} />
      <View style={[styles.lineV, { left: size / 2 }]} />
      <View style={[styles.centerDot, { top: size / 2 - 4, left: size / 2 - 4 }]} />

      {/* Đường quét */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />

      {/* 4 góc */}
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />
    </View>
  );
}

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: ORANGE,
  },
  tl: { top: 0, left: 0, borderTopWidth: THICK, borderLeftWidth: THICK, borderTopLeftRadius: 16 },
  tr: { top: 0, right: 0, borderTopWidth: THICK, borderRightWidth: THICK, borderTopRightRadius: 16 },
  bl: { bottom: 0, left: 0, borderBottomWidth: THICK, borderLeftWidth: THICK, borderBottomLeftRadius: 16 },
  br: { bottom: 0, right: 0, borderBottomWidth: THICK, borderRightWidth: THICK, borderBottomRightRadius: 16 },

  lineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  lineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(249,115,22,0.7)',
  },
});