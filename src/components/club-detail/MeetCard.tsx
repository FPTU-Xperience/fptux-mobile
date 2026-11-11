// components/club-detail/MeetCard.tsx
import { Clock, Mail, MapPin, Phone, Users, type LucideIcon } from 'lucide-react-native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { ClubMeetInfo } from '@/types/clubDetail';

type RowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  muted?: boolean;
  link?: boolean;
  onPress?: () => void;
};

function Row({ icon: Icon, label, value, muted, link, onPress }: RowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.iconCircle}>
        <Icon size={16} color="#F97316" />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, muted && styles.muted, link && styles.link]}>{value}</Text>
      </View>
    </Pressable>
  );
}

type Props = { info: ClubMeetInfo };

export default function MeetCard({ info }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Hẹn gặp bạn tại CLB</Text>
      <View style={styles.list}>
        <Row icon={Clock} label="Lịch sinh hoạt" value={info.schedule} />
        <Row
          icon={MapPin}
          label="Địa điểm"
          value={info.location ?? 'Đang cập nhật'}
          muted={!info.location}
        />
        <Row icon={Users} label="Quy mô" value={info.size} />
        <Row
          icon={Mail}
          label="Email"
          value={info.email}
          link
          onPress={() => Linking.openURL(`mailto:${info.email}`)}
        />
        <Row
          icon={Phone}
          label="Điện thoại hotline"
          value={info.hotline}
          onPress={() => Linking.openURL(`tel:${info.hotline}`)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  list: { gap: 16, marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  label: { fontSize: 11.5, color: '#9CA3AF' },
  value: { fontSize: 14, fontWeight: '800', color: '#111827', marginTop: 2 },
  muted: { fontStyle: 'italic', fontWeight: '500', color: '#9CA3AF' },
  link: { color: '#C2410C' },
});