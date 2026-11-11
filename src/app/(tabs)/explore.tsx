// app/(tabs)/explore.tsx
import { useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import ClubCard from '@/components/explore/ClubCard';
import FilterChips from '@/components/common/FilterChips';
import ScreenHeader from '@/components/common/ScreenHeader';
import ScreenLayout from '@/components/common/ScreenLayout';
import SearchBar from '@/components/common/SearchBar';
import { fetchClubs } from '@/services/mockClubs';
import type { Club, ClubFeed, ClubFilterKey } from '@/types/club';

export default function ExploreScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState<ClubFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<ClubFilterKey>('all');
  const [recruitingOnly, setRecruitingOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      const data = await fetchClubs({ keyword, filter, recruitingOnly });
      if (!cancelled) {
        setFeed(data);
        setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword, filter, recruitingOnly]);

  const openDetail = (club: Club) => {
    router.push({ pathname: '/club/[id]', params: { id: club.id } });
  };

  return (
    <ScreenLayout title="Khám phá">
      <ScreenHeader
        campus={feed?.campus}
        title="Tất cả câu lạc bộ"
        subtitle={`Khám phá ${feed?.total ?? 79} cộng đồng sinh viên sôi động tại FPTU`}
      />
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm kiếm câu lạc bộ theo tên, lĩnh vực..."
      />
      {feed && <FilterChips filters={feed.filters} selected={filter} onSelect={setFilter} />}

      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <View style={styles.dot} />
          <Text style={styles.summaryText}>
            {feed ? `${feed.clubs.length} câu lạc bộ phù hợp` : ' '}
          </Text>
        </View>
        <Pressable
          onPress={() => setRecruitingOnly((v) => !v)}
          style={[styles.toggle, recruitingOnly && styles.toggleActive]}>
          <UserPlus size={13} color={recruitingOnly ? '#C2410C' : '#6B7280'} />
          <Text style={[styles.toggleText, recruitingOnly && styles.toggleTextActive]}>
            Đang tuyển
          </Text>
        </Pressable>
      </View>

      {loading && !feed ? (
        <ActivityIndicator color="#F97316" style={styles.loader} />
      ) : (
        <View style={[styles.list, loading && styles.dim]}>
          {feed?.clubs.map((club) => (
            <ClubCard key={club.id} club={club} onPressDetail={openDetail} />
          ))}
          {feed && feed.clubs.length === 0 && (
            <Text style={styles.empty}>Không tìm thấy câu lạc bộ phù hợp</Text>
          )}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  summaryText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleActive: { backgroundColor: '#FFE9D6', borderColor: '#FDBA74' },
  toggleText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  toggleTextActive: { color: '#C2410C' },
  list: { paddingHorizontal: 16, gap: 18 },
  dim: { opacity: 0.5 },
  loader: { marginTop: 40 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});