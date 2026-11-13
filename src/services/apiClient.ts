// services/apiClient.ts
//
// HTTP client cho FPTU ClubHub API Gateway (EXPO_PUBLIC_API_URL).
// Đợt này dùng dev access token (auth thật là Phase 7 — refresh/rotation, SecureStore).
//
// - Mọi request mặc định gắn `Authorization: Bearer <dev token>`.
// - Lỗi chuẩn hóa thành ApiError { status, code, errors } + thông điệp tiếng Việt.
// - Không auto-refresh (chưa có refresh token) → 401 sẽ trả thông điệp rõ.

const BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_URL ?? 'https://clubreporthub.duckdns.org').replace(/\/+$/, '');

/** Dev token lấy từ .env (fallback khi chưa login Google thật). */
const DEV_ACCESS_TOKEN: string | null =
  (process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN ?? '').trim() || null;

/** Token runtime — đặt khi login Google thành công (auth.ts gọi setRuntimeToken). */
let runtimeToken: string | null = null;

/** Đăng nhập (auth.ts) gọi hàm này để gắn token thật; logout gọi `setRuntimeToken(null)`. */
export function setRuntimeToken(token: string | null): void {
  runtimeToken = token;
}

/** Chọn token: runtime (login Google) > dev token (.env). */
export function getAccessToken(): string | null {
  return runtimeToken ?? DEV_ACCESS_TOKEN;
}

export class ApiError extends Error {
  /** Mã lỗi ổn định của API (vd "REGISTRATION_CLOSED"), null nếu response không có. */
  readonly code: string | null;
  readonly status: number;
  /** Field-level validation errors (nếu có). */
  readonly errors: Record<string, string[]> | null;

  constructor(message: string, status: number, code: string | null, errors: Record<string, string[]> | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiFetchOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Gắn Bearer token — mặc định true. */
  auth?: boolean;
  /** Timeout ms — mặc định 20000. */
  timeoutMs?: number;
  /** Header bổ sung (vd Idempotency-Key). */
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

async function doFetch(
  path: string,
  opts: ApiFetchOptions,
  token: string | null,
): Promise<ApiResponse<unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000);
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.auth === false ? {} : { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    };
    const res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? 'GET',
      signal: controller.signal,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });

    let data: unknown = null;
    if (res.status !== 204) {
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text; // response không phải JSON (nhiều endpoint trả string/plain)
        }
      }
      // 2xx nhưng body rỗng
      if (res.ok && data === null && text === '') data = null;
    }
    if (res.ok) return { ok: true, status: res.status, data };

    // Parse error body: { message, code?, errors? } hoặc RFC7807 { title, status }
    let code: string | null = null;
    let errors: Record<string, string[]> | null = null;
    let serverMessage: string | null = null;
    if (typeof data === 'object' && data !== null) {
      const body = data as Record<string, unknown>;
      code = typeof body.code === 'string' ? body.code : null;
      if (body.errors && typeof body.errors === 'object') {
        const parsed: Record<string, string[]> = {};
        for (const [k, v] of Object.entries(body.errors as Record<string, unknown>)) {
          parsed[k] = Array.isArray(v) ? (v as unknown[]).map(String) : [String(v)];
        }
        errors = parsed;
      }
      serverMessage =
        typeof body.message === 'string' ? body.message : typeof body.title === 'string' ? body.title : null;
    }
    return { ok: false, status: res.status, data: { message: serverMessage, code, errors, status: res.status } };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Gọi API, parse response. Lỗi → throw ApiError (message đã map sang tiếng Việt
 * qua API_ERROR_MESSAGES nếu có code; không có code thì dùng message server hoặc HTTP status).
 */
export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const token = opts.auth === false ? null : getAccessToken();
  if (opts.auth !== false && !token) {
    // Chưa có dev token: ném lỗi rõ ràng để UI hiện hướng dẫn (không fake data)
    throw new ApiError('CHưa cấu hình EXPO_PUBLIC_DEV_ACCESS_TOKEN trong .env', 401, 'MISSING_DEV_TOKEN', null);
  }
  const result = await doFetch(path, opts, token);
  if (!result.ok) {
    const errBody = result.data as {
      message?: string | null;
      code?: string | null;
      errors?: Record<string, string[]> | null;
      status?: number;
    };
    throw new ApiError(
      describeApiError(errBody?.status ?? 0, errBody?.code ?? null, errBody?.message ?? null, errBody?.errors ?? null),
      errBody?.status ?? 0,
      errBody?.code ?? null,
      errBody?.errors ?? null,
    );
  }
  return result.data as T;
}

/** URL join: không trùng /api. */
export function apiPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Build query string từ object (bỏ null/undefined/'' ). */
export function toQuery(params: Record<string, string | number | boolean | null | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined || v === '') continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

// ---------------------------------------------------------------------------
// Error mapping (code → tiếng Việt). Dùng bảng này trong UI (thông báo toast/Alert).
// ---------------------------------------------------------------------------

