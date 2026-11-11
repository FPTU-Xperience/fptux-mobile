// app/(tabs)/activity.tsx
import { useRouter } from 'expo-router';
import { Ticket } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import EventCard from '@/components/activity/EventCard';
import FilterChips from '@/components/common/FilterChips';
import ScreenHeader from '@/components/common/ScreenHeader';
import ScreenLayout from '@/components/common/ScreenLayout';
import SearchBar from '@/components/common/SearchBar';
import { fetchActivities } from '@/services/mockActivities';
import type { ActivityFeed, ActivityEvent, FilterKey } from '@/types/activity';

export default function ActivityScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState<ActivityFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      const data = await fetchActivities({ keyword, filter });
      if (!cancelled) {
        setFeed(data);
        setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword, filter]);

  const openDetail = (event: ActivityEvent) => {
    router.push({ pathname: '/event/[id]', params: { id: event.id } });
  };

  return (
    <ScreenLayout title="Hoạt động">
      <ScreenHeader
        campus={feed?.campus}
        title="Tất cả hoạt động sắp tới"
        subtitle="Đừng bỏ lỡ các sự kiện nổi bật tại Hola Campus"
        right={
          <View style={styles.ticket}>
            <Ticket size={16} color="#F97316" />
          </View>
        }
      />
      <SearchBar value={keyword} onChangeText={setKeyword} placeholder="Tìm hoạt động..." />
      {feed && <FilterChips filters={feed.filters} selected={filter} onSelect={setFilter} />}

      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <View style={styles.dot} />
          <Text style={styles.summaryText}>
            {feed ? `${feed.events.length} hoạt động để khám phá` : ' '}
          </Text>
        </View>
        <Text style={styles.semester}>{feed?.semester}</Text>
      </View>

      {loading && !feed ? (
        <ActivityIndicator color="#F97316" style={styles.loader} />
      ) : (
        <View style={[styles.list, loading && styles.dim]}>
          {feed?.events.map((event) => (
            <EventCard key={event.id} event={event} onPressDetail={openDetail} />
          ))}
          {feed && feed.events.length === 0 && (
            <Text style={styles.empty}>Không tìm thấy hoạt động phù hợp</Text>
          )}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  ticket: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  summaryText: { fontSize: 12, color: '#6B7280' },
  semester: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.5 },
  list: { paddingHorizontal: 16, gap: 18 },
  dim: { opacity: 0.5 },
  loader: { marginTop: 40 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});