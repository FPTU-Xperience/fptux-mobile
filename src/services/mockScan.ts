// services/mockScan.ts
import type { CheckInResult, Coordinates, PlaceInfo } from '@/types/scan';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Giả lập API đổi tọa độ GPS thành tên địa điểm + hoạt động gần nhất.
 * Sau này thay bằng API thật, giữ nguyên chữ ký hàm.
 */
export async function fetchPlaceInfo(_coords: Coordinates): Promise<PlaceInfo> {
  await wait(300);
  return {
    placeName: 'Sảnh Innovation, Hola Campus',
    nearestActivity: 'Hackathon Hola Codefest 2024',
  };
}

/** Giả lập API điểm danh bằng mã QR / mã nhập tay. */
export async function submitCheckIn(
  code: string,
  _coords: Coordinates | null,
): Promise<CheckInResult> {
  await wait(600);

  if (code.trim().length < 4) {
    return { success: false, message: 'Mã điểm danh không hợp lệ. Vui lòng thử lại.' };
  }
  return {
    success: true,
    message: `Đã ghi nhận điểm danh với mã "${code.trim()}".`,
  };
}