// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import { BookOpen, Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';
import CampusLabel from '@/components/common/CampusLabel';
import ScreenLayout from '@/components/common/ScreenLayout';
import SegmentedControl from '@/components/common/SegmentedControl';
import ClubsCard from '@/components/profile/ClubsCard';
import CompetencyCard from '@/components/profile/CompetencyCard';
import EvidenceTab from '@/components/profile/EvidenceTab';
import ManageMenu from '@/components/profile/ManageMenu';
import ProfileHero from '@/components/profile/ProfileHero';
import SkillsCard from '@/components/profile/SkillsCard';
import StatGrid from '@/components/profile/StatGrid';
import { fetchProfile } from '@/services/mockProfile';
import type { ProfileFeed, ProfileMenuItem, ProfileTabKey } from '@/types/profile';

export default function ProfileScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState<ProfileFeed | null>(null);
  const [tab, setTab] = useState<ProfileTabKey>('overview');

  useEffect(() => {
    let cancelled = false;
    fetchProfile().then((data) => {
      if (!cancelled) setFeed(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMenuPress = (item: ProfileMenuItem) => {
    // m1 = "Câu lạc bộ của tôi"
    if (item.id === 'm1') router.push('/my-clubs');
  };

  return (
    <ScreenLayout title="Profile">
      <View style={styles.campus}>
        <CampusLabel campus={feed?.campus} />
      </View>

      {!feed ? (
        <ActivityIndicator color="#F97316" style={styles.loader} />
      ) : (
        <>
          <ProfileHero user={feed.user} />

          <SegmentedControl
            options={[
              { key: 'overview', label: 'Tổng quan' },
              { key: 'evidence', label: 'Minh chứng' },
            ]}
            selected={tab}
            onSelect={setTab}
          />

          {tab === 'overview' ? (
            <>
              <Card>
                <CardTitle
                  icon={BookOpen}
                  title="Một chút về mình"
                  right={<Heart size={18} color="#6B7280" />}
                />
                <Text style={styles.bio}>{feed.user.bio}</Text>
              </Card>

              <StatGrid stats={feed.stats} />
              <CompetencyCard data={feed.competency} />
              <SkillsCard skills={feed.skills} />
              <ClubsCard clubs={feed.clubs} />
              <ManageMenu items={feed.menu} onPressItem={handleMenuPress} />
            </>
          ) : (
            <EvidenceTab evidences={feed.evidences} />
          )}
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  campus: { paddingHorizontal: 16, paddingTop: 4 },
  loader: { marginTop: 40 },
  bio: { fontSize: 13, lineHeight: 20, color: '#4B5563', marginTop: 12 },
});