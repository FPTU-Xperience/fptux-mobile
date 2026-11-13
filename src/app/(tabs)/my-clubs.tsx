// app/(tabs)/my-clubs.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import ApplicationsCard from '@/components/my-clubs/ApplicationsCard';
import FeaturedClubs from '@/components/my-clubs/FeaturedClubs';
import MyClubCard from '@/components/my-clubs/MyClubCard';
import MyClubsHeader from '@/components/my-clubs/MyClubsHeader';
import MyClubsTopBar from '@/components/my-clubs/MyClubsTopBar';
import JoinForm from '@/components/club-detail/JoinForm';
import ErrorState from '@/components/common/ErrorState';
import { useApiState } from '@/hooks/useApiState';
import { useAuth } from '@/providers/AuthProvider';
import { fetchMyClubs } from '@/services/myClubs';
import type { FeaturedClub } from '@/types/myClubs';

export default function MyClubsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [joinTarget, setJoinTarget] = useState<FeaturedClub | null>(null);

  const {
    data: feed,
    loading,
    error,
    hasError,
    retry,
  } = useApiState(() => fetchMyClubs(user?.campus ?? ''), []);

  const openClub = (id: string) => router.push({ pathname: '/club/[id]', params: { id } });

  /** Mở form gia nhập cho CLB đang tuyển (quyết định scope #1). */
  const handleJoin = (club: FeaturedClub) => {
    setJoinTarget(club);
  };

  const pendingIds = new Set(
    (feed?.applications ?? []).filter((a) => a.result === 'pending').map((a) => a.clubId),
  );

  return (
    <View style={styles.root}>
      <MyClubsTopBar onBack={() => router.navigate('/profile')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MyClubsHeader onExplore={() => router.navigate('/allClubs')} />

        {hasError && error ? (
          <ErrorState message={error} onRetry={retry} loading={loading} />
        ) : !feed ? (
          <ActivityIndicator color="#F97316" style={styles.loader} />
        ) : (
          <>
            {feed.clubs.map((club) => (
              <MyClubCard
                key={club.id}
                club={club}
                onEnter={(c) => openClub(c.id)}
                onPressActivity={(id) =>
                  router.push({ pathname: '/event/[id]', params: { id } })
                }
                onShare={(c) => Share.share({ message: `${c.name} – ${c.tagline}` })}
              />
            ))}
            {feed.clubs.length === 0 && (
              <Text style={styles.empty}>Bạn chưa tham gia câu lạc bộ nào</Text>
            )}

            <ApplicationsCard
              applications={feed.applications}
              onFindClubs={() => router.navigate('/allClubs')}
            />

            <FeaturedClubs
              clubs={feed.featured}
              pendingIds={pendingIds}
              joiningId={null}
              onPressClub={(c) => openClub(c.id)}
              onJoin={handleJoin}
              onPressAll={() => router.navigate('/allClubs')}
            />
          </>
        )}
      </ScrollView>

      <JoinForm
        visible={joinTarget !== null}
        clubId={joinTarget?.id ?? ''}
        clubName={joinTarget?.name ?? ''}
        user={user}
        onClose={() => setJoinTarget(null)}
        onSuccess={() => {
          // Nạp lại danh sách từ API (nguồn sự thật) — hồ sơ đang chờ sẽ
          // xuất hiện trong tab "Đang chờ" sau khi gửi.
          retry();
          Alert.alert('Đã gửi đơn', 'Hồ sơ của bạn đã được gửi tới ban chủ nhiệm CLB.');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  // chừa chỗ cho custom tab bar + nút nổi ở giữa
  content: { paddingBottom: 140 },
  loader: { marginTop: 40 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 32 },
});