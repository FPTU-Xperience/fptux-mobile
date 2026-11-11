// components/event-detail/DetailHero.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  hubLabel: string;
  color: string;
};

export default function DetailHero({ title, hubLabel, color }: Props) {
  return (
    <View style={[styles.banner, { backgroundColor: color }]}>
      <View style={styles.deco} />
      <View style={styles.pill}>
        <View style={styles.pillDot} />
        <Text style={styles.pillText}>{hubLabel}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 90, // chừa chỗ cho thẻ tóm tắt đè lên
    overflow: 'hidden',
  },
  deco: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  pillText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  title: {
    color: '#fff',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 18,
  },
});