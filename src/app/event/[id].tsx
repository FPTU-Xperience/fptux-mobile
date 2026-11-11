// app/event/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import AssignmentTab from '@/components/event-detail/AssignmentTab';
import BottomActionBar from '@/components/event-detail/BottomActionBar';
import DetailHero from '@/components/event-detail/DetailHero';
import DetailSummary from '@/components/event-detail/DetailSummary';
import DetailTabs from '@/components/event-detail/DetailTabs';
import DetailTopBar from '@/components/event-detail/DetailTopBar';
import OverviewTab from '@/components/event-detail/OverviewTab';
import RecruitmentTab from '@/components/event-detail/RecruitmentTab';
import { DocumentsTab, MediaTab } from '@/components/event-detail/ResourceTabs';
import { fetchActivityDetail, registerForActivity } from '@/services/mockActivityDetail';
import type {
  ActivityDetail,
  DetailTabKey,
  RecruitmentRole,
  RegisterState,
} from '@/types/activityDetail';

const TABS: { key: DetailTabKey; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'documents', label: 'Tài liệu' },
  { key: 'media', label: 'Media' },
  { key: 'assignments', label: 'Phân công' },
  { key: 'recruitment', label: 'Tuyển dụng' },
];

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [detail, setDetail] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DetailTabKey>('overview');
  const [bookmarked, setBookmarked] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const data = await fetchActivityDetail(String(id));
    setDetail(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/activity');
  };

  const handleShare = () => {
    if (!detail) return;
    Share.share({ message: `${detail.title} – ${detail.timeSummary} tại ${detail.location}` });
  };

  const handleRegister = async () => {
    if (!detail || registering || registered) return;
    setRegistering(true);
    const result = await registerForActivity(detail.id);
    setRegistering(false);
    if (result.success) setRegistered(true);
    Alert.alert(result.success ? 'Đăng ký thành công' : 'Đăng ký thất bại', result.message);
  };

  const handleApplyRole = (role: RecruitmentRole) => {
    // TODO: gọi API đăng ký vị trí thật
    Alert.alert('Đăng ký vị trí', `Đã gửi đăng ký vị trí "${role.title}".`);
  };

  const registerState: RegisterState = {
    registered,
    loading: registering,
    disabled: detail?.status === 'ended',
  };

  return (
    <View style={styles.root}>
      <DetailTopBar
        bookmarked={bookmarked}
        onBack={goBack}
        onToggleBookmark={() => setBookmarked((v) => !v)}
        onShare={handleShare}
      />

      {loading ? (
        <ActivityIndicator color="#F97316" style={styles.center} />
      ) : !detail ? (
        <View style={styles.center}>
          <Text style={styles.notFound}>Không tìm thấy hoạt động</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <DetailHero title={detail.title} hubLabel={detail.hubLabel} color={detail.bannerColor} />
            <DetailSummary detail={detail} register={registerState} onRegister={handleRegister} />

            <DetailTabs tabs={TABS} selected={tab} onSelect={setTab} />

            {tab === 'overview' && <OverviewTab detail={detail} />}
            {tab === 'documents' && <DocumentsTab items={detail.documents} />}
            {tab === 'media' && <MediaTab items={detail.media} />}
            {tab === 'assignments' && <AssignmentTab detail={detail} onReloadSession={load} />}
            {tab === 'recruitment' && (
              <RecruitmentTab data={detail.recruitment} onApply={handleApplyRole} />
            )}
          </ScrollView>

          <BottomActionBar register={registerState} onRegister={handleRegister} />
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