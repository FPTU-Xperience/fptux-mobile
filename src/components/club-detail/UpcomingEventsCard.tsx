// components/club-detail/UpcomingEventsCard.tsx
import { ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { ClubUpcomingEvent } from '@/types/clubDetail';

type Props = {
  events: ClubUpcomingEvent[];
  onPressEvent: (event: ClubUpcomingEvent) => void;
  onPressAll: () => void;
};

export default function UpcomingEventsCard({ events, onPressEvent, onPressAll }: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Sự kiện sắp diễn ra</Text>
        <Pressable onPress={onPressAll} hitSlop={8}>
          <Text style={styles.all}>Xem tất cả</Text>
        </Pressable>
      </View>

      {events.length === 0 ? (
        <Text style={styles.empty}>Chưa có sự kiện sắp diễn ra</Text>
      ) : (
        <View style={styles.list}>
          {events.map((e) => (
            <Pressable key={e.id} style={styles.item} onPress={() => onPressEvent(e)}>
              <View style={styles.dateBox}>
                <Text style={styles.month}>{e.month}</Text>
                <Text style={styles.day}>{e.day}</Text>
              </View>

              <View style={styles.body}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {e.title}
                </Text>
                <View style={styles.metaRow}>
                  <Clock size={12} color="#F97316" />
                  <Text style={styles.metaText}>{e.time}</Text>
                  <MapPin size={12} color="#F97316" />
                  <Text style={[styles.metaText, styles.venue]} numberOfLines={1}>
                    {e.venue}
                  </Text>
                </View>
              </View>

              <ChevronRight size={18} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  all: { fontSize: 12, fontWeight: '700', color: '#F97316' },
  empty: { fontSize: 13, color: '#9CA3AF', marginTop: 14 },
  list: { gap: 10, marginTop: 14 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    borderWidth: 1,
    borderColor: '#FDE6D2',
  },
  dateBox: {
    width: 46,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  month: { fontSize: 9, fontWeight: '800', color: '#C2410C' },
  day: { fontSize: 20, fontWeight: '800', color: '#F97316', lineHeight: 24 },
  body: { flex: 1 },
  eventTitle: { fontSize: 13.5, fontWeight: '800', color: '#111827', lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  metaText: { fontSize: 11, color: '#6B7280' },
  venue: { flexShrink: 1 },
});