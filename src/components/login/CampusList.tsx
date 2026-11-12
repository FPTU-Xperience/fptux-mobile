// components/login/CampusList.tsx
import { MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type Props = { campuses: string[] };

export default function CampusList({ campuses }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <MapPin size={13} color="#6B7280" />
        <Text style={styles.title}>HỆ THỐNG FPT UNIVERSITY ÁP DỤNG</Text>
      </View>

      <View style={styles.chips}>
        {campuses.map((c) => (
          <View key={c} style={styles.chip}>
            <Text style={styles.chipText}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 26 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.8 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
});