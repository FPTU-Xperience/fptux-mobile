// services/session.ts
//
// Lưu session (access token + user) vào SecureStore (native, encrypted).
// Shape tối giản cho Phase 2: lưu access token thật. Refresh/rotation là Phase 7.

import * as SecureStore from 'expo-secure-store';

import type { UserSummary } from '@/types/api';

const SESSION_KEY = 'clubhub.session';

export interface MobileSession {
  accessToken: string;
  user: UserSummary;
  /** ISO — access token hết hạn (BE trả expiresAtUtc). */
  expiresAtUtc: string;
  /** ISO — refresh token hết hạn (nếu BE có trả). */
  refreshToken?: string | null;
  refreshTokenExpiresAtUtc?: string | null;
}

export async function saveSession(session: MobileSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<MobileSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MobileSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
