# Kế hoạch thay thế mock data của fptux-mobile bằng API thật (EXPO_PUBLIC_API_URL)

> Ngày: 2026-05-08 · Người viết: Claude Code · Trạng thái: bản kế hoạch (chưa viết code)
>
> Mục tiêu: gỡ toàn bộ `src/services/mock*.ts` khỏi app, mọi màn hình đọc dữ liệu từ FPTU ClubHub API Gateway (`EXPO_PUBLIC_API_URL=https://clubreporthub.duckdns.org`).
>
> **Quyết định đã chốt (2026-05-08):**
> 1. **Đăng nhập: tạm bỏ qua.** Không implement OAuth/email-login trong đợt này. AuthProvider + `mockAuth.ts` giữ nguyên cho tới Phase cuối. Hệ quả: các endpoint cần Bearer token sẽ được gọi với **token phát triển** (`EXPO_PUBLIC_DEV_ACCESS_TOKEN`) để test dữ liệu thật trước khi có luồng đăng nhập. Xem §3.2.
> 2. **QR check-in: chờ BE xác nhận** payload QR. Phase 5 (scan/check-in) **không triển khai** cho tới khi rõ. Xem §7 rủi ro #1.
> 3. **Được phép refactor component/UI** cho khớp dữ liệu thật — không bị ràng buộc giữ nguyên type cũ. Mapping layer vẫn dùng, nhưng có thể bỏ các trường trình bày và ghi trực tiếp shape API vào type.

---

## 1. Phân tích hiện trạng

### 1.1. Mô hình mobile hiện tại

- Expo SDK 58 (React Native 0.88, Expo Router, TypeScript), không có HTTP client nào cả.
- 10 mock service trong `src/services/`, mỗi cái export hàm trả về type trong `src/types/`:

| Mock service | Màn hình dùng | Bản chất |
|---|---|---|
| `mockAuth.ts` | `login.tsx`, `AuthProvider` | Google SSO giả lập, user cứng, session TTL 1h, lưu SecureStore `clubhub.session` |
| `mockActivities.ts` | `(tabs)/activity.tsx` | danh sách event + filter |
| `mockActivityDetail.ts` | `event/[id].tsx` | detail event + `registerForActivity` |
| `mockClubs.ts` | `(tabs)/allClubs.tsx` | danh sách CLB + filter |
| `mockClubDetail.ts` | `club/[id].tsx`, `my-clubs.tsx` | detail CLB + `applyToClub` (join) |
| `mockMyClubs.ts` | `(tabs)/my-clubs.tsx` | CLB của tôi + đơn xin + featured |
| `mockProfile.ts` | `(tabs)/profile.tsx` | hồ sơ, radar năng lực, skills, clubs |
| `mockRecommendation.ts` | `(tabs)/explore.tsx` | hero + events + clubs + pagination |
| `mockSchedule.ts` | `(tabs)/schedule.tsx` | "Sắp tới" / "Đã tham gia" |
| `mockScan.ts` | `(tabs)/scan.tsx` | GPS→địa điểm, mã QR → check-in |

- Vấn đề: UI (component `EventCard`, `ClubCard`, `ScheduleItem`, `RadarChart`…) render theo **type hiện có** chứa nhiều trường chỉ dành cho presentation (`bannerColor`, `dateBoxBg`, `iconBg`, `logoCode`, `venue.kind`…). API thật **không trả** các trường đó → cần mapping layer, không được sửa component.

### 1.2. Mô hình ClubHub UI (điểm tham chiếu)

`fptu-xperience-clubhub-ui/src/services/`:

- `session-client.js` — quản lý session record (token + user) trong localStorage, refresh token rotation, 401 handling, event bus. **Mobile tương đương: dùng `expo-secure-store` thay localStorage, giữ logic refresh/rotation, bỏ phần Web Locks / cookie bootstrap.**
- `browser-session.js`, `staff-sso.js`, `google-signin.js` — riêng web (cookie SSO, PKCE staff, Google Identity Services). **Mobile bỏ**, chỉ giữ flow Google ID token → `POST /api/auth/google` (nếu dùng OAuth native qua `expo-auth-session`) hoặc `POST /api/auth/email-login`.
- `permissions.js` — roles/permissions model. **Mobile chỉ cần roles hiển thị, không gate UI theo permission như web.**
- Facade `api.js` (~95 wrapper) — mobile chỉ lấy **tập con** cho student: clubs, activities, memberships, experience, schedule, auth (xem §2).

### 1.3. Gateway & auth (từ repo API)

- Tất cả gọi qua 1 Gateway (YARP, port 7000 / production `clubreporthub.duckdns.org`), đường prefix `/api/...`. Mobile: `EXPO_PUBLIC_API_URL` chính là root này.
- Auth: **JWT Bearer** (`Authorization: Bearer <accessToken>`), access TTL 30 phút, **refresh token rotation** qua `POST /api/auth/refresh` (khi 401 → refresh 1 lần, re-issue; login mới thì refresh token cũ bị thu hồi — mỗi lần refresh phải lưu token mới ngay).
- Error contract: `{ message, code?, errors?, traceId? }` — client chỉ cần giữ `message` và `code` (xem §5).
- CORS Gateway chỉ mở cho web origin — **không ảnh hưởng mobile** (native app không bị CORS ràng buộc; web build của mobile, nếu có, phải chạy qua proxy).

---

## 2. Toàn bộ endpoint cần cho mobile (bản đầy đủ)

> Tất cả đường sau đã được xác nhận tồn tại trong `fptu-xperience-clubhub-api`. `[auth]` = cần Bearer token.

### 2.1. Identity / Auth

