// providers/AuthProvider.tsx
//
// DEV-TOKEN MODE (quyết định: tạm bỏ qua đăng nhập thật — implement lại ở Phase 7).
//
// App chạy với 1 access token dev lấy từ .env (EXPO_PUBLIC_DEV_ACCESS_TOKEN).
// - status luôn 'authenticated' khi có dev token; 'unauthenticated' khi chưa có.
// - user: thông tin placeholder (không gọi /api/users/me ở đây để tránh phụ thuộc
//   token hợp lệ cho bước bootstrap; screen nào cần user thật sẽ gọi qua apiClient).
// - signOut/expireSession: giữ no-op để không phá call-site. Khi implement login
//   thật (Phase 7) sẽ thay bằng refresh rotation + SecureStore + session-lost.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getAccessToken } from '@/services/apiClient';
import type { AuthStatus, AuthUser, Session } from '@/types/auth';

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: AuthUser | null;
  /** true khi người dùng bị đưa về login vì phiên hết hạn (Phase 7). */
  sessionExpired: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Gọi khi API trả 401 hoặc phát hiện token hết hạn (Phase 7). */
  expireSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEV_USER: AuthUser = {
  id: 'dev',
  name: 'FPTU Student',
  initials: 'FS',
  email: 'student@fpt.edu.vn',
  campus: 'FPTU Hà Nội',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Có dev token → coi như đã đăng nhập. Không còn trạng thái 'loading'.
  const hasDevToken = getAccessToken() !== null;
  const [sessionExpired, setSessionExpired] = useState(false);
  const [status] = useState<AuthStatus>(hasDevToken ? 'authenticated' : 'unauthenticated');

  const signOut = useCallback(async () => {
    // Phase 7: gọi POST /api/auth/logout rồi clear SecureStore.
  }, []);

  const expireSession = useCallback(async () => {
    setSessionExpired(true);
  }, []);

  const signIn = useCallback(async () => {
    // Phase 7: Google OAuth / email-login → lưu session.
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session: hasDevToken
        ? ({
            accessToken: '',
            user: DEV_USER,
            expiresAt: Number.MAX_SAFE_INTEGER,
          } as unknown as Session)
        : null,
      user: hasDevToken ? DEV_USER : null,
      sessionExpired,
      signIn,
      signOut,
      expireSession,
    }),
    [status, hasDevToken, sessionExpired, signIn, signOut, expireSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
