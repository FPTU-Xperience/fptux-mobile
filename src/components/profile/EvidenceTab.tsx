// components/profile/EvidenceTab.tsx
import { Award, FileCheck2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';
import type { Evidence } from '@/types/profile';

type Props = { evidences: Evidence[] };

export default function EvidenceTab({ evidences }: Props) {
  return (
    <Card>
      <CardTitle icon={FileCheck2} title="Minh chứng hoạt động" />

      {evidences.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Award size={22} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có minh chứng nào</Text>
          <Text style={styles.emptyDesc}>
            Tham gia hoạt động và điểm danh bằng mã QR để nhận minh chứng đầu tiên.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {evidences.map((e) => (
            <View key={e.id} style={styles.item}>
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {e.title}
                </Text>
                <Text style={styles.itemSub}>{e.issuer}</Text>
              </View>
              <Text style={styles.itemDate}>{e.date}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginTop: 12 },
  emptyDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  list: { marginTop: 12, gap: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
  },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '800', color: '#111827' },
  itemSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  itemDate: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
});