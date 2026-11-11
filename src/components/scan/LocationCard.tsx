// components/scan/LocationCard.tsx
import { Keyboard, LocateFixed, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LocationState, PlaceInfo } from '@/types/scan';

type Props = {
  location: LocationState;
  place: PlaceInfo | null;
  onPressManual: () => void;
  onOpenSettings: () => void;
};

const BADGE = {
  idle: { label: 'Chưa định vị', bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
  requesting: { label: 'Đang định vị...', bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B' },
  synced: { label: 'Đã đồng bộ GPS', bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
  denied: { label: 'Chưa cấp quyền', bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  error: { label: 'Lỗi GPS', bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
} as const;

export default function LocationCard({ location, place, onPressManual, onOpenSettings }: Props) {
  const badge = BADGE[location.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.pin}>
          <MapPin size={20} color="#F97316" />
        </View>

        <View style={styles.body}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Vị trí hiện tại</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <View style={[styles.badgeDot, { backgroundColor: badge.dot }]} />
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>

          {location.status === 'synced' ? (
            <>
              <Text style={styles.place} numberOfLines={1}>
                {place?.placeName ?? 'Đang tra cứu địa điểm...'}
              </Text>
              <View style={styles.coordRow}>
                <LocateFixed size={12} color="#6B7280" />
                <Text style={styles.coords}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  {location.accuracy != null ? `  ·  ±${Math.round(location.accuracy)} m` : ''}
                </Text>
              </View>
            </>
          ) : location.status === 'denied' ? (
            <>
              <Text style={styles.place}>Chưa cấp quyền vị trí</Text>
              <Pressable onPress={onOpenSettings}>
                <Text style={styles.link}>Mở cài đặt để cấp quyền</Text>
              </Pressable>
            </>
          ) : location.status === 'error' ? (
            <Text style={styles.place}>Không lấy được vị trí. Hãy bật GPS.</Text>
          ) : (
            <Text style={styles.place}>Đang xác định vị trí...</Text>
          )}
        </View>
      </View>

      {location.status === 'synced' && place && (
        <Text style={styles.nearest} numberOfLines={1}>
          <Text style={styles.nearestLabel}>Hoạt động gần nhất: </Text>
          {place.nearestActivity}
        </Text>
      )}

      <Pressable style={styles.button} onPress={onPressManual}>
        <Keyboard size={16} color="#1D4ED8" />
        <Text style={styles.buttonText}>Nhập mã điểm danh thủ công</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 28,
    marginTop: -34,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  topRow: { flexDirection: 'row', gap: 12 },
  pin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFE9D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  label: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 9.5, fontWeight: '700' },
  place: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 3 },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  coords: { fontSize: 11, color: '#6B7280', fontVariant: ['tabular-nums'] },
  link: { fontSize: 12, fontWeight: '700', color: '#F97316', marginTop: 3 },

  nearest: { fontSize: 12, color: '#374151', marginTop: 10 },
  nearestLabel: { fontWeight: '800', color: '#C2410C' },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  buttonText: { fontSize: 13, fontWeight: '800', color: '#1D4ED8' },
});