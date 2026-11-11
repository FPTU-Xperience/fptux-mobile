// components/club-detail/ClubHero.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  eyebrow: string;
  name: string;
  tagline: string;
  color: string;
};

export default function ClubHero({ eyebrow, name, tagline, color }: Props) {
  return (
    <View style={[styles.banner, { backgroundColor: color }]}>
      <View style={styles.deco} />
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.tagline}>{tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 92, // chừa chỗ cho thẻ tóm tắt đè lên
    overflow: 'hidden',
  },
  deco: {
    position: 'absolute',
    right: -60,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  eyebrow: { color: '#FDE6C8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  name: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 34, marginTop: 12 },
  tagline: { color: '#FDE6C8', fontSize: 13, fontWeight: '600', marginTop: 10 },
});