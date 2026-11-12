// types/auth.ts
export interface AuthUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  campus: string;
}

export interface Session {
  accessToken: string;
  user: AuthUser;
  /** Thời điểm hết hạn, tính bằng ms (Date.now() + TTL) */
  expiresAt: number;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';