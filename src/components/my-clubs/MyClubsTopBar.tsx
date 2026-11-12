// components/my-clubs/MyClubsTopBar.tsx
import { Bell, ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = { onBack: () => void };

export default function MyClubsTopBar({ onBack }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.row}>
        <Pressable style={styles.side} onPress={onBack} hitSlop={8}>
          <ChevronLeft size={20} color="#374151" />
          <Text style={styles.back}>Quay lại</Text>
        </Pressable>

        <Text style={styles.title}>CLUBHUB FPTU</Text>

        <View style={[styles.side, styles.right]}>
          <Bell size={20} color="#374151" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  side: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
  right: { justifyContent: 'flex-end' },
  back: { fontSize: 13, fontWeight: '600', color: '#374151' },
  title: { fontSize: 12, fontWeight: '800', color: '#6B7280', letterSpacing: 1 },
});