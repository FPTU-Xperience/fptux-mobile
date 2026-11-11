// services/mockClubDetail.ts
import type { ClubDetail, ClubHighlight } from '@/types/clubDetail';

const HIGHLIGHTS: ClubHighlight[] = [
  {
    no: '01',
    title: 'Học từ trải nghiệm',
    description:
      'Thử sức trong các hoạt động và dự án có đầu ra cụ thể, gắn liền thực tế doanh nghiệp.',
  },
  {
    no: '02',
    title: 'Những người bạn đồng hành',
    description: 'Kết nối với các thành viên tài năng cùng sở thích về kinh tế, đầu tư & quản trị.',
  },
  {
    no: '03',
    title: 'Ghi nhận từng đóng góp',
    description:
      'Lưu lại vai trò, sản phẩm thực chiến và được bảo chứng qua portfolio cá nhân.',
  },
];

const DETAILS: Record<string, ClubDetail> = {
  '1': {
    id: '1',
    name: 'F-Code Club',
    eyebrow: 'FPTU XPERIENCE · CỘNG ĐỒNG LẬP TRÌNH',
    tagline: 'Code đẳng · Cùng nhau trưởng thành',
    slogan: 'Học code, làm dự án thật, lớn lên cùng nhau.',
    bannerColor: '#0F6B6B',
    logoBg: '#1E2A4A',
    logoCode: '01',
    campusLabel: 'HAN CAMPUS',
    category: 'Công nghệ',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    scheduleSummary: 'Tối thứ 5 hàng tuần · 19:00-21:00',
    location: 'Phòng Lab 301 (FPTU Hà Nội)',
    aboutHeading: 'Nơi kết nối những người yêu code.',
    aboutText:
      'F-Code là câu lạc bộ lập trình sinh viên của FPTU Hà Nội. Chúng mình sinh hoạt hằng tuần, làm dự án thực chiến về phần mềm, AI, bảo mật và tổ chức các cuộc thi như Hackathon. Có lộ trình dành cho người mới bắt đầu lẫn thành viên muốn đi sâu chuyên môn.',
    hashtags: ['#CôngNghệ', '#HAN-FCODE', '#LậpTrình'],
    highlights: HIGHLIGHTS,
    meet: {
      schedule: 'Thứ Năm · 19:00 - 21:00',
      location: 'Phòng Lab 301 (FPTU Hà Nội Campus)',
      size: '120 thành viên chính thức',
      email: 'fcode@fpt.edu.vn',
      hotline: '02873001001',
    },
    upcomingEvents: [
      {
        id: '1',
        day: '15',
        month: 'T11',
        title: 'Hackathon Hola Codefest 2024',
        time: '08:00 - 18:00',
        venue: 'Sảnh Innovation, FPTU HN',
      },
    ],
    leaders: [
      {
        id: 'l1',
        name: 'Ban Chủ Nhiệm F-Code',
        initials: 'FC',
        term: 'Nhiệm kỳ 2024 - 2025 · FPT University Hà Nội',
      },
    ],
  },

  '2': {
    id: '2',
    name: 'F-Beat Club',
    eyebrow: 'FPTU XPERIENCE · CỘNG ĐỒNG ÂM NHẠC',
    tagline: 'Đam mê · Biểu diễn · Kết nối',
    slogan: 'Ngôi nhà chung của những tâm hồn yêu âm nhạc.',
    bannerColor: '#9A4A22',
    logoBg: '#4A1E1E',
    logoCode: '02',
    campusLabel: 'HAN CAMPUS',
    category: 'Nghệ thuật',
    recruiting: true,
    recruitingLabel: 'Đang tuyển thành viên',
    scheduleSummary: 'Chiều Thứ Bảy · 15:00-18:00',
    location: 'Sảnh Alpha (FPTU Hà Nội)',
    aboutHeading: 'Âm nhạc là ngôn ngữ chung.',
    aboutText:
      'F-Beat quy tụ vocalist, guitarist, drummer và những bạn yêu âm nhạc tự do. CLB tổ chức các buổi jam, open mic và đêm nhạc acoustic, tạo sân chơi để thành viên thể hiện bản thân và học hỏi lẫn nhau.',
    hashtags: ['#ÂmNhạc', '#HAN-FBEAT', '#Acoustic'],
    highlights: HIGHLIGHTS,
    meet: {
      schedule: 'Chiều Thứ Bảy · 15:00 - 18:00',
      location: 'Sảnh Alpha (FPTU Hà Nội Campus)',
      size: '60 thành viên chính thức',
      email: 'fbeat@fpt.edu.vn',
      hotline: '02873001002',
    },
    upcomingEvents: [
      {
        id: '2',
        day: '18',
        month: 'T11',
        title: 'Đêm nhạc Acoustic: Thanh xuân rực rỡ',
        time: '19:30 - 22:00',
        venue: 'Bậc thang Hồ Tân Xá',
      },
    ],
    leaders: [
      {
        id: 'l1',
        name: 'Ban Chủ Nhiệm F-Beat',
        initials: 'FB',
        term: 'Nhiệm kỳ 2024 - 2025 · FPT University Hà Nội',
      },
    ],
  },

  '3': {
    id: '3',
    name: 'FPT Event Club',
    eyebrow: 'FPTU XPERIENCE · CỘNG ĐỒNG TRUYỀN THÔNG',
    tagline: 'Kiến tạo · Lan tỏa · Cảm hứng',
    slogan: 'Biến ý tưởng thành những sự kiện đáng nhớ.',
    bannerColor: '#5B3F8F',
    logoBg: '#2A1E4A',
    logoCode: '03',
    campusLabel: 'HAN CAMPUS',
    category: 'Cộng đồng',
    recruiting: false,
    recruitingLabel: 'Chờ đợt tuyển mới',
    scheduleSummary: 'Tối Chủ Nhật · 20:00',
    location: null, // mô phỏng trường hợp chưa cập nhật địa điểm
    aboutHeading: 'Nơi tổ chức những khoảnh khắc.',
    aboutText:
      'FPT Event Club chịu trách nhiệm các sự kiện quy mô lớn nhất campus: lễ hội âm nhạc, tuần lễ định hướng tân sinh viên và nhiều hoạt động cộng đồng. Thành viên được trải nghiệm đủ vị trí từ lên kế hoạch, truyền thông đến vận hành hiện trường.',
    hashtags: ['#SựKiện', '#HAN-EVT', '#TruyềnThông'],
    highlights: HIGHLIGHTS,
    meet: {
      schedule: 'Tối Chủ Nhật · 20:00',
      location: null,
      size: '85 thành viên chính thức',
      email: 'fevent@fpt.edu.vn',
      hotline: '02873001003',
    },
    upcomingEvents: [
      {
        id: '3',
        day: '22',
        month: 'T11',
        title: 'Workshop: Nhập môn Fingerstyle cùng Pro',
        time: '14:00 - 17:00',
        venue: 'Phòng Studio Bata',
      },
    ],
    leaders: [
      {
        id: 'l1',
        name: 'Ban Chủ Nhiệm FPT Event',
        initials: 'EV',
        term: 'Nhiệm kỳ 2024 - 2025 · FPT University Hà Nội',
      },
    ],
  },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API chi tiết CLB. Trả null nếu không tìm thấy. */
export async function fetchClubDetail(id: string): Promise<ClubDetail | null> {
  await wait(400);
  return DETAILS[id] ?? null;
}

/** Giả lập nộp hồ sơ gia nhập CLB. */
export async function applyToClub(
  _id: string,
): Promise<{ success: boolean; message: string }> {
  await wait(600);
  return { success: true, message: 'Hồ sơ của bạn đã được gửi tới ban chủ nhiệm CLB.' };
}