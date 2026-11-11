// components/profile/ClubsCard.tsx
import { Code2, Users } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';
import type { ProfileClub } from '@/types/profile';

type Props = { clubs: ProfileClub[] };

export default function ClubsCard({ clubs }: Props) {
  return (
    <Card>
      <CardTitle
        icon={Users}
        title="Câu lạc bộ đồng hành"
        right={<Text style={styles.count}>{clubs.length} tổ chức</Text>}
      />

      <View style={styles.list}>
        {clubs.map((c) => (
          <View key={c.id} style={styles.item}>
            <View style={styles.logo}>
              <Code2 size={20} color="#374151" />
            </View>
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.field} numberOfLines={1}>
                {c.field}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{c.badge}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 11, fontWeight: '700', color: '#F97316' },
  list: { gap: 10, marginTop: 14 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#EEF3FB',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: '#111827' },
  field: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  badge: {
    maxWidth: 110,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFE4D6',
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#C2410C' },
});