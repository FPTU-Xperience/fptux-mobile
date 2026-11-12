// app/club/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import LeadersCard from '@/components/club-detail/LeadersCard';
import MeetCard from '@/components/club-detail/MeetCard';
import UpcomingEventsCard from '@/components/club-detail/UpcomingEventsCard';
import { applyToClub, fetchClubDetail } from '@/services/mockClubDetail';
import type { ApplyState, ClubDetail } from '@/types/clubDetail';

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchClubDetail(String(id)).then((data) => {
      if (cancelled) return;
      setClub(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/allClubs');
  };

  const handleShare = () => {
    if (!club) return;
    Share.share({ message: `${club.name} – ${club.slogan}` });
  };

  const handleApply = async () => {
    if (!club || applying || applied) return;
    setApplying(true);
    const result = await applyToClub(club.id);
    setApplying(false);
    if (result.success) setApplied(true);
    Alert.alert(result.success ? 'Đã gửi hồ sơ' : 'Gửi hồ sơ thất bại', result.message);
  };

  const applyState: ApplyState = {
    applied,
    loading: applying,
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

      {loading ? (
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F5FA' },
  content: { paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 14, color: '#6B7280' },
});