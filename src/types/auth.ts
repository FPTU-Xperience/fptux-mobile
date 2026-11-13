// types/auth.ts
// Kiểu dữ liệu phiên đăng nhập cho AuthProvider.

import type { UserSummary } from '@/types/api';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  id: string;
  name: string;
  /** Chữ cái đầu để hiển thị avatar khi không có avatarUrl. */
  initials: string;
  email: string;
  campus: string;
}

export interface Session {
  accessToken: string;
  user: UserSummary | null;
  /** Timestamp (ms) hết hạn access token. */
  expiresAt: number;
  /** 'google' = login Google, 'email' = login email+mật khẩu, 'dev' = token từ .env. */
  source: 'google' | 'email' | 'dev';
}
