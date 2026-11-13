// app/club/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AboutCard from '@/components/club-detail/AboutCard';
import ClubActionBar from '@/components/club-detail/ClubActionBar';
import ClubHero from '@/components/club-detail/ClubHero';
import ClubSummary from '@/components/club-detail/ClubSummary';
import ClubTopBar from '@/components/club-detail/ClubTopBar';
import HighlightsCard from '@/components/club-detail/HighlightsCard';
import JoinForm from '@/components/club-detail/JoinForm';
import LeadersCard from '@/components/club-detail/LeadersCard';
import MeetCard from '@/components/club-detail/MeetCard';
import UpcomingEventsCard from '@/components/club-detail/UpcomingEventsCard';
import ErrorState from '@/components/common/ErrorState';
import { useApiState } from '@/hooks/useApiState';
import { useAuth } from '@/providers/AuthProvider';
import { fetchClubDetail } from '@/services/clubs';
import type { ApplyState } from '@/types/clubDetail';

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const clubId = String(id ?? '');
  const { user } = useAuth();

  const [bookmarked, setBookmarked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const { data: club, loading, error, hasError, retry } = useApiState(
    () => fetchClubDetail(clubId),
    [clubId],
  );

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/allClubs');
  };

  const handleShare = () => {
    if (!club) return;
    Share.share({ message: `${club.name} – ${club.slogan}` });
  };

  /** Mở form gia nhập (quyết định scope #1) thay vì nộp 1 chạm. */
  const handleApply = () => {
    if (!club || applied) return;
    setJoinOpen(true);
  };

  const applyState: ApplyState = {
    applied,
    loading: false,
    disabled: club ? !club.recruiting : false,
  };

  return (
    <View style={styles.root}>
      <ClubTopBar
        campusLabel={club?.campusLabel ?? ''}
        bookmarked={bookmarked}
        onBack={goBack}
        onToggleBookmark={() => setBookmarked((v) => !v)}
        onShare={handleShare}
      />

      {hasError && error ? (
        <View style={styles.center}>
          <ErrorState message={error} onRetry={retry} loading={loading} />
        </View>
      ) : loading && !club ? (
        <ActivityIndicator color="#F97316" style={styles.center} />
      ) : !club ? (
        <View style={styles.center}>
          <Text style={styles.notFound}>Không tìm thấy câu lạc bộ</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <ClubHero
              eyebrow={club.eyebrow}
              name={club.name}
              tagline={club.tagline}
              color={club.bannerColor}
            />
            <ClubSummary club={club} />
            <AboutCard heading={club.aboutHeading} text={club.aboutText} hashtags={club.hashtags} />
            <HighlightsCard items={club.highlights} />
            <MeetCard info={club.meet} />
            <UpcomingEventsCard
              events={club.upcomingEvents}
              onPressEvent={(e) =>
                router.push({ pathname: '/event/[id]', params: { id: e.id } })
              }
              onPressAll={() => router.push('/activity')}
            />
            <LeadersCard
              leaders={club.leaders}
              onContact={() => Linking.openURL(`mailto:${club.meet.email}`)}
            />
          </ScrollView>

          <ClubActionBar apply={applyState} onApply={handleApply} />
        </>
      )}

      <JoinForm
        visible={joinOpen}
        clubId={clubId}
        clubName={club?.name ?? ''}
        user={user}
        onClose={() => setJoinOpen(false)}
        onSuccess={() => {
          setApplied(true);
          Alert.alert('Đã gửi hồ sơ', 'Hồ sơ của bạn đã được gửi tới ban chủ nhiệm CLB.');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F5FA' },
  content: { paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 14, color: '#6B7280' },
});