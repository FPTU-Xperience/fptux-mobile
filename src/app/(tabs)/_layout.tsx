import { Tabs } from 'expo-router';

import AppTabBar from '@/components/app-tab-bar';

export const unstable_settings = {
  initialRouteName: 'explore',
};

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="allClubs" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="my-clubs" />
    </Tabs>
  );
}