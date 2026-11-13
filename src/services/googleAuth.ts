// services/googleAuth.ts
//
// Google Sign-In native qua `react-native-nitro-google-signin`
// (docs Expo "Google authentication" recommend lib này cho Android vì hỗ trợ
//  Android Credential Manager; provider Google của `expo-auth-session` đã deprecated).
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

import { GoogleOneTapSignIn, isCancelledResponse, statusCodes } from 'react-native-nitro-google-signin';

let configured = false;

/** Cấu hình 1 lần cho app (gọi ở bootstrap, trước khi bấm đăng nhập). */
export function configureGoogleSignIn(): void {
  if (configured) return;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!webClientId) {
    throw new Error(
      'Thiếu EXPO_PUBLIC_GOOGLE_CLIENT_ID. Điền Web client ID của Google (cùng giá trị BE dùng cho GOOGLE_CLIENT_ID) rồi build lại app.',
    );
  }
  GoogleOneTapSignIn.configure({
    webClientId,
    offlineAccess: false,
    hostedDomain: null,
  });
  configured = true;
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
 * Mở flow đăng nhập Google và trả ID token (JWT) để gửi lên
 * `POST /api/auth/google { credential }`.
 */
export async function promptGoogleSignIn(): Promise<string> {
  configureGoogleSignIn();

  let response: Awaited<ReturnType<typeof GoogleOneTapSignIn.signIn>>;
  try {
    response = await GoogleOneTapSignIn.signIn();
  } catch (e) {
    const code =
      typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : '';
    if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new GoogleSignInFailure(
        'Thiết bị chưa có Google Play Services hoặc đang quá cũ. Vui lòng cập nhật rồi thử lại.',
        code,
      );
    }
    if (code === statusCodes.DEVELOPER_ERROR) {
      throw new GoogleSignInFailure(
        'Cấu hình Google Sign-In sai (package name / SHA-1 / client ID). Kiểm tra lại phần cấu hình Google Cloud.',
        code,
      );
    }
    throw new GoogleSignInFailure(
      e instanceof Error && e.message ? e.message : 'Đăng nhập Google thất bại.',
      code || 'UNKNOWN',
    );
  }

  if (isCancelledResponse(response)) {
    throw new GoogleSignInFailure('Bạn đã hủy đăng nhập Google.', statusCodes.SIGN_IN_CANCELLED);
  }

  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new GoogleSignInFailure('Google không trả về ID token.', 'NO_ID_TOKEN');
  }
  return idToken;
}
