// hooks/useApiState.ts
//
// Hook đọc dữ liệu API cho mọi màn hình: { data, loading, error, retry }.
//
// Cách hoạt động:
// - Mỗi lần deps đổi (hoặc retry) sinh 1 "key" mới. Kết quả fetch được gắn key.
// - `loading` = key hiện tại chưa có kết quả → không cần setState trong effect.
// - Request cũ bị bỏ qua (cancelled) khi deps đổi hoặc unmount.
// - `error` đã chuẩn hóa tiếng Việt (getApiErrorMessage).
//
// Dùng trong màn hình:
//   const { data, loading, error, retry } = useApiState(
//     () => fetchClubs({ keyword, filter, recruitingOnly }),
//     [keyword, filter, recruitingOnly],
//   );

import { useCallback, useEffect, useRef, useState } from 'react';

import { getApiErrorMessage } from '@/services/apiClient';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Có lỗi không (để chọn ErrorState vs EmptyState). */
  hasError: boolean;
  /** Gọi lại fetch (với deps mới nhất). */
  retry: () => void;
}

interface FetchResult<T> {
  key: string;
  data: T | null;
  error: string | null;
}

/** Ổn định key từ deps (deps thường là primitive: keyword, filter, page...). */
function depsKey(deps: readonly unknown[]): string {
  try {
    return JSON.stringify(deps);
  } catch {
    return deps.map(String).join('|');
  }
}

export function useApiState<T>(fetcher: () => Promise<T>, deps: readonly unknown[] = []): ApiState<T> {
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<FetchResult<T> | null>(null);

  // Fetcher luôn giữ bản mới nhất để retry không bị stale.
  // Ref chỉ được ghi trong effect (không ghi trong render).
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // Key ổn định theo NỘI DUNG deps (depsKey) + nonce (retry).
  // Không dùng useMemo vì identity của mảng deps đổi mỗi render — memo hoá
  // trên identity đó vô nghĩa. depsKey là JSON.stringify nên rẻ.
  const key = `${depsKey(deps)}#${nonce}`;

  const retry = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetcherRef
      .current()
      .then((data) => {
        if (cancelled) return;
        setResult({ key, data, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({ key, data: null, error: getApiErrorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const isCurrent = result?.key === key;

  return {
    data: isCurrent ? result?.data ?? null : null,
    loading: !isCurrent,
    error: isCurrent ? result?.error ?? null : null,
    hasError: isCurrent && result?.error != null,
    retry,
  };
}
