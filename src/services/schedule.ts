// services/schedule.ts
//
// Nguồn dữ liệu thật cho màn Lịch trình.
//
// - Sắp diễn ra: GET /api/v2/activities/feed?status=UPCOMING&pageSize=30
//
// Chia 2 nhóm theo thời gian bắt đầu:
//   - upcomingThisWeek: trong 7 ngày tới
//   - upcomingNextWeek: ngày thứ 8 → 30
//
// `attended` để rỗng trong phase này: chưa có nguồn API liệt kê lịch sử điểm danh
// xuyên suốt các hoạt động (my-attendance là per-activity). UI hiện empty state,
// không bịa dữ liệu.

import { apiFetch, toQuery } from '@/services/apiClient';
import { decorFor } from '@/services/uiDerive';
import type { ScheduleEvent, ScheduleFeed } from '@/types/schedule';
import type { StudentActivityItem, StudentActivityPage } from '@/types/api';

const CAMPUS_FALLBACK = 'FPTU HÀ NỘI - HOLA';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const HORIZON_MS = 30 * DAY_MS;

/** Thứ trong tuần (vi) — dùng cho nhãn "TH 11" (ngày). */
const WEEKDAY_VN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const pad = (n: number) => String(n).padStart(2, '0');

/** StudentActivityItem → ScheduleEvent của UI. */
function toScheduleEvent(item: StudentActivityItem): ScheduleEvent {
  const decor = decorFor(item.clubCode || item.clubName || String(item.id));
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  return {
    id: String(item.id),
    day: pad(start.getDate()),
    // "TH 11" = thứ trong tuần + ngày trong tháng.
    month: `${WEEKDAY_VN[start.getDay()]} ${start.getDate()}`,
    dateBoxBg: decor.dateBoxBg,
    dateBoxColor: decor.dateBoxColor,
    club: item.clubName || item.clubCode || '',
    category: item.clubCode || 'Hoạt động',
    name: item.title,
    time: `${hhmm(start)} - ${hhmm(end)}`,
    venue: item.location || '',
    // Đã đăng ký → vé đã xác nhận; chưa đăng ký → chờ check-in.
    status: item.isRegistered ? 'confirmed' : 'pending',
    action: item.isRegistered ? 'qr' : 'ticket',
  };
}

/** GET /api/v2/activities/feed?status=UPCOMING */
export async function fetchSchedule(campus = ''): Promise<ScheduleFeed> {
  const query = toQuery({ status: 'UPCOMING', page: 1, pageSize: 30 });
  const page = await apiFetch<StudentActivityPage>(
    `/api/v2/activities/feed${query}`,
  );

  const now = Date.now();
  const thisWeek: ScheduleEvent[] = [];
  const nextWeek: ScheduleEvent[] = [];

  for (const item of page.items ?? []) {
    const start = new Date(item.startTime).getTime();
    const diff = start - now;
    if (diff < 0) continue; // đã qua → không hiện ở "sắp tới"

    if (diff <= WEEK_MS) thisWeek.push(toScheduleEvent(item));
    else if (diff <= HORIZON_MS) nextWeek.push(toScheduleEvent(item));
  }

  return {
    campus: campus || CAMPUS_FALLBACK,
    upcomingThisWeek: thisWeek,
    upcomingNextWeek: nextWeek,
    attended: [],
  };
}
