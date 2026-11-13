// services/activities.ts
//
// Nguồn dữ liệu thật cho hoạt động (activities) qua FPTU ClubHub API Gateway.
//
// - Feed:  GET  /api/v2/activities/feed?search=&status=&pageSize=
// - Detail:GET  /api/v2/activities/{id}
// - Tài liệu/Media: GET /api/activities/{id}/resources
// - Điểm danh của tôi: GET /api/activities/{id}/my-attendance
// - Đăng ký: POST /api/activities/{id}/participants   (body {} → dùng actor)
// - Hủy đăng ký: POST /api/activities/{id}/registration/cancel
// - Challenge điểm danh: GET /api/activities/{id}/sessions/{sessionId}/attendance-challenge
//
// Service trả về ĐÚNG kiểu UI trong `types/activity.ts` + `types/activityDetail.ts`
// để component không phải đổi. Phần field API không trả (màu banner, icon…)
// được sinh deterministic trong `uiDerive.ts`.

import { apiFetch, toQuery } from '@/services/apiClient';
import {
  decorFor,
  formatTimes,
  toActivityStatus,
  type DecorPalette,
} from '@/services/uiDerive';
import type {
  ActivityEvent,
  ActivityFeed,
  ActivityFilter,
  ActivityStatus,
  FilterKey,
} from '@/types/activity';
import type {
  ActivityDetail,
  AttendanceInfo,
  DocumentItem,
  MediaItem,
} from '@/types/activityDetail';
import type {
  ActivityResourceGallery,
  AttendanceChallengeResponse,
  MyAttendancePage,
  ParticipantResult,
  StudentActivityItem,
  StudentActivityPage,
} from '@/types/api';

const CAMPUS_FALLBACK = 'FPTU HÀ NỘI - HOLA';

/** Filter tĩnh — API không có trường "workshop" nên bỏ nhóm đó. */
const FILTERS: ActivityFilter[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'upcoming', label: 'Sắp diễn ra' },
  { key: 'ongoing', label: 'Đang diễn ra' },
];

/** Map filter UI → status API (feed chỉ hỗ trợ UPCOMING | LIVE). */
function statusForFilter(filter: FilterKey): 'UPCOMING' | 'LIVE' | null {
  if (filter === 'upcoming') return 'UPCOMING';
  if (filter === 'ongoing') return 'LIVE';
  return null;
}

/** Chuyển 1 item API → ActivityEvent của UI. */
function toActivityEvent(item: StudentActivityItem): ActivityEvent {
  const decor: DecorPalette = decorFor(item.clubCode || item.clubName || String(item.id));
  const t = formatTimes(item.startTime, item.endTime);
  const status: ActivityStatus = toActivityStatus(item.status);

  return {
    id: String(item.id),
    club: item.clubName || item.clubCode || 'CLB',
    status,
    // API không có category hữu ích → để 'hackathon' (không dùng để gate UI).
    category: 'hackathon',
    title: item.title,
    bannerLocation: item.location || '',
    bannerColor: decor.banner,
    day: t.day,
    month: t.monthLabel,
    dateBoxBg: decor.dateBoxBg,
    dateBoxColor: decor.dateBoxColor,
    organizer: item.clubName || item.clubCode || '',
    name: item.title,
    time: t.time,
    venue: { kind: 'pin', label: item.location || '' },
    footer: {
      kind: 'attendees',
      label: item.isRegistered ? 'Bạn đã đăng ký' : 'Mở đăng ký',
    },
  };
}

/**
 * GET /api/v2/activities/feed
 * @param keyword từ khoá tìm kiếm (title/description)
 * @param filter all | upcoming | ongoing
 */
export async function fetchActivities(params: {
  keyword?: string;
  filter?: FilterKey;
} = {}): Promise<ActivityFeed> {
  const { keyword = '', filter = 'all' } = params;
  const query = toQuery({
    search: keyword.trim() || null,
    status: statusForFilter(filter),
    page: 1,
    pageSize: 50,
  });

  const page = await apiFetch<StudentActivityPage>(`/api/v2/activities/feed${query}`);

  return {
    campus: CAMPUS_FALLBACK,
    // Semester không nằm ở cấp page → lấy từ item đầu tiên nếu có.
    semester: page.items?.[0]?.semesterId ?? '',
    events: (page.items ?? []).map(toActivityEvent),
    filters: FILTERS,
  };
}

/**
 * GET /api/v2/activities/{id}
 *
 * Quyết định scope #2: tab "Phân công" và "Tuyển dụng" không có nguồn API cho
 * student → trả về mảng rỗng để UI hiện trạng thái "đang cập nhật", KHÔNG bịa data.
 */
