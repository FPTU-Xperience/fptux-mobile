// components/activity/EventCard.tsx
import {
  ArrowUpRight,
  Building2,
  Clock,
  Gift,
  Heart,
  MapPin,
  Music,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActivityEvent, ActivityStatus, VenueKind } from '@/types/activity';

const STATUS_LABEL: Record<ActivityStatus, string> = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  ended: 'Đã kết thúc',
};

const STATUS_DOT: Record<ActivityStatus, string> = {
  upcoming: '#3B82F6',
  ongoing: '#22C55E',
  ended: '#9CA3AF',
};

const VENUE_ICON: Record<VenueKind, LucideIcon> = {
  pin: MapPin,
  music: Music,
  users: Users,
};

type Props = {
  event: ActivityEvent;
  onPressDetail?: (event: ActivityEvent) => void;
};

function Footer({ event }: { event: ActivityEvent }) {
  const { kind, label } = event.footer;

  if (kind === 'attendees') {
    return (
      <View style={styles.footerLeft}>
        <View style={styles.avatars}>
          <View style={[styles.mini, { backgroundColor: '#DBEAFE' }]} />
          <View style={[styles.mini, styles.miniOverlap, { backgroundColor: '#FDE68A' }]} />
        </View>
        <Text style={styles.footerText}>{label}</Text>
      </View>
    );
  }

  const Icon = kind === 'likes' ? Heart : Gift;
  return (
    <View style={styles.footerLeft}>
      <Icon size={14} color="#F97316" />
      <Text style={styles.footerText}>{label}</Text>
    </View>
  );
}

export default function EventCard({ event, onPressDetail }: Props) {
  const VenueIcon = VENUE_ICON[event.venue.kind];

  return (
    <View style={styles.card}>
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: event.bannerColor }]}>
        <View style={styles.bannerDeco} />
        <View style={styles.bannerTop}>
          <View style={styles.clubRow}>
            <View style={styles.clubBar} />
            <Text style={styles.club}>{event.club}</Text>
          </View>
          <View style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: STATUS_DOT[event.status] }]} />
            <Text style={styles.badgeText}>{STATUS_LABEL[event.status]}</Text>
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.locationRow}>
          <Building2 size={13} color="#D1FAE5" />
          <Text style={styles.location}>{event.bannerLocation}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={[styles.dateBox, { backgroundColor: event.dateBoxBg }]}>
          <Text style={[styles.day, { color: event.dateBoxColor }]}>{event.day}</Text>
          <Text style={[styles.month, { color: event.dateBoxColor }]}>{event.month}</Text>
        </View>

        <View style={styles.infoBody}>
          <Text style={styles.organizer} numberOfLines={1}>
            {event.organizer}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Clock size={12} color="#F97316" />
              <Text style={styles.metaText}>{event.time}</Text>
            </View>
            <View style={styles.meta}>
              <VenueIcon size={12} color="#F97316" />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.venue.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <Footer event={event} />
        <Pressable style={styles.detail} onPress={() => onPressDetail?.(event)}>
          <Text style={styles.detailText}>Xem chi tiết</Text>
          <ArrowUpRight size={14} color="#F97316" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  banner: { padding: 16, minHeight: 150, overflow: 'hidden' },
  bannerDeco: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clubRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clubBar: { width: 3, height: 12, borderRadius: 2, backgroundColor: '#F97316' },
  club: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#1F2937' },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 12 },
  location: { color: '#D1FAE5', fontSize: 11, fontWeight: '600' },

  info: { flexDirection: 'row', gap: 12, padding: 14 },
  dateBox: {
    width: 54,
    height: 58,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: { fontSize: 22, fontWeight: '800', lineHeight: 24 },
  month: { fontSize: 8, fontWeight: '700', marginTop: 2 },
  infoBody: { flex: 1, justifyContent: 'center' },
  organizer: { fontSize: 11, color: '#6B7280' },
  name: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  metaText: { fontSize: 11, color: '#6B7280', flexShrink: 1 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  avatars: { flexDirection: 'row' },
  mini: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#fff' },
  miniOverlap: { marginLeft: -8 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  detailText: { fontSize: 12, fontWeight: '700', color: '#F97316' },
});