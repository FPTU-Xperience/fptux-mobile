// providers/AuthProvider.tsx
//
// Provider phiên đăng nhập. Hỗ trợ 2 nguồn token (theo thứ tự ưu tiên):
//  1. Session Google thật (SecureStore) — loginWithGoogle() (Phase 2)
//  2. Dev token (.env EXPO_PUBLIC_DEV_ACCESS_TOKEN) — fallback khi chưa build APK Google
//
// Refresh/rotation là Phase 7. Đợt này: login + restore + logout cơ bản.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loginWithEmail, loginWithGoogle, logout, refreshAccessToken } from '@/services/auth';
import { getAccessToken, setAuthFailureHandler, setRefreshHandler } from '@/services/apiClient';
import type { AuthStatus, AuthUser, Session } from '@/types/auth';

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: AuthUser | null;
  /** true khi phiên hết hạn và cần đăng nhập lại. */
  sessionExpired: boolean;
  signIn: () => Promise<void>;
  /** Đăng nhập bằng email + mật khẩu (POST /api/auth/email-login). */
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Gọi khi API trả 401 (Phase 7: refresh; đợt này chỉ đánh dấu hết hạn). */
  expireSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // apiClient gọi 2 handler này:
  // - refreshHandler: nhận 401 → refresh access token rồi thử lại request.
  // - authFailureHandler: refresh hỏng → phiên hết hạn, đưa user về login.
  useEffect(() => {
    setRefreshHandler(refreshAccessToken);
    setAuthFailureHandler(() => {
      // Phiên hết hạn thật (refresh token chết) → đăng xuất khỏi app để
      // guard của Stack.Protected đưa user về màn login, kèm cảnh báo.
      setSessionExpired(true);
      setUser(null);
      setSession(null);
      setStatus('unauthenticated');
    });
    return () => {
      setRefreshHandler(null);
      setAuthFailureHandler(null);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // restoreSession() (load SecureStore + setRuntimeToken) chạy ở đây
      const { restoreSession } = await import('@/services/auth');
      const restored = await restoreSession();
      if (cancelled) return;
      // Có session (Google/email) HOẶC dev token → authenticated
      const token = restored?.accessToken ?? getAccessToken();
      if (token) {
        setUser(
          restored?.user
            ? toAuthUser(restored.user)
            : { id: 'dev', name: 'FPTU Student', initials: 'FS', email: 'student@fpt.edu.vn', campus: 'FPTU Hà Nội' },
        );
        setSession(
          {
            accessToken: token,
            user: restored?.user ?? null,
            expiresAt: restored ? Date.parse(restored.expiresAtUtc) : Number.MAX_SAFE_INTEGER,
            // Giữ nguồn đăng nhập đã lưu; session cũ (trước khi có `source`) coi là google.
            source: restored?.source ?? (restored ? 'google' : 'dev'),
          } as unknown as Session,
        );
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async () => {
    setStatus('loading');
    setSessionExpired(false);
    try {
      const s = await loginWithGoogle();
      setUser(toAuthUser(s.user));
      setSession({
        accessToken: s.accessToken,
        user: s.user,
        expiresAt: Date.parse(s.expiresAtUtc),
        source: 'google',
      } as unknown as Session);
      setStatus('authenticated');
    } catch {
      // Giữ nguyên trạng thái (unauthenticated nếu chưa có dev token)
      setStatus(getAccessToken() ? 'authenticated' : 'unauthenticated');
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setStatus('loading');
    setSessionExpired(false);
    try {
      const s = await loginWithEmail(email, password);
      setUser(toAuthUser(s.user));
      setSession({
        accessToken: s.accessToken,
        user: s.user,
        expiresAt: Date.parse(s.expiresAtUtc),
        source: 'email',
      } as unknown as Session);
      setStatus('authenticated');
    } catch (e) {
      // Trả lỗi cho UI hiển thị (sai email/mật khẩu, tài khoản bị khoá, mạng...).
      setStatus(getAccessToken() ? 'authenticated' : 'unauthenticated');
      throw e;
    }
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  /** Đánh dấu phiên hết hạn và đưa user về màn login. */
  const expireSession = useCallback(async () => {
    setSessionExpired(true);
    setUser(null);
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, user, sessionExpired, signIn, signInWithEmail, signOut, expireSession }),
    [status, session, user, sessionExpired, signIn, signInWithEmail, signOut, expireSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function toAuthUser(u: { fullName: string; email: string; id: number }): AuthUser {
  const initials = u.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
  return { id: String(u.id), name: u.fullName, initials, email: u.email, campus: '' };
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
