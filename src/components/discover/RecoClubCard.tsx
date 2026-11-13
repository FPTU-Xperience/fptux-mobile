// components/discover/RecoClubCard.tsx
import { CalendarDays, ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { RecoClub } from '@/types/recommendation';

const BANNER_HEIGHT = 120;
const LOGO_W = 56;
const LOGO_H = 62;

type Props = {
  club: RecoClub;
  onPress: (club: RecoClub) => void;
};

export default function RecoClubCard({ club, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.background }]} onPress={() => onPress(club)}>
      <View style={[styles.banner, { backgroundColor: club.bannerColor }]}>
        <View style={styles.deco} />
        <Text style={styles.hub}>{club.hubLabel}</Text>
        <Text style={styles.tagline}>{club.tagline}</Text>
      </View>

      <View style={[styles.logo, { backgroundColor: club.logoBg }]}>
        <Text style={styles.logoText}>{club.logoText}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{club.categoryLabel}</Text>
          </View>
          <View style={[styles.tag, club.recruiting ? styles.tagOpen : styles.tagClosed]}>
            <View style={[styles.dot, !club.recruiting && styles.dotClosed]} />
            <Text style={[styles.tagText, club.recruiting ? styles.tagOpenText : styles.tagClosedText]}>
              {club.recruitingLabel}
            </Text>
          </View>
        </View>

        <Text style={[styles.name, { color: theme.text }]}>{club.name}</Text>

        <View style={styles.scheduleRow}>
          <CalendarDays size={13} color="#F97316" />
          <Text
            style={[
              styles.schedule,
              !club.schedule && styles.scheduleEmpty,
              !club.schedule && { color: theme.textSecondary },
            ]}>
            {club.schedule ?? 'Lịch sinh hoạt đang cập nhật'}
          </Text>
        </View>

        <Text style={[styles.desc, { color: theme.textSecondary }]} numberOfLines={3}>
          {club.description}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />
      <View style={styles.footer}>
        <View style={styles.codeRow}>
          <View style={styles.codeDot} />
          <Text style={[styles.code, { color: theme.textSecondary }]}>{club.code}</Text>
        </View>
        <View style={styles.more}>
          <Text style={styles.moreText}>Khám phá</Text>
          <ChevronDown size={14} color="#C2410C" />
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
  banner: { height: BANNER_HEIGHT, padding: 16, justifyContent: 'center', overflow: 'hidden' },
  deco: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  hub: { fontSize: 9.5, fontWeight: '800', color: '#5EEAD4', letterSpacing: 1 },
  tagline: { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 25, marginTop: 8 },

  logo: {
    position: 'absolute',
    left: 14,
    top: BANNER_HEIGHT - 26,
    width: LOGO_W,
    height: LOGO_H,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  body: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: LOGO_W + 8,
    minHeight: 28,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E0F2F1',
  },
  tagText: { fontSize: 10.5, fontWeight: '700', color: '#0F766E' },
  tagOpen: { backgroundColor: '#FFEDE0' },
  tagOpenText: { color: '#C2410C' },
  tagClosed: { backgroundColor: '#F3F4F6' },
  tagClosedText: { color: '#6B7280' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  dotClosed: { backgroundColor: '#9CA3AF' },

  name: { fontSize: 17, fontWeight: '800', lineHeight: 22, marginTop: 10 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  schedule: { fontSize: 12, fontWeight: '600', color: '#C2410C', flexShrink: 1 },
  scheduleEmpty: { fontStyle: 'italic', fontWeight: '500' },
  desc: { fontSize: 12.5, lineHeight: 18, marginTop: 8 },

  divider: { height: 1, marginHorizontal: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  codeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' },
  code: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  moreText: { fontSize: 12, fontWeight: '800', color: '#C2410C' },
});