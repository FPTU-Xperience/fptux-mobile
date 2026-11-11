// components/club-detail/ClubSummary.tsx
import { CalendarDays, MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { ClubDetail } from '@/types/clubDetail';

type Props = { club: ClubDetail };

export default function ClubSummary({ club }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.logo, { backgroundColor: club.logoBg }]}>
          <Text style={styles.logoSmall}>CLUBHUB</Text>
          <Text style={styles.logoCode}>{club.logoCode}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{club.category}</Text>
            </View>
            <View style={[styles.tag, styles.tagStatus, !club.recruiting && styles.tagClosed]}>
              <View style={[styles.dot, !club.recruiting && styles.dotClosed]} />
              <Text style={[styles.tagText, styles.tagStatusText, !club.recruiting && styles.tagClosedText]}>
                {club.recruitingLabel}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{club.name}</Text>
          <Text style={styles.slogan}>{club.slogan}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <CalendarDays size={14} color="#F97316" />
        <Text style={styles.metaText}>{club.scheduleSummary}</Text>
      </View>
      <View style={styles.metaRow}>
        <MapPin size={14} color="#F97316" />
        <Text style={[styles.metaText, !club.location && styles.metaEmpty]}>
          {club.location ?? 'Địa điểm đang cập nhật'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: -66,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  top: { flexDirection: 'row', gap: 14 },
  logo: {
    width: 76,
    height: 88,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSmall: { color: '#93C5FD', fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  logoCode: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 2 },

  info: { flex: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EEF0F5',
  },
  tagText: { fontSize: 11, fontWeight: '700', color: '#4B5563' },
  tagStatus: { backgroundColor: '#FFEDE0' },
  tagStatusText: { color: '#C2410C' },
  tagClosed: { backgroundColor: '#F3F4F6' },
  tagClosedText: { color: '#6B7280' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  dotClosed: { backgroundColor: '#9CA3AF' },
  name: { fontSize: 18, fontWeight: '800', color: '#111827', lineHeight: 24, marginTop: 8 },
  slogan: { fontSize: 12.5, color: '#6B7280', marginTop: 4, lineHeight: 18 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  metaText: { fontSize: 13, color: '#374151', fontWeight: '500', flexShrink: 1 },
  metaEmpty: { fontStyle: 'italic', color: '#9CA3AF' },
});