const API_ERROR_MESSAGES: Record<string, string> = {
  // Auth / session
  MISSING_DEV_TOKEN: 'Chưa cấu hình token phát triển. Hãy đặt EXPO_PUBLIC_DEV_ACCESS_TOKEN trong .env.',
  UNAUTHORIZED: 'Phiên đăng nhập không hợp lệ. Vui lòng lấy token mới.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  // Activities / registration
  REGISTRATION_CLOSED: 'Đăng ký đã đóng cho hoạt động này.',
  ACTIVITY_FULL: 'Hoạt động đã đầy đủ chỗ.',
  SELF_REGISTRATION_ONLY: 'Bạn chỉ có thể đăng ký cho chính mình.',
  REGISTRATION_REQUIRED: 'Bạn cần đăng ký trước khi điểm danh.',
  // Check-in / attendance
  ATTENDANCE_CLOSED: 'Phiên điểm danh đã đóng.',
  INVALID_ATTENDANCE_CHALLENGE: 'Mã QR không hợp lệ hoặc hết hạn. Vui lòng quét lại.',
  LOCATION_OUTSIDE_POLICY: 'Bạn không nằm trong phạm vi điểm danh. Hãy đứng gần địa điểm hơn.',
  ATTENDANCE_REVOKED: 'Lượt điểm danh này đã bị thu hồi và không thể khôi phục.',
  QR_REQUIRED: 'Thiếu mã điểm danh (sessionId + challenge).',
  ATTENDANCE_UNCONFIGURED: 'Hệ thống điểm danh chưa được cấu hình. Vui lòng thử lại sau.',
  MEMBERSHIP_SERVICE_UNAVAILABLE: 'Không thể xác minh thành viên. Vui lòng thử lại sau.',
  // Clubs
  CLUB_CLOSED: 'CLB hiện không đang tuyển thành viên.',
  INVALID_DISCOVERY_QUERY: 'Yêu cầu tìm kiếm không hợp lệ. Vui lòng thử lại.',
  INVALID_ACTIVITY_STATUS: 'Trạng thái hoạt động không hợp lệ.',
  DISCOVERY_AUTHORITY_UNAVAILABLE: 'Quyền xem hoạt động tạm thời không khả dụng. Vui lòng thử lại sau.',
  // Experience / radar
  SCORE_POLICY_UNAPPROVED: 'Chính sách điểm chưa được phê duyệt. Đang hiển thị dữ liệu dự phòng.',
  SCORE_POLICY_UNSUPPORTED: 'Chính sách điểm chưa hỗ trợ. Vui lòng thử lại sau.',
  SEMESTER_REQUIRED: 'Vui lòng chọn học kỳ trước.',
  RECOMMENDATION_SOURCE_UNAVAILABLE: 'Nguồn đề xuất không khả dụng. Đang hiển thị danh sách hoạt động thường.',
  RECOMMENDATION_SOURCE_CHANGED: 'Dữ liệu đề xuất đã thay đổi. Vui lòng tải lại.',
  // Profile / schedule
  STALE_PROFILE: 'Hồ sơ đã thay đổi. Vui lòng tải lại rồi thử lần nữa.',
  CALENDAR_CHANGED: 'Lịch học đã thay đổi. Vui lòng tải lại.',
  SEMESTER_UNCONFIGURED: 'Học kỳ này chưa được cấu hình lịch.',
  SEMESTER_ALIAS_AMBIGUOUS: 'Học kỳ không rõ ràng. Vui lòng kiểm tra lại.',
  SEMESTER_READ_ONLY: 'Học kỳ đã khóa. Không thể chỉnh sửa.',
  RESOURCE_ACCESS_DENIED: 'Bạn không có quyền xem tài nguyên này.',
  RESOURCE_LIMIT_REACHED: 'Hoạt động đã đạt giới hạn tài nguyên đính kèm.',
  ACTIVITY_CANCELLED: 'Hoạt động đã bị hủy — dữ liệu chỉ đọc.',
  ACTIVITY_NOT_FOUND: 'Không tìm thấy hoạt động.',
  INVALID_SELF_PROFILE: 'Dữ liệu hồ sơ không hợp lệ.',
  ACCOUNT_INELIGIBLE: 'Tài khoản không hợp lệ để thực hiện thao tác này.',
  // Common
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  VERSION_CONFLICT: 'Dữ liệu đã thay đổi. Vui lòng tải lại và thử lại.',
  DUPLICATE: 'Thao tác đã được thực hiện trước đó.',
  RATE_LIMITED: 'Bạn gửi yêu cầu quá nhanh. Vui lòng thử lại sau.',
  SERVICE_UNAVAILABLE: 'Hệ thống tạm thời không khả dụng. Vui lòng thử lại sau.',
};

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.',
  401: 'Phiên đăng nhập không hợp lệ. Vui lòng lấy token mới.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu.',
  409: 'Trạng thái dữ liệu xung đột. Vui lòng tải lại và thử lại.',
  422: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  429: 'Bạn gửi yêu cầu quá nhanh. Vui lòng thử lại sau.',
  500: 'Có lỗi ở máy chủ. Vui lòng thử lại sau.',
  503: 'Hệ thống tạm thời không khả dụng. Vui lòng thử lại sau.',
};

/** Chọn thông điệp cho UI: theo code → theo HTTP status → message server. */
export function describeApiError(
  status: number,
  code: string | null,
  serverMessage: string | null,
  _errors: Record<string, string[]> | null,
): string {
  if (code && API_ERROR_MESSAGES[code]) return API_ERROR_MESSAGES[code];
  if (status >= 400 && status < 600 && HTTP_STATUS_MESSAGES[status]) return HTTP_STATUS_MESSAGES[status];
  if (serverMessage) return serverMessage;
  return 'Có lỗi không xác định. Vui lòng thử lại sau.';
}

/** Dùng trong catch của component: trả thông điệp tiếng Việt cho mọi lỗi. */
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) {
    if (err.name === 'AbortError') return 'Yêu cầu quá thời gian. Vui lòng thử lại.';
    if (err.message) return err.message;
  }
  return 'Có lỗi không xác định. Vui lòng thử lại sau.';
}

/** HTTP status + code có phải lỗi "không tìm thấy" (để UI hiện EmptyState thay vì ErrorState). */
export function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 404 || err.code === 'NOT_FOUND');
}
