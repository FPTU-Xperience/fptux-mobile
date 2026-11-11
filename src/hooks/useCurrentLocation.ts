// hooks/useCurrentLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { LocationState } from '@/types/scan';

/**
 * Theo dõi vị trí GPS thật của thiết bị.
 * Truyền `enabled = false` để dừng theo dõi (vd: khi tab không còn được focus).
 */
export function useCurrentLocation(enabled: boolean): LocationState {
  const [state, setState] = useState<LocationState>({ status: 'idle' });

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      setState({ status: 'requesting' });

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;

        if (status !== 'granted') {
          setState({ status: 'denied' });
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 5,
            timeInterval: 5000,
          },
          (loc) => {
            if (cancelled) return;
            setState({
              status: 'synced',
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy,
            });
          },
        );

        // Hủy trong lúc đang chờ subscribe
        if (cancelled) subscription.remove();
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);

  return state;
}