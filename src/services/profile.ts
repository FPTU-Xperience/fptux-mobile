// services/profile.ts
//
// Nguồn dữ liệu thật cho màn Hồ sơ (profile).
//
// - Người dùng:  GET /api/users/me                      → UserSummary
// - Trải nghiệm: GET /api/users/me/experience-summary   → ExperienceSummary
// - Radar 6 trục: GET /api/v1/declarations/me/radar     → StudentRadar
//
// LƯU Ý: service này được tạo ở Phase 3 nhưng `profile.tsx` CHƯA được nối
// (màn vẫn dùng mockProfile) — theo scope của phase. Giữ nguyên chữ ký
// `fetchProfile()` để màn có thể nối sau mà không phải sửa lại.

import { apiFetch } from '@/services/apiClient';
import { initialsOf } from '@/services/uiDerive';
import type {
  ExperienceSummary,
  PillarRadarItem,
  StudentRadar,
  UserSummary,
} from '@/types/api';
import type { Competency, ProfileFeed, ProfileStat, ProfileUser } from '@/types/profile';

/** Nhãn tiếng Việt cho 6 trục radar (CoreSix). */
const PILLAR_LABEL: Record<string, string> = {
  Academic: '1. Học tập',
  Research: '2. Nghiên cứu',
  Global: '3. Quốc tế',
  CultureSports: '4. Thể thao & VH',
  Community: '5. Cộng đồng',
  Entrepreneurship: '6. Khởi nghiệp',
};

/** Nhãn tiếng Việt cho trục "+1" (RealWorldWork). */
const PLUS_ONE_LABEL = '7. Thực chiến';

const UNKNOWN = '--';

/** Format số thập phân 1 chữ số (ERI). */
function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) return '0.0';
  return value.toFixed(1);
}

/**
 * Tính độ sâu / độ đều / hệ số từ 6 trục radar.
 *
 * - depth: trung bình điểm bão hòa (0-100)
 * - evenness: độ đều giữa các trục (0-1) — dùng hệ số biến thiên
 * - factor: hệ số nhân tổng hợp (0-1.2)
 */
function deriveCompetency(radar: StudentRadar | null): Competency {
  const axes = (radar?.radarAxes ?? []).map((p: PillarRadarItem) => ({
    label: PILLAR_LABEL[p.pillar] ?? p.pillar,
    value: Math.round(p.saturatedScore),
  }));

  const values = axes.map((a) => a.value);

  if (values.length === 0) {
    return {
      quote: 'Hành trình của bạn không chỉ được đo bằng điểm số',
      axes: [],
      depth: 0,
      evenness: 0,
      factor: 0,
      note: 'Chỉ số ERI được tính toán tự động dựa trên độ sâu, độ đều và tính xác thực của các minh chứng hoạt động đã tham gia.',
    };
  }

  const depth = values.reduce((sum, v) => sum + v, 0) / values.length;

  const mean = depth;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  // Độ đều = 1 khi tất cả trục bằng nhau, giảm dần khi phân tán rộng.
  const evenness = mean > 0 ? Math.max(0, Math.min(1, 1 - stdDev / mean)) : 0;

  // Hệ số: cân bằng giữa độ sâu và độ đều.
  const factor = (depth / 100) * (0.6 + 0.4 * evenness);

  const plusOne = radar?.plusOne;
  const allAxes = plusOne
    ? [...axes, { label: PLUS_ONE_LABEL, value: Math.round(plusOne.saturatedScore) }]
    : axes;

  return {
    quote: 'Hành trình của bạn không chỉ được đo bằng điểm số',
    axes: allAxes,
    depth: Math.round(depth),
    evenness: Number(evenness.toFixed(2)),
    factor: Number(factor.toFixed(2)),
    note: 'Chỉ số ERI được tính toán tự động dựa trên độ sâu, độ đều và tính xác thực của các minh chứng hoạt động đã tham gia.',
  };
}

/**
 * GET /api/users/me + /api/users/me/experience-summary + /api/v1/declarations/me/radar
 *
 * Radar và summary có thể lỗi (chưa có chính sách điểm được duyệt) → bắt riêng,
 * để hồ sơ vẫn hiện được phần thông tin cơ bản thay vì trắng toàn bộ.
 */
export async function fetchProfile(campus = ''): Promise<ProfileFeed> {
  const [me, summary, radar] = await Promise.all([
    apiFetch<UserSummary>('/api/users/me'),
    apiFetch<ExperienceSummary>('/api/users/me/experience-summary').catch(() => null),
    apiFetch<StudentRadar>('/api/v1/declarations/me/radar').catch(() => null),
  ]);

  const user: ProfileUser = {
    name: me.fullName || me.username,
    initials: initialsOf(me.fullName || me.username),
    plan: 'Pro',
    statusLabel: radar?.profileTitle ?? UNKNOWN,
    major: UNKNOWN,
    cohort: radar?.semesterCode ?? UNKNOWN,
    campusCode: me.campusCode ?? 'HAN',
    university: 'FPTU Hà Nội',
    campusName: 'Campus Hòa Lạc',
    bio: '',
    coverText: 'Make your time\nmean something.',
  };

  const stats: ProfileStat[] = [
    {
      id: 'eri',
      label: 'Chỉ số ERI',
      value: formatDecimal(radar?.eri ?? 0),
      hint: `Xếp hạng Hola: ${radar?.profileTitle ?? UNKNOWN}`,
      iconKind: 'zap',
    },
    {
      id: 'xp',
      label: 'Xperience Point',
      value: String(summary?.rawExperiencePoints ?? 0),
      hint: 'Điểm tích lũy trọn',
      iconKind: 'star',
    },
    {
      id: 'attendance',
      label: 'Lượt điểm danh',
      value: String(summary?.verifiedAttendanceCount ?? 0),
      hint: 'Qua quét mã QR',
      iconKind: 'check',
    },
    {
      id: 'clubs',
      label: 'CLB tham gia',
      value: String(summary?.approvedClubCount ?? 0),
      hint: 'Đang sinh hoạt',
      iconKind: 'users',
    },
  ];

  return {
    campus: campus || 'FPTU HÀ NỘI - HOLA',
    user,
    stats,
    competency: deriveCompetency(radar),
    skills: [],
    clubs: [],
    menu: [
      { id: 'm1', label: 'Câu lạc bộ của tôi', count: summary?.approvedClubCount ?? 0, iconKind: 'flag' },
      { id: 'm2', label: 'Lịch học & Sự kiện đã lưu', iconKind: 'calendar' },
      { id: 'm3', label: 'Trải nghiệm cá nhân & Minh chứng', iconKind: 'trophy' },
    ],
    evidences: [],
  };
}
