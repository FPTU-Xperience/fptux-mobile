// components/explore/ClubCard.tsx
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Megaphone,
  Music,
  Presentation,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Club, ClubIconKind, TagTone } from '@/types/club';

const ICONS: Record<ClubIconKind, LucideIcon> = {
  presentation: Presentation,
  music: Music,
  megaphone: Megaphone,
};

const TAG_STYLE: Record<TagTone, { bg: string; color: string }> = {
  neutral: { bg: '#E0F2F1', color: '#0F766E' },
  success: { bg: '#DCFCE7', color: '#15803D' },
  warning: { bg: '#FFE4D6', color: '#C2410C' },
};

const BANNER_HEIGHT = 150;
const ICON_SIZE = 56;

type Props = {
  club: Club;
  onPressDetail?: (club: Club) => void;
  onPressBookmark?: (club: Club) => void;
};

export default function ClubCard({ club, onPressDetail, onPressBookmark }: Props) {
  const theme = useTheme();
  const Icon = ICONS[club.iconKind];

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: club.bannerColor }]}>
        <View style={styles.deco} />
        <View style={styles.bannerTop}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{club.categoryLabel}</Text>
          </View>
          <Pressable style={styles.bookmark} onPress={() => onPressBookmark?.(club)}>
            <Bookmark size={16} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.quote}>“{club.quote}”</Text>
      </View>

      {/* Icon nổi */}
      <View style={[styles.iconBox, { backgroundColor: club.iconBg }]}>
        <Icon size={club.iconLabel ? 22 : 28} color="#fff" />
        {club.iconLabel ? <Text style={styles.iconLabel}>{club.iconLabel}</Text> : null}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.tags}>
          {club.tags.map((t) => (
            <View key={t.label} style={[styles.tag, { backgroundColor: TAG_STYLE[t.tone].bg }]}>
              <Text style={[styles.tagText, { color: TAG_STYLE[t.tone].color }]}>{t.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.name, { color: theme.text }]}>{club.name}</Text>

        <View style={styles.scheduleRow}>
          <CalendarDays size={14} color="#F97316" />
          <Text style={styles.schedule}>{club.schedule}</Text>
        </View>

        <Text style={[styles.desc, { color: theme.textSecondary }]}>{club.description}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />

      <View style={styles.footer}>
        <View style={styles.codeRow}>
          <View style={styles.codeDot} />
          <Text style={[styles.code, { color: theme.textSecondary }]}>{club.code}</Text>
        </View>
        <Pressable style={styles.detail} onPress={() => onPressDetail?.(club)}>
          <Text style={styles.detailText}>Khám phá</Text>
          <ArrowUpRight size={14} color="#C2410C" />
        </Pressable>
      </View>
    </View>
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
  banner: { height: BANNER_HEIGHT, padding: 14, overflow: 'hidden' },
  deco: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  categoryText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  bookmark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 64,
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
  },

  iconBox: {
    position: 'absolute',
    left: 14,
    top: BANNER_HEIGHT - ICON_SIZE / 2,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    zIndex: 2,
  },
  iconLabel: { color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },

  body: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    // lệch phải để tránh icon nổi
    marginLeft: ICON_SIZE + 8,
    minHeight: 28,
  },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tagText: { fontSize: 10, fontWeight: '700' },
  name: { fontSize: 17, fontWeight: '800', marginTop: 12, lineHeight: 22 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  schedule: { fontSize: 12, color: '#C2410C', fontWeight: '600', flexShrink: 1 },
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
  detail: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  detailText: { fontSize: 12, fontWeight: '700', color: '#C2410C' },
});