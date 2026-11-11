// components/common/SectionHeader.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  /** Chữ nhỏ màu cam bên phải, vd: "2 sự kiện" */
  right?: string;
};

export default function SectionHeader({ title, right }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {right ? <Text style={styles.right}>{right}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  title: { fontSize: 11, fontWeight: '800', color: '#374151', letterSpacing: 0.8 },
  right: { fontSize: 11, fontWeight: '700', color: '#F97316' },
});