export async function fetchActivityDetail(id: string): Promise<ActivityDetail | null> {
  const activityId = Number(id);
  if (!Number.isFinite(activityId)) return null;

  const item = await apiFetch<StudentActivityItem>(`/api/v2/activities/${activityId}`);
  const decor = decorFor(item.clubCode || item.clubName || String(item.id));
  const t = formatTimes(item.startTime, item.endTime);

  return {
    id: String(item.id),
    title: item.title,
    status: toActivityStatus(item.status),
    bannerColor: decor.banner,
    hubLabel: item.clubName || item.clubCode || 'CLUBHUB',
    day: t.day,
    month: t.month,
    clubName: item.clubName || item.clubCode || '',
    timeSummary: t.timeSummary,
    startAt: { time: t.startTime, date: t.startDate },
    endAt: { time: t.endTime, date: t.endDate },
    location: item.location || '',
    organizer: item.clubName || item.clubCode || '',
    about: item.description || '',
    contactNote: '',
    // Không có nguồn API cho student → để rỗng, UI hiện empty state.
    recruitment: {
      open: false,
      description: '',
      notice: '',
      visibility: '',
      roles: [],
    },
    assignmentsNote: '',
    assignments: [],
    attendance: {
      count: 0,
      emptyText: 'Bạn chưa có lượt điểm danh trong hoạt động này.',
      sessionHint: 'Nguồn phiên chỉ dành cho người đã đăng ký và còn đủ điều kiện tham gia.',
    },
    documents: [],
    media: [],
  };
}

/**
 * GET /api/activities/{id}/resources → tách tài liệu và media.
 * `kind` của API: IMAGE | VIDEO | DOCUMENT | EMBED.
 */
export async function fetchActivityResources(
  id: string,
): Promise<{ documents: DocumentItem[]; media: MediaItem[] }> {
  const activityId = Number(id);
  if (!Number.isFinite(activityId)) return { documents: [], media: [] };

  const gallery = await apiFetch<ActivityResourceGallery>(
    `/api/activities/${activityId}/resources`,
  );

  const documents: DocumentItem[] = [];
  const media: MediaItem[] = [];

  for (const r of gallery.items ?? []) {
    const kind = (r.kind ?? '').toUpperCase();
    if (kind === 'DOCUMENT' || kind === 'EMBED') {
      documents.push({ id: r.id, name: r.title, meta: r.url });
    } else if (kind === 'IMAGE' || kind === 'VIDEO') {
      media.push({
        id: r.id,
        title: r.title,
        kind: kind === 'VIDEO' ? 'video' : 'image',
      });
    }
  }

  return { documents, media };
}

/** GET /api/activities/{id}/my-attendance → thông tin điểm danh của tôi. */
export async function fetchMyAttendance(id: string): Promise<AttendanceInfo> {
  const activityId = Number(id);
  if (!Number.isFinite(activityId)) {
    return {
      count: 0,
      emptyText: 'Bạn chưa có lượt điểm danh trong hoạt động này.',
      sessionHint: 'Nguồn phiên chỉ dành cho người đã đăng ký và còn đủ điều kiện tham gia.',
    };
  }

  const page = await apiFetch<MyAttendancePage>(
    `/api/activities/${activityId}/my-attendance?page=1&pageSize=50`,
  );

  return {
    count: page.total ?? 0,
    emptyText:
      (page.total ?? 0) > 0
        ? 'Danh sách lượt điểm danh của bạn trong hoạt động này.'
        : 'Bạn chưa có lượt điểm danh trong hoạt động này.',
    sessionHint: 'Nguồn phiên chỉ dành cho người đã đăng ký và còn đủ điều kiện tham gia.',
  };
}

/**
 * POST /api/activities/{id}/participants
 * Body rỗng → BE tự lấy actor (user đang đăng nhập).
 */
export async function registerForActivity(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const activityId = Number(id);
  if (!Number.isFinite(activityId)) {
    return { success: false, message: 'Hoạt động không hợp lệ.' };
  }

  // Không catch: apiFetch đã chuẩn hóa lỗi tiếng Việt (ApiError) — để UI
  // hiển thị đúng thông điệp qua getApiErrorMessage.
  const result = await apiFetch<ParticipantResult>(
    `/api/activities/${activityId}/participants`,
    { method: 'POST', body: {} },
  );
  return {
    success: result.success !== false,
    message:
      result.success !== false
        ? 'Bạn đã đăng ký tham gia hoạt động thành công.'
        : 'Không thể đăng ký hoạt động này.',
  };
}

/** POST /api/activities/{id}/registration/cancel */
export async function cancelRegistration(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const activityId = Number(id);
  if (!Number.isFinite(activityId)) {
    return { success: false, message: 'Hoạt động không hợp lệ.' };
  }

  const result = await apiFetch<ParticipantResult>(
    `/api/activities/${activityId}/registration/cancel`,
    { method: 'POST', body: {} },
  );
  return {
    success: result.success !== false,
    message:
      result.success !== false
        ? 'Đã hủy đăng ký hoạt động.'
        : 'Không thể hủy đăng ký.',
  };
}

/** GET /api/activities/{id}/sessions/{sessionId}/attendance-challenge */
export async function fetchCheckInChallenge(
  activityId: string,
  sessionId: number,
): Promise<AttendanceChallengeResponse | null> {
  const aId = Number(activityId);
  if (!Number.isFinite(aId) || !Number.isFinite(sessionId)) return null;

  return apiFetch<AttendanceChallengeResponse>(
    `/api/activities/${aId}/sessions/${sessionId}/attendance-challenge`,
  );
}
