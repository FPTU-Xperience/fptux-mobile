// components/common/SegmentedControl.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Option<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  selected: T;
  onSelect: (key: T) => void;
};

export default function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = o.key === selected;
        return (
          <Pressable
            key={o.key}
            onPress={() => onSelect(o.key)}
            style={[styles.item, active && styles.itemActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#ECEEF5',
  },
  item: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  itemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  text: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  textActive: { color: '#C2410C' },
});