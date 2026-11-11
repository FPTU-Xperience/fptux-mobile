// components/schedule/ScheduleItem.tsx
import { Clock, MapPin, QrCode, Ticket } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ScheduleEvent, TicketStatus } from '@/types/schedule';

const STATUS: Record<TicketStatus, { label: string; bg: string; color: string }> = {
  confirmed: { label: 'Đã xác nhận vé', bg: '#CDEFFA', color: '#0E7490' },
  pending: { label: 'Chờ check-in', bg: '#FFE4D6', color: '#C2410C' },
  attended: { label: 'Đã tham gia', bg: '#DCFCE7', color: '#15803D' },
};

type Props = {
  event: ScheduleEvent;
  onPress?: (event: ScheduleEvent) => void;
};

export default function ScheduleItem({ event, onPress }: Props) {
  const status = STATUS[event.status];
  const ActionIcon = event.action === 'qr' ? QrCode : Ticket;

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(event)}>
      <View style={[styles.dateBox, { backgroundColor: event.dateBoxBg }]}>
        <Text style={[styles.day, { color: event.dateBoxColor }]}>{event.day}</Text>
        <Text style={[styles.month, { color: event.dateBoxColor }]}>{event.month}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.tags}>
            <Text style={styles.club}>{event.club}</Text>
            <Text style={styles.category}>· {event.category}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {event.name}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#F97316" />
              <Text style={styles.metaText}>{event.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={12} color="#F97316" />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.venue}
              </Text>
            </View>
          </View>
          <View style={styles.actionBox}>
            <ActionIcon size={16} color="#F97316" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dateBox: {
    width: 54,
    height: 62,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: { fontSize: 22, fontWeight: '800', lineHeight: 24 },
  month: { fontSize: 10, fontWeight: '700', marginTop: 2 },

  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  club: { fontSize: 10, fontWeight: '700', color: '#C2410C' },
  category: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 9.5, fontWeight: '700' },

  name: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 6 },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  meta: { flex: 1, gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: '#6B7280', flexShrink: 1 },
  actionBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});