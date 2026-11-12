// providers/AuthProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from '@/services/authStorage';
import { mockSignInWithGoogle } from '@/services/mockAuth';
import type { AuthStatus, AuthUser, Session } from '@/types/auth';

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: AuthUser | null;
  /** true khi người dùng bị đưa về login vì phiên hết hạn */
  sessionExpired: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Gọi khi API trả 401 hoặc phát hiện token hết hạn */
  expireSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const isSessionExpired = (s: Session) => Date.now() >= s.expiresAt;

// setTimeout tối đa ~24.8 ngày
const MAX_TIMEOUT = 2_147_483_647;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearAll = useCallback(async () => {
    await clearStoredSession();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const expireSession = useCallback(async () => {
    await clearAll();
    setSessionExpired(true);
  }, [clearAll]);

  const signOut = useCallback(async () => {
    await clearAll();
    setSessionExpired(false);
  }, [clearAll]);

  const signIn = useCallback(async () => {
    const next = await mockSignInWithGoogle();
    await saveStoredSession(next);
    setSession(next);
    setStatus('authenticated');
    setSessionExpired(false);
  }, []);

  // 1. Khôi phục phiên đã lưu khi mở app
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadStoredSession();
      if (cancelled) return;

      if (stored && !isSessionExpired(stored)) {
        setSession(stored);
        setStatus('authenticated');
      } else {
        if (stored) {
          await clearStoredSession();
          setSessionExpired(true);
        }
        setStatus('unauthenticated');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Hẹn giờ tự đăng xuất khi phiên hết hạn
  useEffect(() => {
    if (!session) return;
    const remaining = Math.min(Math.max(session.expiresAt - Date.now(), 0), MAX_TIMEOUT);
    const timer = setTimeout(() => {
      expireSession();
    }, remaining);
    return () => clearTimeout(timer);
  }, [session, expireSession]);

  // 3. Timer bị tạm dừng khi app ở nền, nên kiểm tra lại khi quay lại foreground
  useEffect(() => {
    if (!session) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && isSessionExpired(session)) {
        expireSession();
      }
    });
    return () => sub.remove();
  }, [session, expireSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      sessionExpired,
      signIn,
      signOut,
      expireSession,
    }),
    [status, session, sessionExpired, signIn, signOut, expireSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}