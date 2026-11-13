// services/auth.ts
//
// Đăng nhập Google: promptGoogleSignIn() → POST /api/auth/google { credential }
// → access/refresh token + user → lưu SecureStore (session.ts) + gắn token runtime.

import { ApiError, apiFetch, getApiErrorMessage, setRuntimeToken } from '@/services/apiClient';
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
    source: 'google',
  };
  await saveSession(session);
  setRuntimeToken(session.accessToken);
  return session;
}

/**
 * Đăng nhập bằng email + mật khẩu (POST /api/auth/email-login — cùng contract
 * với web UI). Trả về cùng shape AuthResponse của /api/auth/google.
 * 401 code "invalid_credentials" khi email/password sai hoặc tài khoản bị khóa.
 */
export async function loginWithEmail(email: string, password: string): Promise<MobileSession> {
  let auth: AuthResponse;
  try {
    auth = await apiFetch<AuthResponse>('/api/auth/email-login', {
      method: 'POST',
      body: { email: email.trim(), password },
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
    source: 'email',
  };
  await saveSession(session);
  setRuntimeToken(session.accessToken);
  return session;
}

// ---------------------------------------------------------------------------
// Refresh token
//
// access token sống 30 phút; refresh token sống 7 ngày. Backend ROTATE refresh
// token (token cũ bị revoke, trả token mới) và coi việc refresh lại bằng token
// đã bị revoke là "token reuse" → **revoke cả family** (buộc đăng nhập lại).
// ⇒ Chỉ 1 refresh được phép chạy tại 1 thời điểm; các request khác CHỜ chung
// kết quả đó. Đây chính là handler mà apiClient gọi khi nhận 401.
// ---------------------------------------------------------------------------

/** Promise của refresh đang chạy — mọi caller sau chia sẻ cùng 1 request. */
let pendingRefresh: Promise<string | null> | null = null;

/**
 * Lấy access token mới từ refresh token. Trả token mới, hoặc `null` nếu không
 * thể (không có refresh token / refresh bị từ chối) — khi đó phiên coi là
 * hết hạn và người dùng phải đăng nhập lại.
 *
 * Được apiClient gọi tự động khi request ăn 401.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (pendingRefresh) return pendingRefresh;

  pendingRefresh = (async () => {
    try {
      const session = await loadSession();
      const raw = session?.refreshToken;
      if (!raw) return null;

      const auth = await apiFetch<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: raw },
        auth: false, // refresh dùng refresh token, không dùng access token
        skipAuthRefresh: true, // tránh vòng lặp refresh→401→refresh
      });

      const updated: MobileSession = {
        accessToken: auth.accessToken,
        expiresAtUtc: auth.expiresAtUtc,
        // BE ROTATE: refresh token cũ đã bị revoke, phải lưu token MỚI.
        refreshToken: auth.refreshToken ?? session.refreshToken,
        refreshTokenExpiresAtUtc: auth.refreshTokenExpiresAtUtc ?? session.refreshTokenExpiresAtUtc,
        user: auth.user,
        source: session.source,
      };
      await saveSession(updated);
      setRuntimeToken(updated.accessToken);
      return updated.accessToken;
    } catch (e) {
      // Phân biệt 2 loại lỗi:
      // - Server TỪ CHỐI refresh token (401/403): token hết hạn hoặc bị revoke
      //   (thường do reuse) → phiên chết thật → xóa session, user đăng nhập lại.
      // - Lỗi mạng / timeout: CHƯA biết token có hợp lệ không → GIỮ session,
      //   chỉ trả null để request hiện tại fail; lần sau sẽ thử refresh lại.
      const status = e instanceof ApiError ? e.status : 0;
      if (status === 401 || status === 403) {
        await clearSession();
        setRuntimeToken(null);
      }
      return null;
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
}

/**
 * Khôi phục session khi app mở (gọi 1 lần ở AppProvider).
 *
 * Access token chỉ sống 30 phút nên khi mở app, token trong SecureStore có
 * thể đã hết hạn. Nếu còn refresh token → refresh ngay để user không phải
 * đăng nhập lại; refresh fail → coi như chưa đăng nhập.
 */
export async function restoreSession(): Promise<MobileSession | null> {
  const session = await loadSession();
  if (!session) return null;
  setRuntimeToken(session.accessToken);

  // Token còn hạn → dùng luôn, không cần refresh.
  if (Date.parse(session.expiresAtUtc) > Date.now() + 30_000) return session;

  // Token hết hạn (hoặc sắp hết) → refresh bằng refresh token.
  const token = await refreshAccessToken();
  if (token) return loadSession();

  // Refresh thất bại. Phân biệt 2 trường hợp qua việc session còn trong
  // SecureStore hay không (refreshAccessToken chỉ xóa session khi server TỪ
  // CHỐI refresh token 401/403):
  // - Session còn → lỗi mạng tạm thời → GIỮ user đăng nhập, request sau sẽ
  //   tự thử refresh lại (không bắt user đăng nhập lại vì mạng chập chờn).
  // - Session đã bị xóa → refresh token chết → user phải đăng nhập lại.
  return loadSession();
}

/**
 * Đăng xuất: revoke phiên ở server (POST /api/auth/logout) rồi clear SecureStore.
 *
 * Endpoint logout yêu cầu `Authorization: Bearer <access token>` và body
 * `{ refreshToken }`; nó revoke cả family refresh token + bump security version
 * ⇒ mọi access token cũng chết. Gọi best-effort: nếu mạng lỗi vẫn xóa session
 * cục bộ (user không bị "mắc" ở màn đăng nhập).
 */
export async function logout(): Promise<void> {
  const initial = await loadSession();
  if (initial?.accessToken) {
    const revoke = async (refreshToken: string) => {
      await apiFetch<null>('/api/auth/logout', {
        method: 'POST',
        body: { refreshToken },
        skipAuthRefresh: true, // logout không được tự refresh rồi retry
      });
    };
    try {
      await revoke(initial.refreshToken ?? '');
    } catch (e) {
      // Access token hết hạn (30 phút) khi user bấm đăng xuất → refresh để có
      // token hợp lệ rồi revoke (giống web UI). Mạng lỗi / refresh chết → bỏ qua.
      if (e instanceof ApiError && e.status === 401 && initial.refreshToken) {
        const token = await refreshAccessToken();
        if (token) {
          const fresh = await loadSession();
          try {
            await revoke(fresh?.refreshToken ?? initial.refreshToken);
          } catch {
            /* best-effort */
          }
        }
      }
    }
  }
  await clearSession();
  setRuntimeToken(null);
}
