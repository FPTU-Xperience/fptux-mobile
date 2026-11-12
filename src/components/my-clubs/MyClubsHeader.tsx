// components/my-clubs/MyClubsHeader.tsx
import { ArrowUpRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { onExplore: () => void };

export default function MyClubsHeader({ onExplore }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>KHÔNG GIAN CỦA BẠN</Text>

      <View style={styles.row}>
        <Text style={styles.title}>Câu lạc bộ của tôi</Text>
        <Pressable style={styles.button} onPress={onExplore}>
          <Text style={styles.buttonText}>Khám phá thêm</Text>
          <ArrowUpRight size={14} color="#374151" />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Mỗi cộng đồng, một phần trong hành trình của bạn.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 16 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#F97316', letterSpacing: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 6,
  },
  title: { flex: 1, fontSize: 26, fontWeight: '800', color: '#111827', lineHeight: 32 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  subtitle: { fontSize: 13, lineHeight: 19, color: '#6B7280', marginTop: 6 },
});