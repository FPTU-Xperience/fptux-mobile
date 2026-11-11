// services/mockActivityDetail.ts
import type { ActivityDetail, Assignment, Recruitment } from '@/types/activityDetail';

const ASSIGNMENTS: Assignment[] = [
  {
    id: 'as1',
    name: 'Nguyễn Thảo Linh',
    initials: 'NL',
    roleLabel: 'Host',
    duty: 'Điều phối nội dung và dẫn chương trình',
    avatarBg: '#FFE4D6',
    avatarColor: '#C2410C',
  },
  {
    id: 'as2',
    name: 'Phạm Thảo Linh',
    initials: 'PL',
    roleLabel: 'Staff',
    duty: 'Điều phối nội dung và dẫn chương trình',
    avatarBg: '#DBEAFE',
    avatarColor: '#1D4ED8',
  },
  {
    id: 'as3',
    name: 'Lê Thảo Linh',
    initials: 'LL',
    roleLabel: 'Staff',
    duty: 'Hỗ trợ hậu cần và đón tiếp',
    avatarBg: '#EDE9FE',
    avatarColor: '#6D28D9',
  },
  {
    id: 'as4',
    name: 'Trần Thảo Linh',
    initials: 'TL',
    roleLabel: 'Staff',
    duty: 'Thiết kế và truyền thông',
    avatarBg: '#DCFCE7',
    avatarColor: '#15803D',
  },
];

const RECRUITMENT: Recruitment = {
  open: true,
  description: 'Một nhiệm vụ tuyển dụng dùng chung với Nhiệm vụ & đóng góp của CLB.',
  notice: 'Tính điểm đang tạm hoãn. Phân công và xác minh hoàn thành không cộng Xperience Point.',
  visibility: 'Sinh viên toàn trường',
  roles: [
    {
      id: 'r1',
      title: 'Hỗ trợ hậu cần và đón tiếp',
      kind: 'Staff hỗ trợ',
      approved: 0,
      capacity: 10,
      note: 'Tạm hoãn tính điểm; nhận vị trí không phát sinh điểm.',
    },
    {
      id: 'r2',
      title: 'Thiết kế và truyền thông',
      kind: 'Staff hỗ trợ',
      approved: 0,
      capacity: 6,
      note: 'Tạm hoãn tính điểm; nhận vị trí không phát sinh điểm.',
    },
    {
      id: 'r3',
      title: 'Điều phối nội dung và dẫn chương trình',
      kind: 'Staff hỗ trợ',
      approved: 0,
      capacity: 3,
      note: 'Tạm hoãn tính điểm; nhận vị trí không phát sinh điểm.',
    },
  ],
};

/** Phần dùng chung giữa các hoạt động trong mock */
const COMMON = {
  status: 'upcoming' as const,
  hubLabel: 'FPTU CLUB HUB',
  month: '11',
  contactNote:
    'Chưa đồng bộ đầu mối liên hệ. Hệ thống sẽ chọn host được chỉ định đầu tiên; nếu chưa có host sẽ dùng chủ tịch CLB.',
  recruitment: RECRUITMENT,
  assignmentsNote: 'Minh chứng chỉ hiển thị cho chủ sở hữu và người có quyền xét minh.',
  assignments: ASSIGNMENTS,
  attendance: {
    count: 0,
    emptyText: 'Bạn chưa có lượt điểm danh trong hoạt động này.',
    sessionHint: 'Nguồn phiên chỉ dành cho người đã đăng ký và còn đủ điều kiện tham gia.',
  },
  documents: [],
  media: [],
};

const DETAILS: Record<string, ActivityDetail> = {
  '1': {
    ...COMMON,
    id: '1',
    title: 'Hackathon Hola Codefest 2024',
    bannerColor: '#0F5E4B',
    day: '15',
    clubName: 'F-Code Club',
    timeSummary: '08:00 15/11/2026',
    startAt: { time: '08:00:00', date: '15/11/2026' },
    endAt: { time: '18:00:00', date: '15/11/2026' },
    location: 'HAN - Sảnh Innovation & Tòa Gamma',
    organizer: 'F-Code Club',
    about:
      'Cuộc thi lập trình 10 tiếng dành cho sinh viên toàn trường với chủ đề AI & Web3. Các đội thi giải quyết bài toán thực tế do doanh nghiệp đối tác đặt ra, có mentor đồng hành và giải thưởng cho các đội xuất sắc.',
  },
  '2': {
    ...COMMON,
    id: '2',
    title: 'Đêm nhạc Acoustic: Thanh xuân rực rỡ',
    bannerColor: '#A31545',
    day: '18',
    clubName: 'F-Beat Club',
    timeSummary: '19:30 18/11/2026',
    startAt: { time: '19:30:00', date: '18/11/2026' },
    endAt: { time: '22:00:00', date: '18/11/2026' },
    location: 'HAN - Bậc thang Hồ Tân Xá',
    organizer: 'CLB Âm nhạc Học Sinh - Sinh Viên',
    about:
      'Không gian âm nhạc mộc mạc với các tiết mục acoustic do chính sinh viên FPTU biểu diễn. Hoạt động miễn phí vé vào cổng, mở cửa cho toàn bộ sinh viên và khách mời.',
  },
  '3': {
    ...COMMON,
    id: '3',
    title: 'Workshop: Nhập môn Fingerstyle cùng Pro',
    bannerColor: '#115E73',
    day: '22',
    clubName: 'FU Guitar Club',
    timeSummary: '14:00 22/11/2026',
    startAt: { time: '14:00:00', date: '22/11/2026' },
    endAt: { time: '17:00:00', date: '22/11/2026' },
    location: 'HAN - Phòng Studio Bata',
    organizer: 'Câu lạc bộ Guitar FPTU',
    about:
      'Buổi workshop hướng dẫn kỹ thuật gõ thùng cơ bản và các mẫu đệm fingerstyle dành cho người mới. Giới hạn 40 chỗ, người tham gia được tặng giáo trình độc quyền.',
  },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API chi tiết hoạt động. Trả null nếu không tìm thấy. */
export async function fetchActivityDetail(id: string): Promise<ActivityDetail | null> {
  await wait(400);
  return DETAILS[id] ?? null;
}

/** Giả lập đăng ký tham gia hoạt động. */
export async function registerForActivity(
  _id: string,
): Promise<{ success: boolean; message: string }> {
  await wait(600);
  return { success: true, message: 'Bạn đã đăng ký tham gia hoạt động thành công.' };
}