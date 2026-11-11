// services/mockActivities.ts
import type {
  ActivityEvent,
  ActivityFeed,
  ActivityFilter,
  FetchActivitiesParams,
} from '@/types/activity';

const FILTERS: ActivityFilter[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'upcoming', label: 'Sắp diễn ra' },
  { key: 'ongoing', label: 'Đang diễn ra' },
  { key: 'workshop', label: 'Workshop' },
];

const EVENTS: ActivityEvent[] = [
  {
    id: '1',
    club: 'F-CODE CLUB',
    status: 'upcoming',
    category: 'hackathon',
    title: 'HACKATHON HOLA CODEFEST 2024',
    bannerLocation: 'HAN - Sảnh Innovation & Tòa Gamma',
    bannerColor: '#0F5E4B',
    day: '15',
    month: 'THÁNG 11',
    dateBoxBg: '#CDEFFA',
    dateBoxColor: '#0E7490',
    organizer: 'Ban Công Nghệ FPTU',
    name: 'Thử thách lập trình AI & Web3',
    time: '08:00 - 18:00',
    venue: { kind: 'pin', label: 'Hội trường Trịnh Công Sơn' },
    footer: { kind: 'attendees', label: '124 team' },
  },
  {
    id: '2',
    club: 'F-BEAT CLUB',
    status: 'upcoming',
    category: 'music',
    title: 'ĐÊM NHẠC ACOUSTIC: THANH XUÂN RỰC RỠ',
    bannerLocation: 'HAN - Bậc thang Hồ Tân Xá',
    bannerColor: '#A31545',
    day: '18',
    month: 'THÁNG 11',
    dateBoxBg: '#FFE1D6',
    dateBoxColor: '#C2410C',
    organizer: 'CLB Âm nhạc Học Sinh - Sinh Viên',
    name: 'Không gian âm nhạc mộc mạc',
    time: '19:30 - 22:00',
    venue: { kind: 'music', label: 'Miễn phí vé vào cổng' },
    footer: { kind: 'likes', label: '148 lượt thích' },
  },
  {
    id: '3',
    club: 'FU GUITAR CLUB',
    status: 'upcoming',
    category: 'workshop',
    title: 'WORKSHOP: NHẬP MÔN FINGERSTYLE CÙNG PRO',
    bannerLocation: 'HAN - Phòng Studio Bata',
    bannerColor: '#115E73',
    day: '22',
    month: 'THÁNG 11',
    dateBoxBg: '#E3ECFB',
    dateBoxColor: '#1D4ED8',
    organizer: 'Câu lạc bộ Guitar FPTU',
    name: 'Hướng dẫn kỹ thuật gõ thùng cơ bản',
    time: '14:00 - 17:00',
    venue: { kind: 'users', label: 'Giới hạn 40 chỗ' },
    footer: { kind: 'perk', label: 'Tặng giáo trình độc quyền' },
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API. Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm. */
export async function fetchActivities(
  params: FetchActivitiesParams = {},
): Promise<ActivityFeed> {
  await wait(400);

  const { keyword = '', filter = 'all' } = params;
  const q = keyword.trim().toLowerCase();

  const events = EVENTS.filter((e) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'workshop' ? e.category === 'workshop' : e.status === filter);
    const matchKeyword =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.club.toLowerCase().includes(q);
    return matchFilter && matchKeyword;
  });

  return {
    campus: 'FPTU HÀ NỘI - HOLA',
    semester: 'KỲ FALL 2024',
    events,
    filters: FILTERS,
  };
}