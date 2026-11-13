// services/scan.ts
//
// Nguồn dữ liệu thật cho luồng quét mã QR / điểm danh.
//
// LƯU Ý: service này được tạo ở Phase 3 nhưng `scan.tsx` CHƯA được nối
// (màn vẫn dùng mockScan) — theo scope của phase.
//
// Luồng điểm danh thật (BE):
//   1. QR chứa sessionId + challenge (challenge xoay mỗi 30s).
//   2. POST /api/activities/{activityId}/check-in
//      body: { sessionId, challenge, location?: { latitude, longitude, accuracyMeters } }
//      → 200 { attendanceId, activityId, sessionId, status, ... }
//
// Endpoint GET /api/activities/{id}/sessions/{sessionId}/attendance-challenge yêu cầu
// quyền quản lý CLB (CanManageClubOrReviewAllAsync) → STUDENT KHÔNG gọi được.
// Vì vậy `fetchCheckInChallenge` chỉ dùng cho luồng quản trị, còn luồng của
// sinh viên lấy challenge từ nội dung QR.

import { apiFetch } from '@/services/apiClient';
import type { CheckInResult, Coordinates, PlaceInfo } from '@/types/scan';

/** Response của POST /api/activities/{id}/check-in. */
interface CheckInResponse {
  attendanceId: number;
  activityId: number;
  sessionId: number;
  status: string;
  attendanceStatus: string;
  verificationMethod: string;
  verifiedAt: string | null;
  contributionId: string | null;
  recognitionStatus: string | null;
  version: string;
}

/**
 * Tên địa điểm + hoạt động gần nhất.
 *
 * BE chưa có endpoint reverse-geocode → trả placeholder rỗng, KHÔNG bịa tên địa
 * điểm. UI hiển thị tọa độ thô nếu cần.
 */
export async function fetchPlaceInfo(coords: Coordinates): Promise<PlaceInfo> {
  void coords;
  return { placeName: '', nearestActivity: '' };
}

/**
 * Gửi yêu cầu điểm danh.
 *
 * @param activityId id hoạt động
 * @param sessionId id phiên (từ QR)
 * @param challenge chuỗi challenge trong QR (xoay 30s)
 * @param code mã người dùng nhập tay (nếu có) — dùng làm fallback khi QR không đọc được
 * @param coords tọa độ GPS để kiểm tra geofence
 */
export async function submitCheckIn(
  activityId: number,
  sessionId: number,
  challenge: string,
  coords: Coordinates | null,
): Promise<CheckInResult> {
  if (!Number.isFinite(activityId) || !Number.isFinite(sessionId)) {
    return { success: false, message: 'Hoạt động không hợp lệ.' };
  }

  if (!challenge || challenge.trim().length === 0) {
    return { success: false, message: 'Mã điểm danh không hợp lệ. Vui lòng quét lại mã QR.' };
  }

  const body = {
    sessionId,
    challenge: challenge.trim(),
    location: coords
      ? {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracyMeters: coords.accuracy ?? 0,
        }
      : null,
  };

  // Không catch: apiFetch ném ApiError với message tiếng Việt đã chuẩn hóa
  // (vd "Chưa đăng ký hoạt động", "Mã QR đã hết hạn") → UI hiển thị qua
  // getApiErrorMessage.
  const result = await apiFetch<CheckInResponse>(
    `/api/activities/${activityId}/check-in`,
    { method: 'POST', body },
  );

  return {
    success: true,
    message:
      result.status === 'VERIFIED'
        ? 'Đã ghi nhận điểm danh thành công.'
        : 'Đã gửi yêu cầu điểm danh, đang chờ xác nhận.',
  };
}
