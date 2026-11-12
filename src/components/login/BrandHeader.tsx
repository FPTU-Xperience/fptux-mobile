// components/login/BrandHeader.tsx
import { GraduationCap } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function BrandHeader() {
  return (
    <View style={styles.wrap}>
      <View style={styles.portal}>
        <GraduationCap size={14} color="#6B7280" />
        <Text style={styles.portalText}>FPTU Xperience · Student Portal</Text>
      </View>

      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.brand}>clubhub.</Text>
      </View>

      <View style={styles.pill}>
        <View style={styles.pillDot} />
        <Text style={styles.pillText}>Dành riêng cho cộng đồng FPTU Hola Campus</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 12 },
  portal: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  portalText: { fontSize: 11.5, fontWeight: '600', color: '#6B7280' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  brand: { fontSize: 36, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFF1E6',
    borderWidth: 1,
    borderColor: '#FDDCC0',
  },
  pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  pillText: { fontSize: 11.5, fontWeight: '600', color: '#7C2D12' },
});