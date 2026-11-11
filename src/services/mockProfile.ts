// services/mockProfile.ts
import type { ProfileFeed } from '@/types/profile';

const FEED: ProfileFeed = {
  campus: 'FPTU HÀ NỘI - HOLA',
  user: {
    name: 'Mai An',
    initials: 'MA',
    plan: 'Pro',
    statusLabel: 'K17 Active',
    major: 'Trí tuệ nhân tạo',
    cohort: 'K17',
    campusCode: 'HAN',
    university: 'FPTU Hà Nội',
    campusName: 'Campus Hòa Lạc',
    bio: 'Sinh viên năm 3 chuyên ngành AI, đam mê nghiên cứu Computer Vision, thành viên ban chuyên môn F-Code và thích tham gia các hoạt động cộng đồng.',
    coverText: 'Make your time\nmean something.',
  },
  stats: [
    { id: 'eri', label: 'Chỉ số ERI', value: '0.0', hint: 'Xếp hạng Hola: --', iconKind: 'zap' },
    { id: 'xp', label: 'Xperience Point', value: '0', hint: 'Điểm tích lũy trọn', iconKind: 'star' },
    { id: 'attendance', label: 'Lượt điểm danh', value: '0', hint: 'Qua quét mã QR', iconKind: 'check' },
    { id: 'clubs', label: 'CLB tham gia', value: '1', hint: 'Đang sinh hoạt', iconKind: 'users' },
  ],
  competency: {
    quote: 'Hành trình của bạn không chỉ được đo bằng điểm số',
    axes: [
      { label: '1. Học tập', value: 58 },
      { label: '2. Nghiên cứu', value: 62 },
      { label: '3. Quốc tế', value: 48 },
      { label: '4. Thể thao & VH', value: 52 },
      { label: '5. Cộng đồng', value: 55 },
      { label: '6. Khởi nghiệp', value: 60 },
    ],
    depth: 0,
    evenness: 0,
    factor: 1.0,
    note: 'Chỉ số ERI được tính toán tự động dựa trên độ sâu, độ đều và tính xác thực của các minh chứng hoạt động đã tham gia.',
  },
  skills: ['Machine Learning', 'Python', 'Phát biểu công chúng', 'Quản lý sự kiện'],
  clubs: [
    {
      id: 'c1',
      name: 'F-Code Club',
      field: 'Học thuật & Lập trình',
      badge: 'MEMBER · Ban Chuyên Môn',
    },
  ],
  menu: [
    { id: 'm1', label: 'Câu lạc bộ của tôi', count: 1, iconKind: 'flag' },
    { id: 'm2', label: 'Lịch học & Sự kiện đã lưu', iconKind: 'calendar' },
    { id: 'm3', label: 'Trải nghiệm cá nhân & Minh chứng', iconKind: 'trophy' },
  ],
  evidences: [], // để trống để hiển thị trạng thái chưa có minh chứng
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API. Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm. */
export async function fetchProfile(): Promise<ProfileFeed> {
  await wait(400);
  return FEED;
}