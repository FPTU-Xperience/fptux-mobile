// app/(tabs)/schedule.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ErrorState from '@/components/common/ErrorState';
import ScreenHeader from '@/components/common/ScreenHeader';
import ScreenLayout from '@/components/common/ScreenLayout';
import SectionHeader from '@/components/common/SectionHeader';
import EmptySchedule from '@/components/schedule/EmptySchedule';
import ScheduleItem from '@/components/schedule/ScheduleItem';
import ScheduleTabs from '@/components/schedule/ScheduleTabs';
import { useApiState } from '@/hooks/useApiState';
import { fetchSchedule } from '@/services/schedule';
import type { ScheduleTabKey } from '@/types/schedule';

export default function ScheduleScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<ScheduleTabKey>('upcoming');

  const { data: feed, loading, error, hasError, retry } = useApiState(
    () => fetchSchedule(),
    [],
  );

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

      {hasError && error ? (
        <ErrorState message={error} onRetry={retry} loading={loading} />
      ) : !feed ? (
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