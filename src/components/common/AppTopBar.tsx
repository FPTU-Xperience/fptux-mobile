// components/common/AppTopBar.tsx
import { Bell } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type Props = { title: string };

export default function AppTopBar({ title }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.brandText}>clubhub.</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.right}>
        <View>
          <Bell size={22} color="#374151" />
          <View style={styles.dot} />
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>HC</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  brandText: { fontWeight: '700', fontSize: 14, color: '#111827' },
  title: { fontWeight: '700', fontSize: 16, color: '#111827' },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C2410C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});