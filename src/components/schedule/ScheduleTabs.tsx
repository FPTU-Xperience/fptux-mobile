// components/schedule/ScheduleTabs.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Tab<T extends string> = { key: T; label: string; count?: number };

type Props<T extends string> = {
  tabs: Tab<T>[];
  selected: T;
  onSelect: (key: T) => void;
};

export default function ScheduleTabs<T extends string>({ tabs, selected, onSelect }: Props<T>) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => {
        const active = t.key === selected;
        return (
          <Pressable
            key={t.key}
            onPress={() => onSelect(t.key)}
            style={[styles.tab, active && styles.tabActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{t.label}</Text>
            {t.count !== undefined && (
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{t.count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#F97316' },
  label: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  labelActive: { color: '#111827' },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: '#FFE4D6' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#4F46E5' },
  badgeTextActive: { color: '#C2410C' },
});