> **Deferred** (quyết định #1) — đợt này dùng **dev access token** để gọi API. Endpoint dưới đây được liệt kê để tham chiếu cho Phase 7 (§11).

| # | Endpoint | Dùng cho | Ghi chú |
|---|---|---|---|
| A0 | `EXPO_PUBLIC_DEV_ACCESS_TOKEN` (env, không phải endpoint) | **Dùng thật trong đợt này** | Bearer token cho mọi request. TTL 30 phút → cần script lấy lại hoặc token test dài hạn |
| A1 | `POST /api/auth/google` `[public]` | Login Google (Phase 7) | Body `{ credential }` (Google ID token từ `expo-auth-session` native). Response: `{ accessToken, expiresAtUtc, user, refreshToken?, refreshTokenExpiresAtUtc? }` |
| A2 | `POST /api/auth/email-login` `[public]` | Login email (Phase 7) | Body `{ email, password }` |
| A3 | `POST /api/auth/refresh` `[public]` | Khi access token 401 (Phase 7) | Body `{ refreshToken }` → token mới (rotation) |
| A4 | `POST /api/auth/logout` `[auth]` | Đăng xuất (Phase 7) | Body `{ refreshToken }` |
| A5 | `GET /api/users/me` `[auth]` | Lấy/verify user | User summary: `id, username, fullName, email, roles[], isActive, isLocked, campusCode` |

**Quét mã QR** (flow chi tiết, thay `mockScan.submitCheckIn`):

| # | Endpoint | Ghi chú |
|---|---|---|
| S1 | `GET /api/activities/{activityId}/sessions` `[auth]` | Lấy các session SCHEDULED (để biết `nextSessionId`). Trong feed/detail, session hiện tại thường được trả sẵn (trường `nextSessionId`/`version` của feed item). |
| S2 | `GET /api/activities/{activityId}/sessions/{sessionId}/attendance-challenge` `[auth]` | QR thật: `{ challenge, issuedAt, expiresAt(+30s), serverTime, sessionId }` — **QR rotation 30s, do manager/CAN issue; sinh viên không gọi được endpoint này**. Sinh viên đọc challenge từ QR do manager phát hoặc từ feed. |
| S3 | `POST /api/activities/{activityId}/check-in` `[auth]` | Body `SessionCheckInRequest = { sessionId, challenge, location? (lat/long/accuracy) }` → attendance record `{ attendanceId, status, attendanceStatus, verificationMethod, verifiedAt, ... }`. Code lỗi: `QR_REQUIRED`, `ATTENDANCE_CLOSED` (409), `INVALID_ATTENDANCE_CHALLENGE` (400), `LOCATION_OUTSIDE_POLICY` (403), `REGISTRATION_REQUIRED` (409 — phải đăng ký trước), `ATTENDANCE_REVOKED`. |
| S4 (fallback) | `POST /api/activities/{activityId}/participants` `[auth]` | Register (xem E2). Khi session không có challenge (mode offline), endpoint cũ tự sinh attendance. |

> GPS → tên địa điểm: API **không có geocoding endpoint** (tương ứng `mockScan.fetchPlaceInfo`). Đây là 2 khả năng: (a) giữ mock `fetchPlaceInfo` riêng (đúng ý định "mobile là client check-in chính", GPS chỉ là context hiển thị), hoặc (b) thêm endpoint `POST /api/geocode` (ngoài SOW hiện tại, cần BE approve). **Khuyến nghị: (a)** — chỉ nối S1–S4.

### 2.2. Discovery / Recommendation (thay `mockRecommendation.ts` + `mockActivities.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| R1 | `GET /api/v2/activities/feed` `[auth]` | Feed hoạt động của campus (UPCOMING + LIVE + sắp kết thúc). Params: `clubId, search, status=UPCOMING|LIVE, semesterId, page, pageSize`. Trả về items có: `id, clubId, clubCode, clubName, title, description, coverImageUrl, startTime/endTime, location, status (UPCOMING/LIVE/COMPLETED), action (REGISTER/CHECK_IN/VIEW), isRegistered, canCancelRegistration, nextSessionId, version, policyVersion, pillarWeights[], recommendationSource`. |
| R2 | `GET /api/v2/recommendations/activities` `[auth]` | 6 hoạt động "recommended" (cho hero/quick card). Error codes: `SCORE_POLICY_UNAPPROVED`, `SEMESTER_REQUIRED`, `RECOMMENDATION_SOURCE_UNAVAILABLE`. **Fallback: nếu lỗi, dùng R1 (page 1) và che hero.** |
| R3 | `GET /api/v2/activities/{id}` `[auth]` | Detail item (cùng shape R1) — dùng khi cần mở lại đúng hoạt động. |

### 2.3. Clubs (thay `mockClubs.ts` + `mockClubDetail.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| C1 | `GET /api/clubs?active=true&recruiting=true&campus={code}&search=&category=` `[auth]` | Danh sách CLB (directory view, chưa phân trang — trả về array). Filter `category` là **category code** (xem C2). `recruiting=true` → tab "Đang tuyển". |
| C2 | `GET /api/clubs/categories` `[auth]` | Lấy danh sách category (id/code/name/count) — thay mock filters `all/academic/tech/community`. |
| C3 | `GET /api/clubs/{id}` `[auth]` | Chi tiết CLB (`ClubPublicDetailResponse`: `id, code, name, category, description, logoUrl, scheduleLabel, isRecruiting, coverImageUrl, locationLabel, memberCount, contactEmail/Phone, publicLeaders[], version, schedule (JsonElement), expectedLocation, majorEvents, equipmentNeeds`). |
| C4 | `POST /api/clubs/{id}/join` `[auth]` | Nộp đơn xin gia nhập. Body `JoinClubRequest` (fullName, email, phoneNumber, reason, skills, expectations, contributions, additionalInfo…). Lỗi: `CLUB_CLOSED` (409 khi không đang tuyển). |

### 2.4. My clubs / Applications (thay `mockMyClubs.ts` + phần apply trong `mockClubDetail.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| M1 | `GET /api/clubs/me/access` `[auth]` | Các CLB mình có membership (approved member/manager/treasurer) → tab "CLB của tôi". Mỗi record: `clubId, clubName, role, isApprovedMember, joinedAt, ...`. |
| M2 | `GET /api/clubs/me/memberships` `[auth]` | Mọi membership (kể cả pending/approved/rejected) — dùng hiển thị trạng thái đơn xin. |
| M3 | `GET /api/clubs/me/membership-applications` `[auth]` | Danh sách đơn xin của mình (self-only, có `canWithdraw` flag) → tab "Đã gửi đơn". |
| M4 | `POST /api/clubs/me/membership-applications/{id}/withdraw` `[auth]` | Rút đơn (pending + source=Application). |
| M5 | `GET /api/activities?clubId={id}` `[auth]` | Hoạt động của từng CLB trong "CLB của tôi" (lấy `nextActivity` cho MyClubCard). |

### 2.5. Profile / Experience (thay `mockProfile.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| P1 | `GET /api/users/me/profile` `[auth]` | Canonical profile: fullName, email, campusCode, academicFields… (5 trường chuẩn). |
| P2 | `GET /api/v1/declarations/me/radar?semester={id}` `[auth]` | Radar 6+1 trục + chỉ số ERI/D/J/M + danh hiệu — vào `RadarChart`. |
| P3 | `GET /api/users/me/contributions?page=1&pageSize=N` `[auth]` | Lịch sử contribution (tab "Minh chứng"). |
| P4 | `GET /api/users/me/experience-summary?semester={id}` `[auth]` | Tổng XP (raw vs credited) + counters (activity count, attendance) — vào StatGrid. |

### 2.6. Schedule / Timetable (thay `mockSchedule.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| T1 | `GET /api/academic-calendar/{year}/{term}` `[auth]` | Calendar + slots (block, slot times) — định khung tuần. |
| T2 | `GET /api/users/me/study-schedule/{year}/{term}/{block}` `[auth]` | Lịch học tuần của user (tự động có sẵn nếu admin đã import). |
| T3 | `GET /api/activities?clubId=&status=&fromUtc=&toUtc=` `[auth]` | Hoạt động sắp tới / đã tham gia (thay tab "Sắp tới" / "Đã tham gia"). |

> Tab "Đã tham gia" chính xác là attendance: `GET /api/activities/{id}/my-attendance?page=&pageSize=` (đã đăng ký + đã check-in).

### 2.7. Notifications (mở rộng, không có trong mock nhưng có trong UI mobile: badge)

| # | Endpoint | Ghi chú |
|---|---|---|
| N1 | `GET /api/notifications?unreadOnly=true` `[auth]` | Badge số thông báo chưa đọc (top bar). |

### 2.8. Event Detail / Registration (thay `mockActivityDetail.ts`)

| # | Endpoint | Ghi chú |
|---|---|---|
| E1 | `GET /api/v2/activities/{id}` `[auth]` | Feed item (đã có `action`, `isRegistered`) — đủ cho màn detail + button Register/Cancel. |
| E2 | `POST /api/activities/{id}/participants` `[auth]` | Register (tự động, không cần challenge). Lỗi: `REGISTRATION_CLOSED` (409), `ACTIVITY_FULL` (409), `SELF_REGISTRATION_ONLY` (403). |
| E3 | `POST /api/activities/{id}/registration/cancel` `[auth]` | Hủy đăng ký (chỉ khi chưa check-in). |
| E4 | `GET /api/activities/{id}/my-attendance` `[auth]` | Trạng thái check-in của user cho event. |
| E5 (best-effort) | `GET /api/activities/{id}/resources` `[auth]` | Gallery (document/media) — lỗi 403 → hiển thị "không truy cập được", không crash. |

### 2.9. Summary: danh sách **các thứ KHÔNG có trong API, phải mock/dừng lại**

| Thứ | Quyết định |
|---|---|
| GPS → tên địa điểm (`fetchPlaceInfo`) | Giữ mock (không có geocoding API; nếu cần, thêm `POST /api/geocode` — cần BE) |
| Banner colors, logo art, iconBg, dateBoxBg, `venue.kind` | Mapping trong service (dùng default palette, không sửa component) |
| "Featured clubs" trên my-clubs tab | Dùng R3 (`/recommendations/clubs?limit=4`) hoặc C1 filter by campus — không có endpoint "featured" riêng |
| Hero social proof avatars | Không có endpoint; dùng logoUrl của 3 CLB đầu trong C1 |

---

## 3. Kiến trúc thay thế (mô-đun cần viết)

Cấu trúc file mới trong `src/services/` (cùng kiểu ClubHub UI nhưng TS + Expo):

```
src/services/
├── apiClient.ts          # wrapper fetch: base URL, Bearer header, 401 refresh, error parse
├── session.ts            # SecureStore storage, session shape, refresh rotation, logout
├── auth.ts               # loginWithGoogle (native OAuth), loginWithEmail, logout, restore
├── discovery.ts          # R1, R2, R3 → map thành RecommendationResponse hiện có
├── activities.ts         # E1, E2, E3, E4, E5, S1–S4 → map ActivityFeed/ActivityDetail/CheckInResult
├── clubs.ts              # C1–C4 → map ClubFeed/ClubDetail
├── myClubs.ts            # M1–M5 → map MyClubsFeed
├── profile.ts            # P1–P4 → map ProfileFeed
├── schedule.ts           # T1–T3 + my-attendance → map ScheduleFeed
├── notifications.ts      # N1
└── (bỏ) mock*.ts         # xóa toàn bộ sau khi mọi màn hình đã dùng service mới
```

### 3.1. `apiClient.ts` (hàm trung tâm)

```ts
const BASE = process.env.EXPO_PUBLIC_API_URL;      // https://clubreporthub.duckdns.org
const DEV_TOKEN = process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN;

// shape lỗi chuẩn (từ conventions)
export class ApiError extends Error {
  code: string | undefined;
  status: number;
  errors: Record<string, string[]> | undefined;
  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/** Đợt này: token lấy từ env. Phase 7 sẽ thay bằng session store + refresh. */
export function getAccessToken(): string | null {
  return DEV_TOKEN ?? null;
}

export async function apiFetch<T>(path: string, opts: {
  method?: string;
  body?: unknown;
  auth?: boolean;       // default true
  timeoutMs?: number;   // default 20000
} = {}): Promise<T> {
  const token = opts.auth === false ? null : getAccessToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: opts.method ?? 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new ApiError(body?.message ?? `HTTP ${res.status}`, res.status, body?.code, body?.errors);
    }
    if (res.status === 204) return null as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Map code → thông điệp tiếng Việt (bảng §5) */
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return ERROR_MESSAGES[err.code ?? ''] ?? err.message;
  if (err instanceof Error && err.name === 'AbortError') return 'Yêu cầu quá thời gian. Vui lòng thử lại.';
  return 'Không kết nối được máy chủ. Vui lòng thử lại.';
}
```

> **Lưu ý 401 trong đợt này**: không có refresh → 401 = token hết hạn hoặc sai. `getApiErrorMessage` trả "Phiên đăng nhập không hợp lệ. Vui lòng lấy token mới (dev)." và `useApiState` hiển thị nút "Tải lại". Phase 7 thay bằng refresh + `session-lost`.

### 3.2. `session.ts` — **dev-token mode** (chờ implement auth thật)

Vì đăng nhập bị postpone (quyết định #1), đợt này chỉ cần client API hoạt động:

- `.env` thêm: `EXPO_PUBLIC_DEV_ACCESS_TOKEN` — 1 access token thật (lấy từ 1 sinh viên trong hệ thống, hoặc dev-login endpoint `/api/auth/dev-login` nếu BE enable; hoặc tạo bằng JWT tool của BE với signing key dev).
- `apiClient.ts` dùng token này làm mặc định:

```ts
export async function getAccessToken(): Promise<string | null> {
  // Phase này: không có login thật → dùng token dev (dev build)
  if (process.env.EXPO_PUBLIC_IS_DEV !== 'true') return null;
  return process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN ?? null;
}
```

- **Không viết** `session.ts`, `auth.ts`, refresh/rotation, SecureStore trong đợt này — để khi implement login thật sẽ viết đúng shape token+refresh như web (hàm `tryRefresh` single-flight).
- **AuthProvider tạm**: bỏ `Stack.Protected guard={isAuthenticated}` (hoặc đổi guard thành `true`), bỏ màn login khỏi navigation; app vào thẳng `/explore`. `mockAuth.ts` có thể xóa, `AuthProvider` thu nhỏ thành provider chỉ phục vụ `expireSession` (no-op) để không phải sửa mọi nơi dùng `useAuth()`.
- Login thật (A1–A5, Google OAuth, SecureStore, refresh rotation) = **Phase 7 (rút khỏi đợt này, kế hoạch vẫn giữ ở §11)**.

### 3.3. Refactor component (quyết định #3)

Được phép sửa component + type để khớp dữ liệu thật:

- `src/types/*.ts`: loại bỏ trường UI-only (`bannerColor`, `dateBoxBg`, `iconBg`, `logoCode`, `venue.kind`, `footer.kind`…). Type mới theo shape API trong `src/types/api.ts`.
- Component giữ lại: card/layout logic + empty states. Thay: màu hardcode → theme token (`src/constants/theme.ts`), initials fallback khi thiếu `logoUrl`, `scheduleLabel ?? ''`, v.v.
- Mỗi service vẫn có mapping function (`toUiEvent(item)`), nhưng trả type UI *mới* (không bắt buộc khớp type mock cũ).

### 3.5. Mapping layer (ví dụ: discovery.ts)

Mục tiêu: **không sửa component/UI, chỉ viết service**. Mỗi service mới map response API → type hiện có trong `src/types/`:

```ts
// discovery.ts — map R2 (6 recommended) + R1 (page 1) vào RecommendationResponse
export async function fetchRecommendation(q: RecommendationQuery): Promise<RecommendationResponse> {
  const [recos, feed] = await Promise.all([
    apiFetch<RecoActivity[]>('/api/v2/recommendations/activities?limit=6&scope=PERIOD', { retryOn401: true }).catch(() => []),
    apiFetch<ActivityFeedResponse>(`/api/v2/activities/feed?${queryToUrl(q)}`),
  ]);
  return {
    campus: feed.campus ?? 'FPTU',
    hero: buildHero(recos),          // fallback palette (xem §4)
    events: { filters: [...], items: mapEvents(recos) },
    clubs: { items: mapClubsFromFeed(feed), pagination: buildPagination(feed) },
    ...
  };
}
```

Mỗi service có 1 file duy nhất; **bỏ qua trường UI-only** (banner color, dateBoxBg…) bằng cách trả về giá trị **thiếu** (`undefined`) — TypeScript sẽ bắt buộc component xử lý null, nhưng vì component đã có fallback (xem mock hiện tại), đây là thay đổi tối thiểu.

---

## 4. Bảng mapping: mock → API (chi tiết từng trường)

> Vì được phép refactor component (§3.3), các bảng dưới là **hướng ánh xạ dữ liệu**, không phải ràng buộc giữ nguyên shape cũ. Cột "UI mới" cho biết field nào giữ, field nào bỏ.

### 4.1. Auth — deferred (§11)

| Mock hiện tại | Đợt này | Phase 7 |
|---|---|---|
| `ALLOWED_DOMAINS` | Xóa (server enforce) | — |
| `CAMPUSES` (hardcoded) | Giữ | Giữ (hoặc endpoint campus-options) |
| `mockSignInWithGoogle()` | Không dùng — `AuthProvider` tự set authenticated bằng dev token | `auth.loginWithGoogle()` / `loginWithEmail()` |
| `Session.expiresAt` | Không dùng | ISO `expiresAtUtc` (30 phút) + `refreshToken` |

### 4.2. Discovery / Explore (`mockRecommendation.ts` → `discovery.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/v2/recommendations/activities` → items | `RecoEvent[]` | map `id, clubName, title, location, status(UPCOMING/LIVE), startTime/endTime` |
| `GET /api/v2/activities/feed` → items | `ActivityEvent[]` | map `coverImageUrl` → ảnh banner; `location` → venue; `action` (REGISTER/CHECK_IN/VIEW) → hiển thị badge |
| `clubId → clubName` | `club` | feed đã trả `clubName` |
| `status` | `upcoming / ongoing / ended` | map trực tiếp |
| `startTime` | `day`, `month`, `time` | parse theo `Asia/Ho_Chi_Minh` |
| — (không có) | `bannerColor`, `dateBoxBg`, `dateBoxColor` | **BỎ** → dùng theme token trong component |
| — (không có) | `footer` | **BỎ** |
| `GET /api/v2/recommendations/clubs?limit=N` hoặc `GET /api/clubs?active=true` | `RecoClub[]` | `logoUrl` → ảnh; `isRecruiting` → badge; `scheduleLabel` → lịch; `category` → label qua C2 cache |
| `totalItems/totalPages` (feed) | `pagination` | `pageSize` = số item/trang mong muốn |
| `hero`, `quickActions`, `moreCta` | Static trong service | Không có API tương ứng — giữ copy hiện tại (không fabricate data) |

### 4.3. Activities / Event Detail (`mockActivities.ts` + `mockActivityDetail.ts` → `activities.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/v2/activities/feed` items | `ActivityEvent` | như §4.2 |
| `GET /api/v2/activities/{id}` | `ActivityDetail` | `title, description, location, startTime, endTime, clubName, coverImageUrl, action, isRegistered, canCancelRegistration, nextSessionId, sessionId/version` |
| `POST /api/activities/{id}/participants` | `{ success, message }` | 409 `REGISTRATION_CLOSED`/`ACTIVITY_FULL` → `success:false` + message |
| `POST /api/activities/{id}/registration/cancel` | `{ success, message }` | chỉ khi `canCancelRegistration` |
| `GET /api/activities/{id}/resources` | `documents[] / media[]` | best-effort; 403 → `[]` + note "không truy cập được" |
| `GET /api/activities/{id}/my-attendance` | `attendance` | `status`, `verifiedAt` |
| — (không có) | `recruitment`, `assignments` | **BỎ 2 tab** (recruitment/assignments) khỏi `DetailTabs` |
| — (không có) | `contactNote` | BỎ |
| `startTime`/`endTime` | `timeSummary`, `startAt`, `endAt` | format `dd/MM/yyyy` + `HH:mm` |

### 4.4. Clubs (`mockClubs.ts` + `mockClubDetail.ts` → `clubs.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/clubs?active=true&category=&recruiting=&campus=` | `Club[]` | `category` = code; label qua C2 cache |
| `GET /api/clubs/categories` | `filters[]` | động thay vì hardcode `academic/tech/community` |
| `GET /api/clubs/{id}` | `ClubDetail` | `description, logoUrl, coverImageUrl, scheduleLabel, isRecruiting, memberCount, contactEmail/Phone, publicLeaders[], locationLabel, expectedLocation, majorEvents` |
| `POST /api/clubs/{id}/join` | `{ success, message }` | body: `{ fullName, email, phoneNumber, reason }` — lấy `fullName/email` từ `GET /api/users/me` (A5, cache), `phoneNumber` + `reason` từ **form nhập trong app** (thêm modal "Đơn xin gia nhập" thay vì gửi tự động — BE yêu cầu `fullName, email, phoneNumber, reason`) |
| `memberCount` | `ClubSummary` | hiển thị "N thành viên" |
| `publicLeaders[]` | `leaders[]` | `displayName, roleLabel` |
| — (không có) | `bannerColor`, `iconKind`, `iconBg`, `quote`, `groups[]`, `tags[]` | **BỎ**; `isRecruiting` → tag "Đang tuyển" render trực tiếp trong component |

### 4.5. My Clubs (`mockMyClubs.ts` → `myClubs.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/clubs/me/access` | `clubs[]` | `clubId, clubName, role, isApprovedMember, joinedAt` |
| `GET /api/clubs/{id}` (per club) | `logoUrl, coverImageUrl, slogan` | `Promise.all` |
| `GET /api/activities?clubId={id}` | `nextActivity` | activity sắp tới đầu tiên |
| `GET /api/clubs/me/membership-applications` | `applications[]` | `status` PENDING→tab pending, APPROVED→approved, REJECTED→history; `canWithdraw` → hiện nút Rút đơn |
| `POST /api/clubs/me/membership-applications/{id}/withdraw` | rút đơn | Idempotency-Key khuyến nghị |
| `GET /api/v2/recommendations/clubs` hoặc `/api/clubs?active=true` | `featured[]` | |
| — | optimistic patch trong `my-clubs.tsx` | **BỎ** → refetch `M3` sau khi join thành công |

### 4.6. Profile (`mockProfile.ts` → `profile.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/users/me/profile` | `user` | `fullName, email, campusCode, academicFields`; `initials` tính từ fullName |
| `GET /api/users/me/experience-summary?semester=` | `stats[]` | XP thô vs XP được công nhận tách rõ (theo product rule) |
| `GET /api/v1/declarations/me/radar?semester=` | `Competency.axes[]` | 6 trục 0–100: Academic, Research, Global, CultureSports, Community, Entrepreneurship; kèm ERI/D/J/M + danh hiệu |
| `GET /api/users/me/contributions?page=` | `evidences[]` | `title, issuer, date` |
| (tùy) `GET /api/clubs/me/access` | `clubs[]` trong profile | |
| `menu[]` | Static | |
| `skills[]` | Không có nguồn thật | **BỎ** khỏi profile (thay bằng "kỹ năng" từ contributions tags nếu có, hoặc ẩn card) |

### 4.7. Schedule (`mockSchedule.ts` → `schedule.ts`)

| Dữ liệu API | UI mới | Ghi chú |
|---|---|---|
| `GET /api/v2/activities/feed?status=UPCOMING` | `upcoming[]` | chia tuần/tuần sau bằng `startTime` (client-side) |
| `GET /api/academic-calendar/{year}/{term}` + `GET /api/users/me/study-schedule/{y}/{t}/{b}` | lịch học (nếu hiển thị) | API có sẵn |
| `GET /api/activities/{id}/my-attendance` | `attended[]` | activity đã check-in (VERIFIED) |
| `GET /api/v2/activities/feed` cho CLB của tôi (M5) | nguồn activity đã tham gia | |
| `action` (REGISTER/CHECK_IN/VIEW) | `action` (qr/ticket) | chỉ hiện QR khi `action === 'CHECK_IN'` |
| `campus` | `campusCode` từ profile | |

### 4.8. Scan / Check-in — deferred (chờ BE)

| Mock hiện tại | API thay thế | Ghi chú |
|---|---|---|
| `submitCheckIn(code, coords)` | `POST /api/activities/{id}/check-in` body `{ sessionId, challenge, location: { latitude, longitude, accuracy } }` | **Blocker**: `code` (QR) = challenge; cần `activityId` + `sessionId`. QR do **manager** phát (challenge 30s, `GET /api/activities/{id}/sessions/{sid}/attendance-challenge` là endpoint của manager). Cần BE xác nhận payload QR. |
| `fetchPlaceInfo(coords)` | **Không thay** (giữ mock) | Không có geocoding API; nếu BE thêm `POST /api/geocode` thì đổi 1 service |

---

## 5. Error handling chuẩn (từ conventions API)

Mọi endpoint trả lỗi shape:

```json
{ "message": "The resource changed.", "code": "VERSION_CONFLICT", "traceId": "opaque", "errors": {} }
```

Client mobile (in `apiClient.ts`):

| HTTP | Hành vi |
|---|---|
| 400 (BAD_REQUEST, field errors) | `ApiError` → toast lỗi + highlight field (nếu có) |
| 401 (UNAUTHORIZED) | Retry 1 lần sau refresh; refresh fail → `session-lost` event → /login |
| 403 (FORBIDDEN) | Toast "Không có quyền" + không retry |
| 404 | Toast "Không tìm thấy" |
| 409 (REGISTRATION_CLOSED, CLUB_CLOSED, LOCATION_OUTSIDE_POLICY, ATTENDANCE_CLOSED…) | Toast thông báo cụ thể theo code (bảng dưới) |
| 429 (RATE_LIMITED) | Toast "Vui lòng thử lại sau" (dùng `Retry-After` header nếu có) |
| 503 (SERVICE_UNAVAILABLE, DISCOVERY_AUTHORITY_UNAVAILABLE, ATTENDANCE_UNCONFIGURED) | Toast "Hệ thống tạm thời không khả dụng" |

**Bảng code → thông điệp (Việt, dùng cho toast):**

| Code | Thông điệp hiển thị |
|---|---|
| `REGISTRATION_CLOSED` | "Đăng ký đã đóng" |
| `ACTIVITY_FULL` | "Hoạt động đã đầy đủ chỗ" |
| `REGISTRATION_REQUIRED` | "Bạn cần đăng ký trước khi check-in" |
| `ATTENDANCE_CLOSED` | "Phiên điểm danh đã đóng" |
| `INVALID_ATTENDANCE_CHALLENGE` | "Mã QR không hợp lệ hoặc hết hạn. Vui lòng quét lại." |
| `LOCATION_OUTSIDE_POLICY` | "Bạn không nằm trong phạm vi điểm danh. Vui lòng thử ở gần địa điểm." |
| `CLUB_CLOSED` | "CLB hiện không đang tuyển thành viên" |
| `SCORE_POLICY_UNAPPROVED` | "Đề xuất chưa được kích hoạt. Đang hiển thị danh sách hoạt động." |
| `SEMESTER_REQUIRED` | "Vui lòng chọn học kỳ trước" |
| `ATTENDANCE_UNCONFIGURED` | "Hệ thống điểm danh chưa được cấu hình" |
| `RESOURCE_ACCESS_DENIED` | "Không có quyền xem tài nguyên này" |
| `MEMBERSHIP_SERVICE_UNAVAILABLE` | "Không thể xác minh thành viên. Vui lòng thử lại" |

---

## 6. Kế hoạch thực thi (đợt hiện tại: Phase 1, 3, 4, 6 — bỏ qua Phase 2, 5, 7)

> Theo quyết định: **không làm auth** (Phase 2 → Phase 7, deferred) và **không làm scan/check-in** (Phase 5 → deferred, chờ BE).
> Đợt này bàn giao: **app đọc dữ liệu thật từ API** cho 8 màn hình: explore, allClubs, activity, event detail, club detail, my-clubs, profile, schedule.

### Phase 1 — Nền tảng client API (1–2 ngày)

**Viết mới:**

- [ ] `src/services/apiClient.ts` — fetch wrapper: base URL từ `EXPO_PUBLIC_API_URL`, header `Authorization: Bearer <dev token>`, parse JSON, `ApiError` (status + code + errors), helper `getApiErrorMessage(err)` map code → thông điệp Việt (§5), timeout 20s qua `AbortController`
- [ ] `src/types/api.ts` — TypeScript interfaces mirror DTO API (§2): `AuthResponse`, `UserSummary`, `ClubDirectoryResponse`, `ClubPublicDetailResponse`, `ClubMembershipResponse`, `StudentActivityItem`, `StudentActivityPage`, `RecoActivity`, `SessionCheckInRequest`, `ActivityAttendance`, `SelfProfileResponse`, `RadarResponse`, `ContributionItem`, `StudyScheduleResponse`, …
- [ ] `src/hooks/useApiState.ts` — hook `useApiState<T>(fn, deps)` → `{ data, loading, error, reload }`, xử lý race/unmount, retry
- [ ] `src/components/common/ErrorState.tsx` — UI lỗi chung (icon, message, nút "Thử lại") dùng cho mọi màn hình
- [ ] `src/components/common/EmptyState.tsx` — UI rỗng chung (thay các empty state inline)

**Sửa:**

- [ ] `src/app/_layout.tsx` — bỏ guard auth tạm (mọi route mở), hoặc giữ `AuthProvider` nhưng `signIn` no-op auto-login bằng dev token
- [ ] `src/providers/AuthProvider.tsx` — rút gọn: `status` luôn `'authenticated'` khi có dev token; giữ `expireSession()` để không phá call-site
- [ ] `.env` — thêm `EXPO_PUBLIC_DEV_ACCESS_TOKEN` (+ `EXPO_PUBLIC_API_URL` đã có)

**Test:** app mở thẳng explore, gọi được 1 endpoint thật (vd `GET /api/clubs?active=true`), lỗi 401 hiện message rõ ràng.

### Phase 3 — Discovery + Clubs + Event Detail (3–4 ngày)

**Service mới** (thay mock tương ứng):

- [ ] `src/services/discovery.ts` — R1 (`/api/v2/activities/feed`), R2 (`/api/v2/recommendations/activities`), R3 (`/api/v2/activities/{id}`) → `fetchRecommendation()`, `fetchActivities()`, `fetchActivityDetail()` với **type mới** (đã bỏ trường trình bày)
- [ ] `src/services/clubs.ts` — C1 (`/api/clubs`), C2 (`/api/clubs/categories`), C3 (`/api/clubs/{id}`), C4 (`POST /api/clubs/{id}/join`) → `fetchClubs()`, `fetchClubDetail()`, `applyToClub()`
- [ ] `src/services/activities.ts` — E2/E3/E4 (register, cancel, my-attendance) + S3/S4 check-in (để sẵn, gọi sau)

**Refactor component + màn hình** (được phép sửa):

- [ ] `src/types/activity.ts`, `activityDetail.ts`, `club.ts`, `clubDetail.ts`, `recommendation.ts` — bỏ `bannerColor`, `dateBoxBg`, `dateBoxColor`, `iconBg`, `iconKind`, `logoBg`, `logoText`, `venue.kind`, `footer.kind`; dùng theme token
- [ ] `src/components/discover/*` (`HeroCard`, `RecoEventCard`, `RecoClubCard`, `Pagination`, `MoreCommunityCard`) — dùng `logoUrl`/`coverImageUrl` từ API, fallback initials
- [ ] `src/components/explore/ClubCard.tsx`, `src/components/activity/EventCard.tsx` — bỏ màu hardcode, dùng `theme`
- [ ] `src/components/event-detail/*` — `DetailHero`, `DetailSummary`, `OverviewTab`, `ResourceTabs`, `BottomActionBar`; bỏ tab "recruitment"/"assignments" (không có API) → hiển thị tab "Tài liệu" (E5 resources) + "Thông tin"
- [ ] `src/app/(tabs)/explore.tsx` — dùng `fetchRecommendation` (kèm fallback khi R2 lỗi → dùng R1)
- [ ] `src/app/(tabs)/allClubs.tsx` — dùng `fetchClubs` (filter `category` theo C2, `recruitingOnly` → `?recruiting=true`)
- [ ] `src/app/(tabs)/activity.tsx` — dùng `fetchActivities` (filter `status=UPCOMING|LIVE`)
- [ ] `src/app/event/[id].tsx` — dùng `fetchActivityDetail` + `registerForActivity` (E2), bỏ `handleApplyRole` (TODO cũ)
- [ ] `src/app/club/[id].tsx` — dùng `fetchClubDetail` + `applyToClub` (C4), bỏ `ClubActionBar` chat button chưa dùng

**Test:** explore hiển thị hoạt động thật; mở event → chi tiết; bấm "Đăng ký" → gọi API thật; mở club → nộp đơn join.

### Phase 4 — My Clubs + Profile + Schedule (3–4 ngày)

- [ ] `src/services/myClubs.ts` — M1 (`/api/clubs/me/access`), M2 (`/api/clubs/me/memberships`), M3 (`/api/clubs/me/membership-applications`), M4 (withdraw), M5 (`/api/activities?clubId=`) → `fetchMyClubs()`
- [ ] `src/services/profile.ts` — P1 (`/api/users/me/profile`), P2 (`/api/v1/declarations/me/radar`), P3 (`/api/users/me/contributions`), P4 (`/api/users/me/experience-summary`) → `fetchProfile()`
- [ ] `src/services/schedule.ts` — T1 (`/api/academic-calendar/{year}/{term}`), T2 (`/api/users/me/study-schedule/...`), T3 (`/api/activities`) + E4 → `fetchSchedule()`
- [ ] `src/services/notifications.ts` — N1 (`/api/notifications?unreadOnly=true`) → badge (optional, cuối phase)
- [ ] Refactor: `src/components/profile/*` (`RadarChart` nhận 6 trục thật, `StatGrid` từ experience-summary, `EvidenceTab` từ contributions), `src/components/my-clubs/*` (`MyClubCard`, `ApplicationsCard` — thêm nút "Rút đơn", `FeaturedClubs`), `src/components/schedule/*` (`ScheduleItem` — `ticket`/`qr` action: chỉ hiện QR khi `action === 'CHECK_IN'`)
- [ ] Sửa màn hình: `my-clubs.tsx`, `profile.tsx`, `schedule.tsx`
- [ ] Xóa optimistic patch trong `my-clubs.tsx` (đơn mới → refetch `M3` sau khi join thành công)

**Test:** My Clubs hiện CLB + đơn thật; Profile có radar thật (hoặc empty state "Chưa có dữ liệu"); Lịch phân tác sắp tới / đã tham gia.

### Phase 6 — Dọn dẹp + hoàn thiện (1–2 ngày)

- [ ] Xóa `src/services/mock*.ts` (10 file) + `mockAuth.ts` + `authStorage.ts` (nếu đã không dùng)
- [ ] Gộp/xóa `src/types/*.ts` cũ → `src/types/api.ts` + `src/types/ui.ts`
- [ ] Audit: `grep -r "mock" src/` → 0 kết quả trong code runtime
- [ ] `npx expo lint` + `npx tsc --noEmit` pass
- [ ] Error boundary toàn cục trong `src/app/_layout.tsx`
- [ ] `README.md` — ghi `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_DEV_ACCESS_TOKEN`, hướng dẫn lấy token dev
- [ ] Commit + tag `phase-mock-removal`

---

## 7. Rủi ro & Quyết định cần xác nhận

| # | Rủi ro | Ảnh hưởng | Giải pháp / trạng thái |
|---|---|---|---|
| 1 | **Format QR chưa rõ** — sinh viên không biết `activityId`/`sessionId` nếu QR chỉ encode challenge string | Chặn Phase 5 (scan/check-in) | **Đã xác nhận: chờ BE.** Phase 5 deferred. Nếu BE xác nhận QR chỉ có challenge → cần endpoint mới `POST /api/attendance-challenges/decode { challenge }` → `{ activityId, sessionId }` |
| 2 | **Chưa có auth thật** (quyết định #1) | Mọi endpoint `[auth]` cần Bearer | Dùng `EXPO_PUBLIC_DEV_ACCESS_TOKEN`. TTL 30 phút → cần script lấy token mới (`scripts/get-dev-token.mjs`, dùng `POST /api/auth/dev-login` nếu BE enable, hoặc Google account). Phase 7 (§11) làm auth thật |
| 3 | Google client ID chưa có cho Android/iOS | Chặn login Google | Deferred cùng Phase 2 → §11 |
| 4 | CORS — web build của mobile bị chặn | Chỉ ảnh hưởng `expo start --web` | Native app không bị CORS. Web build dùng dev proxy |
| 5 | `registeredCount` không có trong R1 | Card event thiếu số người đăng ký | Bỏ footer count (được refactor component) hoặc dùng `sessionCount` từ sessions |
| 6 | Category code → label cần C2 cache | Filter CLB hiển thị mã thay vì tên | Fetch C2 in-memory cache 1 lần, fallback = category code |
| 7 | Radar (P2) trả null khi chưa có benchmark | Profile không có biểu đồ | `RadarChart` nhận `null` → "Chưa có dữ liệu" |
| 8 | BE chưa có endpoint `POST /api/geocode` | `fetchPlaceInfo` giữ mock | Chấp nhận tạm; nếu BE thêm sau thì đổi 1 service |
| 9 | Activity feed chỉ trả activity của campus người dùng | Explore có thể ít dữ liệu khi token dev thuộc campus khác | Dùng token của sinh viên campus Hà Nội khi test explore |
| 10 | Refactor component → diff lớn, dễ regression | Review tốn thời gian | Bổ sung `useApiState` + ErrorState/EmptyState chung để mọi màn hình xử lý lỗi giống nhau; test từng màn sau khi sửa |

---

## 8. File cần tạo/sửa (tóm tắt — đợt hiện tại)

### Tạo mới (9 file):

```
src/services/apiClient.ts       # fetch wrapper + ApiError + code→message
src/services/discovery.ts       # thay mockRecommendation.ts + mockActivities.ts
src/services/clubs.ts           # thay mockClubs.ts + mockClubDetail.ts
src/services/activities.ts      # thay mockActivityDetail.ts (+ check-in để sẵn)
src/services/myClubs.ts         # thay mockMyClubs.ts
src/services/profile.ts         # thay mockProfile.ts
src/services/schedule.ts        # thay mockSchedule.ts
src/services/notifications.ts   # N1 — badge thông báo
src/types/api.ts                # DTO API + type UI mới (thay src/types/*.ts)
```

### Tạo mới (tiện ích, 3 file):

```
src/hooks/useApiState.ts        # { data, loading, error, reload }
src/components/common/ErrorState.tsx
src/components/common/EmptyState.tsx
```

### Sửa (màn hình, 9 file):

```
src/app/_layout.tsx             # bỏ guard auth tạm, error boundary
src/providers/AuthProvider.tsx  # rút gọn (dev token, expireSession no-op)
src/app/(tabs)/explore.tsx      # → discovery.ts
src/app/(tabs)/allClubs.tsx    # → clubs.ts
src/app/(tabs)/activity.tsx    # → discovery.ts
src/app/(tabs)/my-clubs.tsx    # → myClubs.ts (+ rút đơn, bỏ optimistic patch)
src/app/(tabs)/profile.tsx     # → profile.ts
src/app/(tabs)/schedule.tsx    # → schedule.ts
src/app/event/[id].tsx         # → activities.ts
src/app/club/[id].tsx          # → clubs.ts
```

### Refactor component (được phép sửa theo quyết định #3):

```
src/types/{activity,activityDetail,club,clubDetail,myClubs,profile,recommendation,schedule}.ts
src/components/discover/{HeroCard,RecoEventCard,RecoClubCard,Pagination}.tsx
src/components/explore/ClubCard.tsx
src/components/activity/EventCard.tsx
src/components/event-detail/{DetailHero,DetailSummary,OverviewTab,ResourceTabs,BottomActionBar}.tsx
src/components/profile/{RadarChart,StatGrid,EvidenceTab,SkillsCard,ClubsCard}.tsx
src/components/my-clubs/{MyClubCard,ApplicationsCard,FeaturedClubs}.tsx
src/components/schedule/ScheduleItem.tsx
```

### Xóa (10 file):

```
src/services/mockActivities.ts
src/services/mockActivityDetail.ts
src/services/mockClubs.ts
src/services/mockClubDetail.ts
src/services/mockMyClubs.ts
src/services/mockProfile.ts
src/services/mockRecommendation.ts
src/services/mockSchedule.ts
src/services/mockScan.ts
src/services/mockAuth.ts        # sau khi AuthProvider rút gọn
```

> `mockScan.ts` **giữ lại** đến khi Phase 5 (scan) làm — màn `scan.tsx` vẫn dùng nó. `authStorage.ts` giữ lại nếu `AuthProvider` vẫn dùng SecureStore.

---

## 9. Trật tự công việc (đợt hiện tại)

```
Phase 1 (nền tảng client API + types)
   ├─→ Phase 3 (discovery + clubs + event detail)  ─┐
   └─→ Phase 4 (my clubs + profile + schedule)     ─┴─→ Phase 6 (dọn dẹp, audit)
```

**Deferred (không làm trong đợt này):**
- Phase 2 → §11 (auth thật)
- Phase 5 → §7 rủi ro #1 (scan/check-in, chờ BE)

**Tăng độ an toàn**: sau Phase 1 chạy `npx expo lint` + `npx tsc --noEmit`. Sau mỗi Phase, test các luồng: explore → event detail → register → club detail → join → my clubs → profile → schedule.

---

## 10. Kiểm tra trước khi viết code (checklist)

Trước khi bắt đầu Phase 1:

- [ ] `EXPO_PUBLIC_API_URL` đang trỏ đúng gateway (`https://clubreporthub.duckdns.org`) — xác nhận qua `GET /health`
- [ ] **Có access token dev hợp lệ** để test — lấy từ: `POST /api/auth/dev-login` (nếu BE enable `LOCAL_DEV_LOGIN_KEY`) hoặc account Google của 1 sinh viên, hoặc BE cấp token test
- [ ] Token dev còn hạn trong suốt quá trình dev (30 phút) → cần **cơ chế refresh hoặc token dài hạn**; nếu không, dùng script lấy token mới (`scripts/get-dev-token.mjs`) và nạp vào `.env`
- [ ] `registeredCount` có kế hoạch thêm vào R1 không? (đồng ý fallback nếu chưa)
- [ ] Có cần endpoint `POST /api/geocode` cho GPS→địa điểm? (giữ mock nếu chưa có)
- [ ] `/api/clubs/me/membership-applications/{id}/withdraw` (M4) đã implement (manifest: IMPLEMENTED) ✔

**Câu hỏi cho BE (không chặn đợt này, chặn Phase 5/7):**
- [ ] QR check-in encode gì? (`activityId`/`sessionId`/`challenge`?)
- [ ] Có endpoint refresh token nào dùng được không cần cookie? (`POST /api/auth/refresh` — xác nhận response có `refreshToken` mới)
- [ ] Google client ID cho Android/iOS đã cấu hình chưa?

---

## 11. Phase deferred — đăng nhập thật (làm sau, không thuộc đợt này)

Khi nào bắt đầu: sau khi có Google client ID **hoặc** xác nhận dùng email-login.

- [ ] `src/services/session.ts` — SecureStore CRUD + shape `{ accessToken, refreshToken, refreshTokenExpiresAt, user, expiresAt }`
- [ ] `src/services/auth.ts` — `loginWithGoogle()` (expo-auth-session native → `POST /api/auth/google`), `loginWithEmail()` (`POST /api/auth/email-login`), `logout()` (`POST /api/auth/logout`)
- [ ] `apiClient.ts` — bổ sung refresh single-flight: 401 → `POST /api/auth/refresh` → retry 1 lần → fail → clear session + emit `session-lost`
- [ ] `AuthProvider.tsx` — restore từ SecureStore, `signIn`/`signOut` thật, `onSessionLost` → `expireSession()`
- [ ] `src/app/login.tsx` — màn đăng nhập thật (Google + email), `src/app/_layout.tsx` — bật lại `Stack.Protected`
- [ ] Cấu hình Google Cloud: Android SHA-1, iOS bundle ID `com.fptuxperience.mobile`, redirect `fptuxperiencemobile://`
- [ ] Xóa `mockAuth.ts`, `authStorage.ts`, `EXPO_PUBLIC_DEV_ACCESS_TOKEN` khỏi `.env`
