// components/event-detail/DetailTabs.tsx
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type Tab<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  tabs: Tab<T>[];
  selected: T;
  onSelect: (key: T) => void;
};

export default function DetailTabs<T extends string>({ tabs, selected, onSelect }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      {tabs.map((t) => {
        const active = t.key === selected;
        return (
          <Pressable
            key={t.key}
            onPress={() => onSelect(t.key)}
            style={[styles.tab, active && styles.tabActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: { paddingHorizontal: 16, gap: 22 },
  tab: {
    paddingBottom: 10,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#F97316' },
  label: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  labelActive: { color: '#F97316', fontWeight: '800' },
});