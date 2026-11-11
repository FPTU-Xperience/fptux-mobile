// components/profile/ManageMenu.tsx
import {
  CalendarDays,
  ChevronRight,
  Flag,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { MenuIconKind, ProfileMenuItem } from '@/types/profile';

const ICONS: Record<MenuIconKind, { icon: LucideIcon; bg: string; color: string }> = {
  flag: { icon: Flag, bg: '#FFE9D6', color: '#F97316' },
  calendar: { icon: CalendarDays, bg: '#DDF1FA', color: '#0E7490' },
  trophy: { icon: Trophy, bg: '#FFE9D6', color: '#F97316' },
};

type Props = {
  items: ProfileMenuItem[];
  onPressItem?: (item: ProfileMenuItem) => void;
};

export default function ManageMenu({ items, onPressItem }: Props) {
  return (
    <Card>
      <Text style={styles.heading}>QUẢN LÝ TRẢI NGHIỆM CÁ NHÂN</Text>
      <View style={styles.list}>
        {items.map((item) => {
          const { icon: Icon, bg, color } = ICONS[item.iconKind];
          return (
            <Pressable key={item.id} style={styles.row} onPress={() => onPressItem?.(item)}>
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Icon size={18} color={color} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
                {item.count !== undefined ? ` (${item.count})` : ''}
              </Text>
              <ChevronRight size={18} color="#6B7280" />
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 10.5, fontWeight: '800', color: '#6B7280', letterSpacing: 0.8 },
  list: { marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111827' },
});