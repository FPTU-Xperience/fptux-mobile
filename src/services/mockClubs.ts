// services/mockClubs.ts
import type { Club, ClubFeed, ClubFilter, FetchClubsParams } from '@/types/club';

const FILTERS: ClubFilter[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'academic', label: 'Học thuật' },
  { key: 'tech', label: 'Công nghệ' },
  { key: 'community', label: 'Cộng đồng' },
  { key: 'arts', label: 'Nghệ thuật' },
];

const CLUBS: Club[] = [
  {
    id: '1',
    code: 'HAN-FCODE',
    name: 'F-Code Club - CLB Lập trình sinh viên',
    categoryLabel: 'CÔNG NGHỆ & PHẦN MỀM',
    groups: ['tech', 'academic'],
    bannerColor: '#0F6B6B',
    quote: 'Code đẳng, Cùng nhau trưởng thành.',
    iconKind: 'presentation',
    iconBg: '#F97316',
    tags: [
      { label: 'Công nghệ', tone: 'neutral' },
      { label: 'Đang tuyển thành viên', tone: 'warning' },
    ],
    schedule: 'Sinh hoạt: Tối thứ 5 hàng tuần (19:00 - 21:00)',
    description:
      'Nơi kết nối các bạn trẻ đam mê phần mềm, AI, bảo mật và phát triển sản phẩm công nghệ thực chiến.',
    recruiting: true,
  },
  {
    id: '2',
    code: 'HAN-FBEAT',
    name: 'F-Beat Club - Ban nhạc & Nghệ thuật',
    categoryLabel: 'ÂM NHẠC & BAND',
    groups: ['arts', 'community'],
    bannerColor: '#9A4A22',
    quote: 'Đừng ngại đam mê âm nhạc.',
    iconKind: 'music',
    iconBg: '#B7311F',
    iconLabel: 'BEAT',
    tags: [
      { label: 'Nghệ thuật', tone: 'neutral' },
      { label: 'Đang tuyển thành viên', tone: 'warning' },
    ],
    schedule: 'Sinh hoạt: Chiều thứ 7 (15:00 - 18:00)',
    description:
      'Ngôi nhà chung của các vocalist, guitarist, drummer và những tâm hồn yêu âm nhạc tự do.',
    recruiting: true,
  },
  {
    id: '3',
    code: 'HAN-EVT',
    name: 'FPT Event Club - CLB Sự kiện & Truyền thông',
    categoryLabel: 'TRUYỀN THÔNG & TỔ CHỨC',
    groups: ['community'],
    bannerColor: '#5B3F8F',
    quote: 'Kiến tạo khoảnh khắc, Lan tỏa cảm hứng.',
    iconKind: 'megaphone',
    iconBg: '#5B3F9E',
    iconLabel: 'EVO',
    tags: [
      { label: 'Cộng đồng', tone: 'neutral' },
      { label: 'Chờ đợt tuyển mới', tone: 'warning' },
    ],
    schedule: 'Sinh hoạt: Tối Chủ Nhật (20:00)',
    description:
      'Tổ chức các sự kiện quy mô lớn nhất campus: lễ hội âm nhạc, tuần lễ định hướng tân sinh viên.',
    recruiting: false,
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API. Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm. */
export async function fetchClubs(params: FetchClubsParams = {}): Promise<ClubFeed> {
  await wait(400);

  const { keyword = '', filter = 'all', recruitingOnly = false } = params;
  const q = keyword.trim().toLowerCase();

  const clubs = CLUBS.filter((c) => {
    const matchFilter = filter === 'all' || c.groups.includes(filter);
    const matchRecruit = !recruitingOnly || c.recruiting;
    const matchKeyword =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q);
    return matchFilter && matchRecruit && matchKeyword;
  });

  return {
    campus: 'FPTU HÀ NỘI - HOLA',
    total: 79,
    clubs,
    filters: FILTERS,
  };
}