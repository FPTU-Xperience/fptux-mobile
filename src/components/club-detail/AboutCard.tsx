// components/club-detail/AboutCard.tsx
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';

type Props = {
  heading: string;
  text: string;
  hashtags: string[];
};

export default function AboutCard({ heading, text, hashtags }: Props) {
  return (
    <Card>
      <Text style={styles.eyebrow}>CHÚNG MÌNH LÀ AI?</Text>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.body}>{text}</Text>

      <View style={styles.tags}>
        {hashtags.map((t) => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipText}>{t}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.8 },
  heading: { fontSize: 20, fontWeight: '800', color: '#111827', marginTop: 8, lineHeight: 26 },
  body: { fontSize: 14, lineHeight: 22, color: '#4B5563', marginTop: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF0F5',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
});