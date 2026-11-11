// components/schedule/EmptySchedule.tsx
import { Compass, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPressExplore?: () => void;
};

export default function EmptySchedule({
  title = 'Lịch trình tuần này đang trống',
  description = 'Bạn chưa đăng ký hoạt động nào cho những ngày tới. Hãy khám phá và ghi dấu trải nghiệm ngay!',
  buttonLabel = 'Xem tất cả hoạt động',
  onPressExplore,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Compass size={22} color="#6B7280" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
      <Pressable style={styles.button} onPress={onPressExplore}>
        <Search size={14} color="#C2410C" />
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 14 },
  desc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: '#FFE4D6',
  },
  buttonText: { fontSize: 13, fontWeight: '700', color: '#C2410C' },
});