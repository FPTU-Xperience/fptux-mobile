// services/myClubs.ts
//
// Nguồn dữ liệu thật cho màn "CLB của tôi".
//
// - Memberships của tôi: GET /api/clubs/me/memberships → ClubMembershipResponse[]
// - Hoạt động sắp tới của CLB: GET /api/v2/activities/feed?clubId=
// - CLB đang tuyển (gợi ý): GET /api/clubs?active=true&recruiting=true
//
// Quy tắc: thành viên được duyệt → `clubs`; hồ sơ đang chờ → `applications`
// (tab pending); bị từ chối / đã rút → tab history.

import { apiFetch, toQuery } from '@/services/apiClient';
import { decorFor } from '@/services/uiDerive';
import type {
  Application,
  ApplicationResult,
  ApplicationTabKey,
  FeaturedClub,
  MyClub,
  MyClubsFeed,
} from '@/types/myClubs';
import type {
  ClubDirectory,
  ClubMembershipResponse,
  StudentActivityPage,
} from '@/types/api';

const pad = (n: number) => String(n).padStart(2, '0');

/** "dd/MM/yyyy" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Membership của tôi → (tab, result) của UI. */
function classify(status: string): { tab: ApplicationTabKey; result: ApplicationResult } {
  const s = (status ?? '').trim().toLowerCase();
  if (s === 'pending' || s === 'invited') return { tab: 'pending', result: 'pending' };
  if (s === 'approved') return { tab: 'approved', result: 'approved' };
  // Rejected / Withdrawn / Cancelled → lịch sử.
  return { tab: 'history', result: 'rejected' };
}

/**
 * GET /api/clubs/me/memberships
 * @param campus campus hiện tại (để dựng `hubLabel`)
 */
export async function fetchMyClubs(campus = ''): Promise<MyClubsFeed> {
  const memberships = await apiFetch<ClubMembershipResponse[]>('/api/clubs/me/memberships');

  const clubs: MyClub[] = [];
  const applications: Application[] = [];

  for (const m of memberships ?? []) {
    const { tab, result } = classify(m.status);

    // Chỉ thành viên được duyệt mới hiện ở danh sách "CLB của tôi".
    if (result === 'approved') {
      const decor = decorFor(m.clubCode || m.clubName);
      clubs.push({
        id: String(m.clubId),
        name: m.clubName,
        role: m.role || 'Thành viên',
        subtitle: m.clubCategory || null,
        hubLabel: m.clubCode || 'CLUBHUB',
        tagline: m.requestMessage ?? '',
        bannerColor: decor.banner,
        logoBg: decor.logoBg,
        logoCode: (m.clubCode ?? '').slice(0, 2).toUpperCase() || 'CLB',
        nextActivity: null, // gắn bên dưới
      });
    } else {
      applications.push({
        id: String(m.id),
        clubId: String(m.clubId),
        clubName: m.clubName,
        appliedAt: formatDate(m.requestedAtUtc),
        tab,
        result,
      });
    }
  }

  // Gắn hoạt động sắp tới cho từng CLB (lỗi cục bộ không được làm hỏng cả list).
  await Promise.all(
    clubs.map(async (club) => {
      club.nextActivity = await fetchNextActivity(club.id);
    }),
  );

  const featured = await fetchFeaturedClubs(
    new Set(clubs.map((c) => c.id)),
    campus,
  );

  return { clubs, applications, featured };
}

/** Hoạt động sắp nhất của 1 CLB. */
async function fetchNextActivity(clubId: string) {
  try {
    const query = toQuery({ clubId: Number(clubId), page: 1, pageSize: 1 });
    const page = await apiFetch<StudentActivityPage>(
      `/api/v2/activities/feed${query}`,
    );
    const item = page.items?.[0];
    if (!item) return null;

    const start = new Date(item.startTime);
    return {
      id: String(item.id),
      title: item.title,
      date: `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`,
    };
  } catch {
    return null;
  }
}

/** CLB đang tuyển, loại trừ các CLB user đã vào. */
async function fetchFeaturedClubs(
  memberIds: Set<string>,
  campus: string,
): Promise<FeaturedClub[]> {
  try {
    const query = toQuery({ active: true, recruiting: true });
    const list = await apiFetch<ClubDirectory[]>(`/api/clubs${query}`);

    return list
      .filter((c) => !memberIds.has(String(c.id)))
      .slice(0, 3)
      .map((c) => ({
        id: String(c.id),
        name: c.name,
        tag: (c.category || 'CLB').toUpperCase(),
        tagBg: '#E0F2F1',
        tagColor: '#0F766E',
        description: c.scheduleLabel ?? c.description ?? '',
      }));
  } catch {
    // Không có nguồn → để danh sách rỗng, UI hiện empty state.
    return [];
  }
}
