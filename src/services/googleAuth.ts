// services/googleAuth.ts
//
// Google Sign-In native qua `react-native-nitro-google-signin`
// (docs Expo "Google authentication" recommend lib này cho Android vì hỗ trợ
//  Android Credential Manager; provider Google của `expo-auth-session` đã deprecated).
//
// ⚠️ QUAN TRỌNG — không import lib ở top-level:
// `react-native-nitro-google-signin/src/GoogleOneTapSignIn.ts` gọi
// `NitroModules.createHybridObject()` ngay ở module scope. Nếu file này được
// require trong môi trường không có native runtime (ví dụ `expo export:embed`
// khi build — Expo Router evaluate bundle trong Node để sinh server manifest),
// nó sẽ gọi native module và crash với:
//   "Invariant Violation: __fbBatchedBridgeConfig is not set, cannot invoke native modules"
// ⇒ Ta import ĐỘNG (dynamic import) trong hàm, chỉ chạy trên app thật.
//
// API (đọc từ source package):
//   GoogleOneTapSignIn.configure({ webClientId, iosClientId?, offlineAccess?, hostedDomain? })
//   GoogleOneTapSignIn.signIn() → { data: { user, idToken, serverAuthCode, scopes } }
//
// QUAN TRỌNG — audience:
//   `webClientId` PHẢI là **Web OAuth client ID** (dạng *.apps.googleusercontent.com),
//   và đó chính là `GOOGLE_CLIENT_ID` mà BE dùng để validate `aud` của ID token.
//   Source của lib ghi rõ: truyền *Android* client ID vào `webClientId` → DEVELOPER_ERROR.
//   ⇒ Token trả về có `aud` = Web client ID ⇒ khớp BE ⇒ **BE không cần đổi**.
//   Android OAuth client (package name + SHA-1) chỉ dùng để định danh app cho Google.
//
// Yêu cầu build: development build / standalone APK (native code — không chạy được Expo Go).

import type { OneTapResponse } from 'react-native-nitro-google-signin';

type NitroGoogleSignInModule = typeof import('react-native-nitro-google-signin');

let libPromise: Promise<NitroGoogleSignInModule> | null = null;

/** Load lib native lazily (chỉ resolve được trong app runtime). */
async function loadLib(): Promise<NitroGoogleSignInModule> {
  libPromise ??= import('react-native-nitro-google-signin');
  return libPromise;
}

export class GoogleSignInFailure extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'GoogleSignInFailure';
    this.code = code;
  }
}

/**
 * Đăng nhập Google và trả ID token (JWT) để gửi lên
 * `POST /api/auth/google { credential }`.
 */
export async function promptGoogleSignIn(): Promise<string> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!webClientId) {
    throw new GoogleSignInFailure(
      'Thiếu EXPO_PUBLIC_GOOGLE_CLIENT_ID. Điền Web client ID của Google (cùng giá trị BE dùng cho GOOGLE_CLIENT_ID) rồi build lại app.',
      'NO_CLIENT_ID',
    );
  }

  const { GoogleOneTapSignIn, isCancelledResponse, isErrorWithCode, isSuccessResponse, statusCodes } =
    await loadLib();

  // Cấu hình 1 lần (idempotent).
  GoogleOneTapSignIn.configure({
    webClientId,
    offlineAccess: false,
    hostedDomain: null,
  });

  let response: OneTapResponse;
  try {
    response = await GoogleOneTapSignIn.signIn();
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleSignInFailure(
          'Thiết bị chưa có Google Play Services hoặc đang quá cũ. Vui lòng cập nhật rồi thử lại.',
          e.code,
        );
      }
      if (e.code === statusCodes.DEVELOPER_ERROR) {
        throw new GoogleSignInFailure(
          'Cấu hình Google Sign-In sai (package name / SHA-1 / client ID). Kiểm tra lại phần cấu hình Google Cloud.',
          e.code,
        );
      }
      throw new GoogleSignInFailure(e.message, e.code);
    }
    throw new GoogleSignInFailure(
      e instanceof Error && e.message ? e.message : 'Đăng nhập Google thất bại.',
      'UNKNOWN',
    );
  }

  if (isCancelledResponse(response)) {
    throw new GoogleSignInFailure('Bạn đã hủy đăng nhập Google.', statusCodes.SIGN_IN_CANCELLED);
  }

  if (!isSuccessResponse(response)) {
    throw new GoogleSignInFailure('Google không trả về ID token.', 'NO_ID_TOKEN');
  }
  return response.data.idToken;
}
