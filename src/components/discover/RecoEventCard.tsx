// components/discover/RecoEventCard.tsx
import { ArrowUpRight, Clock, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { RecoEvent, RecoEventStatus } from '@/types/recommendation';

const STATUS: Record<RecoEventStatus, { label: string; dot: string }> = {
  upcoming: { label: 'Sắp diễn ra', dot: '#3B82F6' },
  ongoing: { label: 'Đang diễn ra', dot: '#22C55E' },
};

type Props = {
  event: RecoEvent;
  onPress: (event: RecoEvent) => void;
};

export default function RecoEventCard({ event, onPress }: Props) {
  const theme = useTheme();
  const status = STATUS[event.status];

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.background }]} onPress={() => onPress(event)}>
      <View style={[styles.banner, { backgroundColor: event.bannerColor }]}>
        <View style={styles.deco} />
        <View style={styles.top}>
          <View style={styles.clubRow}>
            <View style={styles.clubBar} />
            <Text style={styles.club} numberOfLines={2}>
              {event.club}
            </Text>
          </View>
          <View style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: status.dot }]} />
            <Text style={styles.badgeText}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.locRow}>
          <MapPin size={12} color="#D1FAE5" />
          <Text style={styles.loc}>{event.bannerLocation}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={[styles.dateBox, { backgroundColor: event.dateBoxBg }]}>
          <Text style={[styles.day, { color: event.dateBoxColor }]}>{event.day}</Text>
          <Text style={[styles.month, { color: event.dateBoxColor }]}>THÁNG {event.month}</Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.metaRow}>
            <Clock size={12} color="#F97316" />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>{event.time}</Text>
            <MapPin size={12} color="#F97316" />
            <Text style={[styles.metaText, styles.venue, { color: theme.textSecondary }]} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
        </View>

        <View style={styles.detail}>
          <Text style={styles.detailText}>Chi tiết</Text>
          <ArrowUpRight size={13} color="#F97316" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  banner: { padding: 14, minHeight: 140, overflow: 'hidden' },
  deco: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  clubRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  clubBar: { width: 3, height: 12, borderRadius: 2, backgroundColor: '#F97316' },
  club: { flex: 1, color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#1F2937' },
  title: { color: '#fff', fontSize: 19, fontWeight: '800', lineHeight: 24, marginTop: 12 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 10 },
  loc: { color: '#D1FAE5', fontSize: 11, fontWeight: '600' },

  info: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  dateBox: {
    width: 52,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: { fontSize: 20, fontWeight: '800', lineHeight: 22 },
  month: { fontSize: 7.5, fontWeight: '800', marginTop: 2 },
  body: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  metaText: { fontSize: 10.5 },
  venue: { flexShrink: 1 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailText: { fontSize: 11.5, fontWeight: '800', color: '#F97316' },
});