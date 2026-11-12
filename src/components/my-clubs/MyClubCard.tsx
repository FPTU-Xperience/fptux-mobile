// components/my-clubs/MyClubCard.tsx
import { ArrowRight, CalendarDays, ExternalLink } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MyClub } from '@/types/myClubs';

type Props = {
  club: MyClub;
  onEnter: (club: MyClub) => void;
  onPressActivity: (activityId: string) => void;
  onShare: (club: MyClub) => void;
};

const BANNER_HEIGHT = 132;

export default function MyClubCard({ club, onEnter, onPressActivity, onShare }: Props) {
  const activity = club.nextActivity;

  return (
    <View style={styles.card}>
      <View style={[styles.banner, { backgroundColor: club.bannerColor }]}>
        <View style={styles.deco} />
        <Text style={styles.hub}>{club.hubLabel}</Text>
        <Text style={styles.tagline}>{club.tagline}</Text>
      </View>

      <View style={[styles.logo, { backgroundColor: club.logoBg }]}>
        <Text style={styles.logoSmall}>CLUBHUB</Text>
        <Text style={styles.logoCode}>{club.logoCode}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.identity}>
          <View style={styles.role}>
            <Text style={styles.roleText}>{club.role}</Text>
          </View>
          <Text style={styles.name}>{club.name}</Text>
          <Text style={styles.subtitle}>{club.subtitle ?? 'Đơn tham gia đang cập nhật'}</Text>
        </View>

        <View style={styles.divider} />

        <Pressable
          style={styles.activityRow}
          disabled={!activity}
          onPress={() => activity && onPressActivity(activity.id)}>
          <CalendarDays size={16} color="#9CA3AF" />
          <View style={styles.activityBody}>
            <Text style={styles.activityLabel}>HOẠT ĐỘNG SẮP TỚI</Text>
            <Text style={styles.activityValue} numberOfLines={2}>
              {activity ? `${activity.title} · ${activity.date}` : 'Lịch hoạt động đang cập nhật'}
            </Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable style={styles.primary} onPress={() => onEnter(club)}>
            <Text style={styles.primaryText}>Vào không gian CLB</Text>
            <ArrowRight size={16} color="#fff" />
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => onShare(club)}>
            <ExternalLink size={18} color="#4B5563" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  banner: { height: BANNER_HEIGHT, padding: 18, justifyContent: 'center', overflow: 'hidden' },
  deco: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  hub: { fontSize: 10, fontWeight: '800', color: '#5EEAD4', letterSpacing: 1 },
  tagline: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 28, marginTop: 10 },

  logo: {
    position: 'absolute',
    left: 16,
    top: BANNER_HEIGHT - 28,
    width: 60,
    height: 68,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoSmall: { color: '#BFDBFE', fontSize: 7, fontWeight: '800', letterSpacing: 0.6 },
  logoCode: { color: '#fff', fontSize: 22, fontWeight: '800' },

  body: { padding: 16 },
  identity: { marginLeft: 76, minHeight: 56, alignItems: 'flex-start' },
  role: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFEDE0',
  },
  roleText: { fontSize: 11, fontWeight: '700', color: '#C2410C' },
  name: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 8 },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  activityRow: { flexDirection: 'row', gap: 10 },
  activityBody: { flex: 1 },
  activityLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.6 },
  activityValue: { fontSize: 13.5, fontWeight: '800', color: '#111827', marginTop: 3 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primary: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: '#F97316',
  },
  primaryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});