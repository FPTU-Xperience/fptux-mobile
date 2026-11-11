// app/(tabs)/scan.tsx
import { useFocusEffect, useRouter } from 'expo-router';
import { CircleHelp } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import CampusLabel from '@/components/common/CampusLabel';
import ScreenLayout from '@/components/common/ScreenLayout';
import LocationCard from '@/components/scan/LocationCard';
import ManualCodeModal from '@/components/scan/ManualCodeModal';
import ScannerPanel from '@/components/scan/ScannerPanel';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { fetchPlaceInfo, submitCheckIn } from '@/services/mockScan';
import type { Coordinates, PlaceInfo } from '@/types/scan';

export default function ScanScreen() {
  const router = useRouter();

  // Chỉ bật camera + GPS khi tab đang được focus
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
        setTorch(false);
      };
    }, []),
  );

  const location = useCurrentLocation(focused);
  const [place, setPlace] = useState<PlaceInfo | null>(null);
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const lat = location.status === 'synced' ? location.latitude : null;
  const lng = location.status === 'synced' ? location.longitude : null;

  // Tra tên địa điểm (mock) mỗi khi tọa độ thay đổi
  useEffect(() => {
    if (lat === null || lng === null) return;
    let cancelled = false;
    fetchPlaceInfo({ latitude: lat, longitude: lng, accuracy: null }).then((p) => {
      if (!cancelled) setPlace(p);
    });
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  const handleCode = async (code: string) => {
    if (busy) return;
    setBusy(true);

    const coords: Coordinates | null =
      location.status === 'synced'
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
          }
        : null;

    const result = await submitCheckIn(code, coords);
    setManualOpen(false);

    Alert.alert(
      result.success ? 'Điểm danh thành công' : 'Điểm danh thất bại',
      result.message,
      [{ text: 'OK', onPress: () => setBusy(false) }],
      { cancelable: false },
    );
  };

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/activity');
  };

  return (
    <ScreenLayout title="Quét QR">
      <View style={styles.campus}>
        <CampusLabel />
      </View>

      <ScannerPanel
        active={focused}
        scanEnabled={!busy}
        torch={torch}
        onToggleTorch={() => setTorch((v) => !v)}
        onClose={handleClose}
        onScan={handleCode}
      />

      <LocationCard
        location={location}
        place={place}
        onPressManual={() => setManualOpen(true)}
        onOpenSettings={() => Linking.openSettings()}
      />

      <Pressable style={styles.help}>
        <CircleHelp size={14} color="#C2410C" />
        <Text style={styles.helpText}>Cần hỗ trợ?</Text>
      </Pressable>

      <ManualCodeModal
        visible={manualOpen}
        submitting={busy}
        onClose={() => setManualOpen(false)}
        onSubmit={handleCode}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  campus: { paddingHorizontal: 16, paddingTop: 4 },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  helpText: { fontSize: 12, fontWeight: '700', color: '#C2410C' },
});