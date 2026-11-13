// app/(tabs)/explore.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ErrorState from '@/components/common/ErrorState';
import FilterChips from '@/components/common/FilterChips';
import ScreenLayout from '@/components/common/ScreenLayout';
import SearchBar from '@/components/common/SearchBar';
import DiscoverSectionTitle from '@/components/discover/DiscoverSectionTitle';
import HeroCard from '@/components/discover/HeroCard';
import MoreCommunityCard from '@/components/discover/MoreCommunityCard';
import Pagination from '@/components/discover/Pagination';
import QuickActions from '@/components/discover/QuickActions';
import RecoClubCard from '@/components/discover/RecoClubCard';
import RecoEventCard from '@/components/discover/RecoEventCard';
import { useApiState } from '@/hooks/useApiState';
import { fetchRecommendation } from '@/services/recommendation';
import type {
  QuickActionRoute,
  RecoClubCategoryKey,
  RecoEventFilterKey,
} from '@/types/recommendation';

const TAB_ROUTES = {
  activity: '/activity',
  schedule: '/schedule',
  allClubs: '/allClubs',
} as const satisfies Record<QuickActionRoute, string>;

export default function ExploreScreen() {
  const router = useRouter();

  const [eventStatus, setEventStatus] = useState<RecoEventFilterKey>('all');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<RecoClubCategoryKey>('all');
  const [page, setPage] = useState(1);

  // Debounce từ khoá 250ms để không gọi API mỗi lần gõ.
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 250);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, loading, error, hasError, retry } = useApiState(
    () => fetchRecommendation({ eventStatus, keyword: debouncedKeyword, category, page }),
    [eventStatus, debouncedKeyword, category, page],
  );

  const changeKeyword = (text: string) => {
    setKeyword(text);
    setPage(1);
  };

  const changeCategory = (key: RecoClubCategoryKey) => {
    setCategory(key);
    setPage(1);
  };

  if (hasError && error) {
    return (
      <ScreenLayout title="Khám phá">
        <ErrorState message={error} onRetry={retry} loading={loading} />
      </ScreenLayout>
    );
  }

  if (!data) {
    return (
      <ScreenLayout title="Khám phá">
        <ActivityIndicator color="#F97316" style={styles.loader} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Khám phá">
      <View style={loading && styles.dim}>
        {/* Hero */}
        <HeroCard
          hero={data.hero}
          onPressPrimary={() => router.navigate('/allClubs')}
          onPressSecondary={() => router.navigate('/activity')}
        />

        <QuickActions
          actions={data.quickActions}
          onPress={(a) => router.navigate(TAB_ROUTES[a.route])}
        />

        {/* Hoạt động dành cho bạn */}
        <DiscoverSectionTitle
          title="Hoạt động dành cho bạn"
          subtitle="Khám phá hoạt động đang & sắp diễn ra"
          linkLabel="Tất cả"
          onPressLink={() => router.navigate('/activity')}
        />
        <FilterChips
          filters={data.events.filters}
          selected={eventStatus}
          onSelect={setEventStatus}
        />
        <View style={styles.list}>
          {data.events.items.map((e) => (
            <RecoEventCard
              key={e.id}
              event={e}
              onPress={(ev) => router.push({ pathname: '/event/[id]', params: { id: ev.id } })}
            />
          ))}
          {data.events.items.length === 0 && (
            <Text style={styles.empty}>Chưa có hoạt động phù hợp</Text>
          )}
        </View>

        {/* Câu lạc bộ dành cho bạn */}
        <DiscoverSectionTitle
          title="Câu lạc bộ dành cho bạn"
          subtitle="Khám phá những cộng đồng được tuyển chọn để bắt đầu hành trình."
          meta={`${data.clubs.pagination.total} CLB gợi ý`}
        />
        <SearchBar
          value={keyword}
          onChangeText={changeKeyword}
          placeholder="Tìm câu lạc bộ theo tên, lĩnh vực..."
        />
        <FilterChips
          filters={data.clubs.filters}
          selected={category}
          onSelect={changeCategory}
        />
        <View style={[styles.list, styles.clubList]}>
          {data.clubs.items.map((c) => (
            <RecoClubCard
              key={c.id}
              club={c}
              onPress={(club) =>
                router.push({ pathname: '/club/[id]', params: { id: club.id } })
              }
            />
          ))}
          {data.clubs.items.length === 0 && (
            <Text style={styles.empty}>Không tìm thấy câu lạc bộ phù hợp</Text>
          )}
        </View>

        <Pagination
          page={data.clubs.pagination.page}
          pageCount={data.clubs.pagination.pageCount}
          onChange={setPage}
        />

        <MoreCommunityCard data={data.moreCta} onPress={() => router.navigate('/allClubs')} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 60 },
  dim: { opacity: 0.6 },
  list: { paddingHorizontal: 16, gap: 16, marginTop: 14 },
  clubList: { gap: 18 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 },
});