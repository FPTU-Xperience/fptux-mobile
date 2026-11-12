// app/index.tsx
import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

/**
 * Cửa vào duy nhất của app (đường dẫn "/").
 * Đăng nhập xong hoặc đăng xuất xong, navigator sẽ về "/" nên cần route này
 * để chuyển tiếp tới đúng màn hình.
 */
export default function Index() {
  const { status } = useAuth();

  return <Redirect href={status === 'authenticated' ? '/explore' : '/login'} />;
}