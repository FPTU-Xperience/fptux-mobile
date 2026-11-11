// app/(tabs)/schedule.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ScreenHeader from '@/components/common/ScreenHeader';
import ScreenLayout from '@/components/common/ScreenLayout';
import SectionHeader from '@/components/common/SectionHeader';
import EmptySchedule from '@/components/schedule/EmptySchedule';
import ScheduleItem from '@/components/schedule/ScheduleItem';
import ScheduleTabs from '@/components/schedule/ScheduleTabs';
import { fetchSchedule } from '@/services/mockSchedule';
import type { ScheduleFeed, ScheduleTabKey } from '@/types/schedule';

export default function ScheduleScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState<ScheduleFeed | null>(null);
  const [tab, setTab] = useState<ScheduleTabKey>('upcoming');

  useEffect(() => {
    let cancelled = false;
    fetchSchedule().then((data) => {
      if (!cancelled) setFeed(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goToActivities = () => router.push('/activity');

  const upcomingCount = feed ? feed.upcomingThisWeek.length + feed.upcomingNextWeek.length : 0;
  const attendedCount = feed?.attended.length ?? 0;

  return (
    <ScreenLayout title="Lịch Trình">
      <ScreenHeader
        campus={feed?.campus}
        eyebrow="KHÔNG GIAN CỦA BẠN"
        title="Lịch trình của tôi"
        subtitle="Theo dõi các hoạt động, buổi sinh hoạt và workshop bạn đã đăng ký tham gia."
      />

      <ScheduleTabs
        tabs={[
          { key: 'upcoming', label: 'Sắp tới', count: upcomingCount },
          { key: 'attended', label: 'Đã tham gia', count: attendedCount },
        ]}
        selected={tab}
        onSelect={setTab}
      />

      {!feed ? (
        <ActivityIndicator color="#F97316" style={styles.loader} />
      ) : tab === 'upcoming' ? (
        <>
          {feed.upcomingThisWeek.length === 0 ? (
            <EmptySchedule onPressExplore={goToActivities} />
          ) : (
            <>
              <SectionHeader
                title="HOẠT ĐỘNG TUẦN NÀY"
                right={`${feed.upcomingThisWeek.length} sự kiện`}
              />
              <View style={styles.list}>
                {feed.upcomingThisWeek.map((e) => (
                  <ScheduleItem key={e.id} event={e} />
                ))}
              </View>
            </>
          )}

          {feed.upcomingNextWeek.length > 0 && (
            <>
              <SectionHeader
                title="HOẠT ĐỘNG SẮP DIỄN RA TUẦN TỚI"
                right={`${feed.upcomingNextWeek.length} sự kiện`}
              />
              <View style={styles.list}>
                {feed.upcomingNextWeek.map((e) => (
                  <ScheduleItem key={e.id} event={e} />
                ))}
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <SectionHeader title="HOẠT ĐỘNG ĐÃ THAM GIA" right={`${feed.attended.length} sự kiện`} />
          <View style={styles.list}>
            {feed.attended.map((e) => (
              <ScheduleItem key={e.id} event={e} />
            ))}
            {feed.attended.length === 0 && (
              <Text style={styles.empty}>Bạn chưa tham gia hoạt động nào</Text>
            )}
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 16, gap: 12 },
  loader: { marginTop: 40 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 24 },
});