// components/discover/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.box, page === 1 && styles.boxOff]}
        disabled={page === 1}
        onPress={() => onChange(page - 1)}>
        <ChevronLeft size={16} color="#6B7280" />
      </Pressable>

      {pages.map((p) => {
        const active = p === page;
        return (
          <Pressable
            key={p}
            style={[styles.box, active && styles.boxActive]}
            onPress={() => onChange(p)}>
            <Text style={[styles.text, active && styles.textActive]}>{p}</Text>
          </Pressable>
        );
      })}

      <Pressable
        style={[styles.box, page === pageCount && styles.boxOff]}
        disabled={page === pageCount}
        onPress={() => onChange(page + 1)}>
        <ChevronRight size={16} color="#6B7280" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 20 },
  box: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOff: { opacity: 0.4 },
  boxActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  text: { fontSize: 13, fontWeight: '700', color: '#374151' },
  textActive: { color: '#fff' },
});