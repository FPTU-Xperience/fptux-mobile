// services/uiDerive.ts
//
// Helpers biến đổi dữ liệu API (DTO camelCase) thành các field TRANG TRÍ mà
// UI cần nhưng API không trả về (bannerColor, dateBoxBg, iconKind, ...).
// Mọi hàm deterministic: cùng input → cùng output, để UI ổn định giữa các lần render.
//
// Nguyên tắc (Phase 3): không bịa dữ liệu. Chỉ sinh màu/icon từ code thật;
// số liệu (count, thời gian...) luôn lấy từ API hoặc để rỗng có chủ đích.

import type { ActivityStatus } from '@/types/activity';

// Palettes tái dùng từ mock (giữ tone brand, deterministic theo code).
export interface DecorPalette {
  banner: string;
  dateBoxBg: string;
  dateBoxColor: string;
  logoBg: string;
  iconBg: string;
}

const PALETTES: DecorPalette[] = [
  { banner: '#0F6B6B', dateBoxBg: '#CDEFFA', dateBoxColor: '#0E7490', logoBg: '#1E2A4A', iconBg: '#F97316' },
  { banner: '#9A4A22', dateBoxBg: '#FFE4D6', dateBoxColor: '#C2410C', logoBg: '#4A1E1E', iconBg: '#B7311F' },
  { banner: '#5B3F8F', dateBoxBg: '#E3ECFB', dateBoxColor: '#1D4ED8', logoBg: '#2A1E4A', iconBg: '#5B3F9E' },
  { banner: '#0B3B3F', dateBoxBg: '#DCFCE7', dateBoxColor: '#15803D', logoBg: '#134E4A', iconBg: '#115E73' },
  { banner: '#1E3A5F', dateBoxBg: '#EDE9FE', dateBoxColor: '#6D28D9', logoBg: '#1E2A4A', iconBg: '#F97316' },
  { banner: '#0F5E5E', dateBoxBg: '#FFF7ED', dateBoxColor: '#C2410C', logoBg: '#1E2A4A', iconBg: '#0F766E' },
];

/** Hash ổn định (djb2) từ chuỗi → index mảng. */
function hashToIndex(input: string, size: number): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
    h = h >>> 0; // giữ unsigned
  }
  return h % size;
}

/** Chọn palette trang trí theo code (CLB / hoạt động). */
export function decorFor(code: string): DecorPalette {
  const key = code.trim().toUpperCase() || 'CLB';
  return PALETTES[hashToIndex(key, PALETTES.length)];
}

export interface FormattedTimes {
  /** "15" (ngày) */
  day: string;
  /** "11" (số tháng) — dùng cho date box */
  month: string;
  /** "THÁNG 11" (dòng tháng cho EventCard) */
  monthLabel: string;
  /** "T11" (tháng tắt cho thẻ CLB) */
  monthShort: string;
  /** "08:00 - 18:00" */
  time: string;
  /** "12/11/2026" */
  date: string;
  /** "08:00 15/11/2026" (summary chi tiết) */
  timeSummary: string;
  /** "08:00:00" (detail start) */
  startTime: string;
  /** "18:00:00" (detail end) */
  endTime: string;
  /** "15/11/2026" (detail startAt.date) */
  startDate: string;
  endDate: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const MONTHS_VN = ['THÁNG 01', 'THÁNG 02', 'THÁNG 03', 'THÁNG 04', 'THÁNG 05', 'THÁNG 06',
  'THÁNG 07', 'THÁNG 08', 'THÁNG 09', 'THÁNG 10', 'THÁNG 11', 'THÁNG 12'];

/**
 * Parse 2 ISO-UTC → tập date/time hiển thị (giờ device, FPTU = UTC+7).
 * Dùng `new Date(iso)` — với người dùng VN, giờ local chính là UTC+7.
 */
export function formatTimes(startIso: string, endIso: string): FormattedTimes {
  const s = new Date(startIso);
  const e = new Date(endIso);

  const timeOf = (d: Date, withSec: boolean) =>
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}${withSec ? `:${pad2(d.getSeconds())}` : ''}`;
  const dateOf = (d: Date) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

  const day = pad2(s.getDate());
  const monthNum = String(s.getMonth() + 1).padStart(2, '0');

  return {
    day,
    month: monthNum,
    monthLabel: MONTHS_VN[s.getMonth()],
    monthShort: `T${s.getMonth() + 1}`,
    time: `${timeOf(s, false)} - ${timeOf(e, false)}`,
    date: dateOf(s),
    timeSummary: `${timeOf(s, false)} ${dateOf(s)}`,
    startTime: timeOf(s, true),
    endTime: timeOf(e, true),
    startDate: dateOf(s),
    endDate: dateOf(e),
  };
}

/**
 * Map `StudentActivityItem.status` (UPCOMING|LIVE|COMPLETED|...) → UI ActivityStatus.
 */
export function toActivityStatus(status: string): ActivityStatus {
  const up = status.trim().toUpperCase();
  if (up === 'LIVE' || up === 'ONGOING' || up === 'IN_PROGRESS') return 'ongoing';
  if (up === 'COMPLETED' || up === 'ENDED' || up === 'CANCELLED') return 'ended';
  return 'upcoming';
}

/** Lấy initials (tối đa 2 chữ cái) từ tên đầy đủ — cho leader avatar. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
