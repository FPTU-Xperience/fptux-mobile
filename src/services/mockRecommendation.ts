// services/mockRecommendation.ts
import type {
  RecoClub,
  RecoEvent,
  RecommendationQuery,
  RecommendationResponse,
} from '@/types/recommendation';

const PAGE_SIZE = 4;

const HUB = 'CLUBHUB / COMMUNITY';
const TAGLINE = 'Một cộng đồng.\nCùng nhau trưởng thành.';

const EVENTS: RecoEvent[] = [
  {
    id: '1',
    club: 'CLB DESIGN',
    status: 'upcoming',
    title: 'Ngày hội trải nghiệm và tuyển cộng tác viên',
    bannerLocation: 'HAN · Sảnh Innovation',
    bannerColor: '#0B3B3F',
    day: '15',
    month: '11',
    dateBoxBg: '#CDEFFA',
    dateBoxColor: '#0E7490',
    name: 'Ngày hội CTV - FU-DESG',
    time: '14:00 - 17:00',
    venue: 'HAN · Innovation',
  },
  {
    id: '2',
    club: 'CLB TÌNH NGUYỆN VÌ CỘNG ĐỒNG IGO',
    status: 'upcoming',
    title: 'Họp tuyển cộng tác viên và hướng dẫn tham gia',
    bannerLocation: 'HAN · Sân Alpha',
    bannerColor: '#9F1239',
    day: '13',
    month: '11',
    dateBoxBg: '#FFE4D6',
    dateBoxColor: '#C2410C',
    name: 'Họp tuyển CTV - FU-IGO',
    time: '19:00 - 21:00',
    venue: 'HAN · Sân Alpha',
  },
  {
    id: '3',
    club: 'CLB AI - TRÍ TUỆ NHÂN TẠO',
    status: 'ongoing',
    title: 'Ngày hội trải nghiệm và tuyển cộng tác viên',
    bannerLocation: 'HAN · Lab AI - Beta',
    bannerColor: '#1E3A5F',
    day: '12',
    month: '11',
    dateBoxBg: '#E3ECFB',
    dateBoxColor: '#1D4ED8',
    name: 'Ngày hội CTV - FU-AICL',
    time: '14:00 - 17:00',
    venue: 'HAN · Lab AI - Beta',
  },
];

const club = (c: Omit<RecoClub, 'hubLabel' | 'tagline'> & Partial<RecoClub>): RecoClub => ({
  hubLabel: HUB,
  tagline: TAGLINE,
  ...c,
});

