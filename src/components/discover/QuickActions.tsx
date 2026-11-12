// components/discover/QuickActions.tsx
import { CalendarDays, Compass, Users, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QuickActionIcon, RecoQuickAction } from '@/types/recommendation';

const ICONS: Record<QuickActionIcon, { icon: LucideIcon; bg: string; color: string }> = {
  compass: { icon: Compass, bg: '#FFE9D6', color: '#F97316' },
  calendar: { icon: CalendarDays, bg: '#DDF1FA', color: '#0E7490' },
  users: { icon: Users, bg: '#DCFCE7', color: '#15803D' },
};

type Props = {
  actions: RecoQuickAction[];
  onPress: (action: RecoQuickAction) => void;
};

export default function QuickActions({ actions, onPress }: Props) {
  return (
    <View style={styles.row}>
      {actions.map((a) => {
        const { icon: Icon, bg, color } = ICONS[a.icon];
        return (
          <Pressable key={a.id} style={styles.tile} onPress={() => onPress(a)}>
            <View style={[styles.iconCircle, { backgroundColor: bg }]}>
              <Icon size={18} color={color} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {a.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 14 },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11.5, fontWeight: '700', color: '#374151', textAlign: 'center' },
});