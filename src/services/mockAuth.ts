// services/mockAuth.ts
import type { AuthUser, Session } from '@/types/auth';

/** Thời gian sống của phiên đăng nhập (mock). Đổi thành vài chục giây để thử hết hạn. */
export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 giờ

/** Các tên miền email được phép đăng nhập */
export const ALLOWED_DOMAINS = ['fpt.edu.vn', 'fe.edu.vn'];

/** Các cơ sở FPT University áp dụng hệ thống */
export const CAMPUSES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Quy Nhơn', 'Cần Thơ'];

/** Tài khoản Google giả lập sẽ được "chọn" khi bấm đăng nhập */
const MOCK_GOOGLE_ACCOUNT: AuthUser = {
  id: 'u_001',
  name: 'Mai An',
  initials: 'MA',
  email: 'an.mai@fpt.edu.vn',
  campus: 'FPTU Hà Nội',
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isAllowedEmail = (email: string) =>
  ALLOWED_DOMAINS.some((d) => email.toLowerCase().endsWith(`@${d}`));

/**
 * Giả lập đăng nhập Google SSO.
 * Sau này thay bằng luồng OAuth thật (expo-auth-session) + API đổi token,
 * giữ nguyên kiểu trả về Session.
 */
export async function mockSignInWithGoogle(): Promise<Session> {
  await wait(800);

  const account = MOCK_GOOGLE_ACCOUNT;
  if (!isAllowedEmail(account.email)) {
    throw new Error('Chỉ chấp nhận email @fpt.edu.vn hoặc @fe.edu.vn.');
  }

  return {
    accessToken: `mock-access-token-${Date.now()}`,
    user: account,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}