const CLUBS: RecoClub[] = [
  club({
    id: '4',
    code: 'HCM-BEC',
    name: 'BEC - Business Economics Club',
    category: 'academic',
    categoryLabel: 'Học thuật',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#0F5E5E',
    logoBg: '#1E2A4A',
    logoText: '09',
    schedule: 'Thứ Tư & Thứ Bảy · 18:00 - 20:00',
    description:
      'Kinh doanh, tài chính & nghề nghiệp - CLB sinh viên Trường Đại học FPT (Hồ Chí Minh). Sinh hoạt hằng tuần, dự án thực hành và hoạt động cộng đồng.',
  }),
  club({
    id: '5',
    code: 'HCM-AIDATA',
    name: 'Câu lạc bộ AI & Data',
    category: 'tech',
    categoryLabel: 'Công nghệ',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#9A4A22',
    logoBg: '#F59E0B',
    logoText: 'FPT',
    schedule: null,
    description:
      'Nơi sinh viên học và ứng dụng khoa học dữ liệu, machine learning và trí tuệ nhân tạo vào các bài toán thực tế.',
  }),
  club({
    id: '6',
    code: 'HCM-FTECH',
    name: 'Câu lạc bộ Công nghệ FPT',
    category: 'tech',
    categoryLabel: 'Công nghệ',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#4C3A8A',
    logoBg: '#F97316',
    logoText: '</>',
    schedule: null,
    description:
      'Cộng đồng sinh viên yêu phần mềm, DevOps và an ninh mạng. Workshop, dự án và các cuộc thi thực chiến.',
  }),
  club({
    id: '7',
    code: 'HCM-COXANH',
    name: 'CLB Tình nguyện Cơ Xanh',
    category: 'community',
    categoryLabel: 'Cộng đồng',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#14532D',
    logoBg: '#DCFCE7',
    logoText: 'FPT',
    schedule: null,
    description:
      'Kết nối sinh viên với các hoạt động xã hội, bảo vệ môi trường và chiến dịch thiện nguyện của trường.',
  }),
  club({
    id: '1',
    code: 'HAN-FCODE',
    name: 'F-Code Club - CLB Lập trình sinh viên',
    category: 'tech',
    categoryLabel: 'Công nghệ',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#0F6B6B',
    logoBg: '#1E2A4A',
    logoText: '01',
    schedule: 'Tối thứ 5 hàng tuần · 19:00 - 21:00',
    description:
      'Nơi kết nối các bạn trẻ đam mê phần mềm, AI, bảo mật và phát triển sản phẩm công nghệ thực chiến.',
  }),
  club({
    id: '2',
    code: 'HAN-FBEAT',
    name: 'F-Beat Club - Ban nhạc & Nghệ thuật',
    category: 'community',
    categoryLabel: 'Cộng đồng',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    bannerColor: '#9A4A22',
    logoBg: '#4A1E1E',
    logoText: '02',
    schedule: 'Chiều Thứ Bảy · 15:00 - 18:00',
    description:
      'Ngôi nhà chung của các vocalist, guitarist, drummer và những tâm hồn yêu âm nhạc tự do.',
  }),
  club({
    id: '3',
    code: 'HAN-EVT',
    name: 'FPT Event Club - CLB Sự kiện & Truyền thông',
    category: 'community',
    categoryLabel: 'Cộng đồng',
    recruiting: false,
    recruitingLabel: 'Chờ đợt tuyển mới',
    bannerColor: '#5B3F8F',
    logoBg: '#2A1E4A',
    logoText: '03',
    schedule: 'Tối Chủ Nhật · 20:00',
    description:
      'Tổ chức các sự kiện quy mô lớn nhất campus: lễ hội âm nhạc, tuần lễ định hướng tân sinh viên.',
  }),
  club({
    id: '8',
    code: 'HAN-FGUITAR',
    name: 'FU Guitar Club',
    category: 'academic',
    categoryLabel: 'Học thuật',
    recruiting: false,
    recruitingLabel: 'Chờ đợt tuyển mới',
    bannerColor: '#115E73',
    logoBg: '#134E4A',
    logoText: '08',
    schedule: 'Thứ Sáu · 18:00 - 20:00',
    description: 'Câu lạc bộ guitar dành cho mọi trình độ, từ đệm hát cơ bản đến fingerstyle.',
  }),
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Giả lập GET /recommendation
 * Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm và kiểu trả về.
 */
export async function fetchRecommendation(
  query: RecommendationQuery = {},
): Promise<RecommendationResponse> {
  await wait(400);

  const { eventStatus = 'all', keyword = '', category = 'all', page = 1 } = query;
  const q = keyword.trim().toLowerCase();

  const events = EVENTS.filter((e) => eventStatus === 'all' || e.status === eventStatus);

  const matchedClubs = CLUBS.filter((c) => {
    const matchCategory = category === 'all' || c.category === category;
    const matchKeyword =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q);
    return matchCategory && matchKeyword;
  });

  const pageCount = Math.max(1, Math.ceil(matchedClubs.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const items = matchedClubs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return {
    campus: 'Hola Campus · HAN',
    hero: {
      eyebrow: 'HOLA COMMUNITY, NHIỀU CÁCH TỚI BẠN',
      title: 'Tìm cộng đồng.',
      highlight: 'Viết câu chuyện của bạn.',
      description:
        'Những người bạn mới, những điều chưa từng thử. Hành trình đáng nhớ bắt đầu từ một câu lạc bộ phù hợp.',
      primaryCta: 'Khám phá các CLB',
      secondaryCta: 'Hoạt động sắp tới',
      miniCards: [
        { id: 'm1', label: 'YOUR NEXT', title: 'chapter.', note: 'HFU2026', tone: 'dark' },
        { id: 'm2', label: 'THE CAMPUS WAY', title: 'Explore. Connect. Belong.', tone: 'light' },
      ],
      socialProof: {
        avatars: ['AN', 'BC', 'HL'],
        text: 'Hơn 120 bạn đã tham gia cộng đồng tuần này',
      },
    },
    quickActions: [
      { id: 'q1', label: 'Khám phá hoạt động', icon: 'compass', route: 'activity' },
      { id: 'q2', label: 'Lịch sinh hoạt', icon: 'calendar', route: 'schedule' },
      { id: 'q3', label: 'Kết nối bạn mới', icon: 'users', route: 'allClubs' },
    ],
    events: {
      filters: [
        { key: 'all', label: 'Tất cả' },
        { key: 'upcoming', label: 'Sắp diễn ra' },
        { key: 'ongoing', label: 'Đang diễn ra' },
      ],
      items: events,
    },
    clubs: {
      filters: [
        { key: 'all', label: 'Tất cả' },
        { key: 'academic', label: 'Học thuật' },
        { key: 'tech', label: 'Công nghệ' },
        { key: 'community', label: 'Cộng đồng' },
      ],
      items,
      pagination: { page: currentPage, pageCount, total: matchedClubs.length },
    },
    moreCta: {
      eyebrow: 'KHÁM PHÁ THÊM CỘNG ĐỒNG',
      text: 'Nếu vẫn chưa thấy CLB phù hợp, xem nhiều hơn tại đây.',
      button: 'Xem tất cả các câu lạc bộ',
    },
  };
}