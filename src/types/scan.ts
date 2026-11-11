// types/scan.ts
export interface Coordinates {
  latitude: number;
  longitude: number;
  /** Sai số tính bằng mét, có thể null */
  accuracy: number | null;
}

export type LocationState =
  | { status: 'idle' | 'requesting' | 'denied' | 'error' }
  | ({ status: 'synced' } & Coordinates);

export interface PlaceInfo {
  placeName: string;
  nearestActivity: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
}