// components/club-detail/LeadersCard.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { ClubLeader } from '@/types/clubDetail';

type Props = {
  leaders: ClubLeader[];
  onContact: (leader: ClubLeader) => void;
};

export default function LeadersCard({ leaders, onContact }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Ban điều hành CLB</Text>
      <View style={styles.list}>
        {leaders.map((l) => (
          <View key={l.id} style={styles.item}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{l.initials}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{l.name}</Text>
              <Text style={styles.term}>{l.term}</Text>
            </View>
            <Pressable style={styles.contact} onPress={() => onContact(l)}>
              <Text style={styles.contactText}>Liên hệ</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  list: { gap: 12, marginTop: 14 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#374151' },
  body: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: '#111827' },
  term: { fontSize: 11.5, color: '#6B7280', marginTop: 2, lineHeight: 16 },
  contact: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  contactText: { fontSize: 12, fontWeight: '700', color: '#374151' },
});