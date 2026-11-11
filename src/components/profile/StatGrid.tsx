// components/profile/StatGrid.tsx
import { CheckCircle2, Star, Users, Zap, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { ProfileStat, StatIconKind } from '@/types/profile';

const ICONS: Record<StatIconKind, { icon: LucideIcon; color: string }> = {
  zap: { icon: Zap, color: '#F97316' },
  star: { icon: Star, color: '#F97316' },
  check: { icon: CheckCircle2, color: '#0D9488' },
  users: { icon: Users, color: '#4F46E5' },
};

type Props = { stats: ProfileStat[] };

export default function StatGrid({ stats }: Props) {
  return (
    <View style={styles.grid}>
      {stats.map((s) => {
        const { icon: Icon, color } = ICONS[s.iconKind];
        return (
          <View key={s.id} style={styles.card}>
            <View style={styles.top}>
              <Text style={styles.label}>{s.label}</Text>
              <Icon size={16} color={color} />
            </View>
            <Text style={styles.value}>{s.value}</Text>
            <Text style={styles.hint}>{s.hint}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    flexBasis: '48%',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 12, fontWeight: '700', color: '#374151' },
  value: { fontSize: 30, fontWeight: '800', color: '#111827', marginTop: 8 },
  hint: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
});