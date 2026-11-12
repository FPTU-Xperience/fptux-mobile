// app/(tabs)/my-clubs.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import ApplicationsCard from '@/components/my-clubs/ApplicationsCard';
import FeaturedClubs from '@/components/my-clubs/FeaturedClubs';
import MyClubCard from '@/components/my-clubs/MyClubCard';
import MyClubsHeader from '@/components/my-clubs/MyClubsHeader';
import MyClubsTopBar from '@/components/my-clubs/MyClubsTopBar';
import { applyToClub } from '@/services/mockClubDetail';
import { fetchMyClubs } from '@/services/mockMyClubs';
import type { Application, FeaturedClub, MyClubsFeed } from '@/types/myClubs';

const todayText = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export default function MyClubsScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState<MyClubsFeed | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyClubs().then((data) => {
      if (!cancelled) setFeed(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openClub = (id: string) => router.push({ pathname: '/club/[id]', params: { id } });

  const handleJoin = async (club: FeaturedClub) => {
    if (joiningId) return;
    setJoiningId(club.id);
    const result = await applyToClub(club.id);
    setJoiningId(null);

    if (result.success) {
      const application: Application = {
        id: `new-${Date.now()}`,
        clubId: club.id,
        clubName: club.name,
        appliedAt: todayText(),
        tab: 'pending',
        result: 'pending',
      };
      setFeed((prev) =>
        prev ? { ...prev, applications: [application, ...prev.applications] } : prev,
      );
    }
    Alert.alert(result.success ? 'Đã gửi đơn' : 'Gửi đơn thất bại', result.message);
  };

  const pendingIds = new Set(
    (feed?.applications ?? []).filter((a) => a.result === 'pending').map((a) => a.clubId),
  );

  return (
    <View style={styles.root}>
      <MyClubsTopBar onBack={() => router.navigate('/profile')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MyClubsHeader onExplore={() => router.navigate('/allClubs')} />

        {!feed ? (
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
              joiningId={joiningId}
              onPressClub={(c) => openClub(c.id)}
              onJoin={handleJoin}
              onPressAll={() => router.navigate('/allClubs')}
            />
          </>
        )}
      </ScrollView>
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