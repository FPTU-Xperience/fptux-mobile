// components/event-detail/DetailSummary.tsx
import { CalendarDays, Clock, MapPin } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActivityStatus } from '@/types/activity';
import type { ActivityDetail, RegisterState } from '@/types/activityDetail';

const STATUS: Record<ActivityStatus, { label: string; bg: string; color: string }> = {
  upcoming: { label: 'Sắp diễn ra', bg: '#DCFCE7', color: '#15803D' },
  ongoing: { label: 'Đang diễn ra', bg: '#DBEAFE', color: '#1D4ED8' },
  ended: { label: 'Đã kết thúc', bg: '#F3F4F6', color: '#6B7280' },
};

type Props = {
  detail: ActivityDetail;
  register: RegisterState;
  onRegister: () => void;
  onPressClub?: () => void;
};

export default function DetailSummary({ detail, register, onRegister, onPressClub }: Props) {
  const status = STATUS[detail.status];
  const label = register.registered
    ? 'Đã đăng ký'
    : detail.status === 'ended'
      ? 'Đã kết thúc'
      : 'Đăng ký tham gia';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.dateBox}>
          <CalendarDays size={14} color="#0D9488" />
          <Text style={styles.day}>{detail.day}</Text>
          <Text style={styles.monthLabel}>THÁNG</Text>
          <Text style={styles.monthNum}>{detail.month}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>
            <Pressable style={styles.clubButton} onPress={onPressClub}>
              <Text style={styles.clubButtonText}>Đến trang CLB</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{detail.title}</Text>
          <Text style={styles.club}>{detail.clubName}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Clock size={14} color="#F97316" />
        <Text style={styles.metaText}>{detail.timeSummary}</Text>
      </View>
      <View style={styles.metaRow}>
        <MapPin size={14} color="#F97316" />
        <Text style={styles.metaText}>{detail.location}</Text>
      </View>

      {/* <Pressable
        style={[styles.button, (register.disabled || register.registered) && styles.buttonOff]}
        disabled={register.disabled || register.registered || register.loading}
        onPress={onRegister}>
        {register.loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: -64,
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
  dateBox: {
    width: 68,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#99E0D2',
    backgroundColor: '#ECFDF8',
    alignItems: 'center',
  },
  day: { fontSize: 26, fontWeight: '800', color: '#0F766E', lineHeight: 30, marginTop: 2 },
  monthLabel: { fontSize: 9, fontWeight: '800', color: '#0F766E', letterSpacing: 0.5 },
  monthNum: { fontSize: 10, fontWeight: '800', color: '#0F766E' },

  info: { flex: 1 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  clubButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clubButtonText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', lineHeight: 24, marginTop: 8 },
  club: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  metaText: { fontSize: 13, color: '#374151', fontWeight: '500', flexShrink: 1 },

  button: {
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOff: { backgroundColor: '#FDBA74' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});