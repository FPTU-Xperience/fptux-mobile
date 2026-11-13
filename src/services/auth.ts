// services/auth.ts
//
// Đăng nhập Google: promptGoogleSignIn() → POST /api/auth/google { credential }
// → access/refresh token + user → lưu SecureStore (session.ts) + gắn token runtime.

import { apiFetch, getApiErrorMessage, setRuntimeToken } from '@/services/apiClient';
import { promptGoogleSignIn } from '@/services/googleAuth';
import { clearSession, loadSession, saveSession, type MobileSession } from '@/services/session';

import type { AuthResponse } from '@/types/api';

export class AuthError extends Error {
  readonly code: string | null;
  constructor(message: string, code: string | null = null) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/** Đăng nhập bằng Google (nút "Đăng nhập bằng Google" trong app). */
export async function loginWithGoogle(): Promise<MobileSession> {
  let credential: string;
  try {
    credential = await promptGoogleSignIn();
  } catch (e) {
    throw new AuthError(getApiErrorMessage(e));
  }

  let auth: AuthResponse;
  try {
    auth = await apiFetch<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: { credential },
      auth: false, // endpoint public — chưa có token nào
    });
  } catch (e) {
    throw new AuthError(getApiErrorMessage(e));
  }

  const session: MobileSession = {
    accessToken: auth.accessToken,
    expiresAtUtc: auth.expiresAtUtc,
    refreshToken: auth.refreshToken ?? null,
    refreshTokenExpiresAtUtc: auth.refreshTokenExpiresAtUtc ?? null,
    user: auth.user,
  };
  await saveSession(session);
  setRuntimeToken(session.accessToken);
  return session;
}

/** Khôi phục session khi app mở (gọi 1 lần ở AppProvider). */
export async function restoreSession(): Promise<MobileSession | null> {
  const session = await loadSession();
  if (session) setRuntimeToken(session.accessToken);
  return session;
}

/** Đăng xuất: clear SecureStore + gỡ token (POST /api/auth/logout là Phase 7). */
export async function logout(): Promise<void> {
  await clearSession();
  setRuntimeToken(null);
}
