// services/mockMyClubs.ts
import type { MyClubsFeed } from '@/types/myClubs';

const FEED: MyClubsFeed = {
  clubs: [
    {
      id: '1',
      name: 'F-Code Club',
      role: 'Ban Chuyên Môn',
      subtitle: 'Học thuật & Lập trình',
      hubLabel: 'CLUBHUB / COMMUNITY',
      tagline: 'Một cộng đồng.\nCùng nhau trưởng thành.',
      bannerColor: '#0F5E5E',
      logoBg: '#2563EB',
      logoCode: '01',
      nextActivity: {
        id: '1',
        title: 'Hackathon Hola Codefest 2024',
        date: '15/11/2026',
      },
    },
  ],
  // pending và approved để trống để hiện trạng thái "không có đơn"
  applications: [
    {
      id: 'a1',
      clubId: '1',
      clubName: 'F-Code Club',
      appliedAt: '05/09/2026',
      tab: 'history',
      result: 'approved',
    },
    {
      id: 'a2',
      clubId: '3',
      clubName: 'FPT Event Club',
      appliedAt: '20/10/2026',
      tab: 'history',
      result: 'rejected',
    },
  ],
  featured: [
    {
      id: '2',
      name: 'F-Beat Club',
      tag: 'NGHỆ THUẬT',
      tagBg: '#EDE9FE',
      tagColor: '#6D28D9',
      description: ' Âm nhạc sống, kết nối đam mê cùng sinh viên.',
    },
    {
      id: '3',
      name: 'FPT Event Club',
      tag: 'CỘNG ĐỒNG',
      tagBg: '#DCFCE7',
      tagColor: '#15803D',
      description: 'Tổ chức các sự kiện lớn nhất campus.',
    },
  ],
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giả lập gọi API. Sau này thay bằng fetch/axios thật, giữ nguyên chữ ký hàm. */
export async function fetchMyClubs(): Promise<MyClubsFeed> {
  await wait(400);
  return FEED;
}