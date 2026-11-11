// services/mockSchedule.ts
import type { ScheduleEvent, ScheduleFeed } from '@/types/schedule';

const ORANGE = { bg: '#FFE4D6', color: '#C2410C' };
const BLUE = { bg: '#CDEFFA', color: '#0E7490' };
const GRAY = { bg: '#EEF0F4', color: '#6B7280' };

const UPCOMING_NEXT_WEEK: ScheduleEvent[] = [
  {
    id: 'u1',
    day: '15',
    month: 'TH 11',
    dateBoxBg: ORANGE.bg,
    dateBoxColor: ORANGE.color,
    club: 'F-Code',
    category: 'Hackathon',
    name: 'Hackathon Hola Codefest 2024',
    time: '08:00 - 18:00',
    venue: 'Sảnh Innovation',
    status: 'confirmed',
    action: 'qr',
  },
  {
    id: 'u2',
    day: '18',
    month: 'TH 11',
    dateBoxBg: BLUE.bg,
    dateBoxColor: BLUE.color,
    club: 'F-Beat',
    category: 'Âm nhạc',
    name: 'Đêm nhạc Acoustic: Thanh xuân rực rỡ',
    time: '19:30 - 22:00',
    venue: 'Bậc thang Hồ Tân Xá',
    status: 'pending',
    action: 'ticket',
  },
];

const attended = (
  id: string,
  day: string,
  month: string,
  club: string,
  category: string,
  name: string,
  time: string,
  venue: string,
): ScheduleEvent => ({
  id,
  day,
  month,
  dateBoxBg: GRAY.bg,
  dateBoxColor: GRAY.color,
  club,
  category,
  name,
  time,
  venue,
  status: 'attended',
  action: 'ticket',
});

const ATTENDED: ScheduleEvent[] = [
  attended('a1', '02', 'TH 11', 'F-Code', 'Workshop', 'Workshop Git & GitHub cơ bản', '14:00 - 17:00', 'Phòng Lab 301'),
  attended('a2', '28', 'TH 10', 'FU Guitar', 'Âm nhạc', 'Jam Session cuối tuần', '19:00 - 21:30', 'Studio Bata'),
  attended('a3', '21', 'TH 10', 'FPT Event', 'Sự kiện', 'Tân sinh viên K19 Welcome Day', '08:00 - 12:00', 'Hội trường lớn'),
  attended('a4', '14', 'TH 10', 'F-Beat', 'Âm nhạc', 'Open Mic Night', '19:00 - 21:00', 'Sảnh Alpha'),
  attended('a5', '07', 'TH 10', 'F-Code', 'Hackathon', 'Mini Hackathon: Build in 6 hours', '09:00 - 15:00', 'Sảnh Innovation'),
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API. Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm. */
export async function fetchSchedule(): Promise<ScheduleFeed> {
  await wait(400);
  return {
    campus: 'FPTU HÀ NỘI - HOLA',
    upcomingThisWeek: [], // để trống để hiển thị trạng thái "tuần này đang trống"
    upcomingNextWeek: UPCOMING_NEXT_WEEK,
    attended: ATTENDED,
  };
}