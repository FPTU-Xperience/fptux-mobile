// components/common/FilterChips.tsx
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type Filter<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  filters: Filter<T>[];
  selected: T;
  onSelect: (key: T) => void;
};

export default function FilterChips<T extends string>({
  filters,
  selected,
  onSelect,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      {filters.map((f) => {
        const active = f.key === selected;
        return (
          <Pressable
            key={f.key}
            onPress={() => onSelect(f.key)}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginTop: 14 },
  content: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#FFE9D6', borderColor: '#FDBA74' },
  text: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  textActive: { color: '#C2410C' },
});