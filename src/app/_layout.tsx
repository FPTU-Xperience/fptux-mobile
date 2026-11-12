// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';

// Giữ splash screen cho tới khi biết người dùng đã đăng nhập hay chưa
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync();
  }, [status]);

  if (status === 'loading') return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Luôn tồn tại, đặt đầu tiên: khi guard đổi, navigator sẽ về "/" rồi index chuyển tiếp */}
      <Stack.Screen name="index" />

      {/* Chỉ truy cập được khi đã đăng nhập */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="club/[id]" />
      </Stack.Protected>

      {/* Chỉ hiện khi chưa đăng nhập hoặc phiên hết hạn */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}