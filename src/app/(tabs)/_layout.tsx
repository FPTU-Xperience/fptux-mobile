import { Tabs } from 'expo-router';

import AppTabBar from '@/components/app-tab-bar';

export const unstable_settings = {
  initialRouteName: 'explore', // ← tên file trong app/(tabs)/, không có .tsx
};

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}