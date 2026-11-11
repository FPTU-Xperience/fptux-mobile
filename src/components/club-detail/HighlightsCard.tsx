// components/club-detail/HighlightsCard.tsx
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { ClubHighlight } from '@/types/clubDetail';

type Props = { items: ClubHighlight[] };

export default function HighlightsCard({ items }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Bạn sẽ tìm thấy gì ở đây?</Text>
      <View style={styles.list}>
        {items.map((h) => (
          <View key={h.no} style={styles.item}>
            <Text style={styles.no}>{h.no}</Text>
            <View style={styles.body}>
              <Text style={styles.itemTitle}>{h.title}</Text>
              <Text style={styles.itemDesc}>{h.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  list: { gap: 10, marginTop: 14 },
  item: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#EEF0F5',
  },
  no: { fontSize: 20, fontWeight: '800', color: '#F97316', width: 32 },
  body: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  itemDesc: { fontSize: 12.5, lineHeight: 18, color: '#6B7280', marginTop: 4 },
});