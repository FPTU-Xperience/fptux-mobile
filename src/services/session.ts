// services/session.ts
//
// Lưu session (access token + user) vào SecureStore (native, encrypted).
// Shape tối giản cho Phase 2: lưu access token thật. Refresh/rotation là Phase 7.
//
// ⚠️ QUAN TRỌNG — không import `expo-secure-store` ở top-level:
// `expo-secure-store/build/ExpoSecureStore.js` gọi `requireNativeModule('ExpoSecureStore')`
// ngay ở module scope. Khi `expo export:embed` evaluate bundle trong Node (không có native
// runtime), nó crash với "Invariant Violation: __fbBatchedBridgeConfig is not set".
// ⇒ Import ĐỘNG trong hàm, chỉ chạy trên app thật.

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

async function getSecureStore() {
  return import('expo-secure-store');
}

export async function saveSession(session: MobileSession): Promise<void> {
  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<MobileSession | null> {
  try {
    const SecureStore = await getSecureStore();
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MobileSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    const SecureStore = await getSecureStore();
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {
    // bỏ qua: phiên vẫn dùng được trong bộ nhớ, chỉ không giữ lại sau khi tắt app
  }
}
