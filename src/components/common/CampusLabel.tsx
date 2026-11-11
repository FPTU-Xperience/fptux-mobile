// components/common/CampusLabel.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = { campus?: string };

export default function CampusLabel({ campus = 'FPTU HÀ NỘI - HOLA' }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.bar} />
      <Text style={styles.text}>{campus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bar: { width: 3, height: 12, borderRadius: 2, backgroundColor: '#F97316' },
  text: { fontSize: 11, fontWeight: '600', color: '#6B7280', letterSpacing: 0.3 },
});