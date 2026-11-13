// components/event-detail/AssignmentTab.tsx
import { QrCode } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';
import type { ActivityDetail } from '@/types/activityDetail';

type Props = {
  detail: ActivityDetail;
  onReloadSession: () => void;
};

export default function AssignmentTab({ detail, onReloadSession }: Props) {
  return (
    <>
      {/* Phân công */}
      <Card>
        <Text style={styles.heading}>Phân công hoạt động</Text>
        <Text style={styles.sub}>Theo dõi host, staff và phân việc gắn với từng action.</Text>
        <Text style={styles.note}>{detail.assignmentsNote}</Text>

        <View style={styles.list}>
          {detail.assignments.map((a) => (
            <View key={a.id} style={styles.person}>
              <View style={[styles.avatar, { backgroundColor: a.avatarBg }]}>
                <Text style={[styles.avatarText, { color: a.avatarColor }]}>{a.initials}</Text>
              </View>
              <View style={styles.personBody}>
                <Text style={styles.personName}>{a.name}</Text>
                <Text style={styles.personDuty}>
                  <Text style={[styles.role, a.roleLabel === 'Host' && styles.roleHost]}>
                    {a.roleLabel}
                  </Text>
                  {' · '}
                  {a.duty}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Điểm danh */}
      <Card>
        <CardTitle icon={QrCode} title="Điểm danh của tôi" />
        <Text style={styles.sub}>Lịch sử điểm danh của bạn trong hoạt động này.</Text>

        <View style={styles.attendBox}>
          <Text style={styles.attendCount}>{detail.attendance.count} lần điểm danh của bạn</Text>
          <Text style={styles.attendText}>{detail.attendance.emptyText}</Text>

          <View style={styles.sessionBox}>
            <Text style={styles.sessionTitle}>Phiên tham gia của tôi</Text>
            <Text style={styles.sessionHint}>{detail.attendance.sessionHint}</Text>
            <Pressable style={styles.reload} onPress={onReloadSession}>
              <Text style={styles.reloadText}>Tải lại phiên</Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: '800', color: '#111827' },
  sub: { fontSize: 13, lineHeight: 19, color: '#6B7280', marginTop: 6 },
  note: { fontSize: 12, fontStyle: 'italic', color: '#9CA3AF', marginTop: 8, lineHeight: 17 },

  list: { gap: 10, marginTop: 16 },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF0F5',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '800' },
  personBody: { flex: 1 },
  personName: { fontSize: 14, fontWeight: '800', color: '#111827' },
  personDuty: { fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 17 },
  role: { fontWeight: '800', color: '#4B5563' },
  roleHost: { color: '#C2410C' },

  attendBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF0F5',
    backgroundColor: '#FAFAFC',
  },
  attendCount: { fontSize: 12, fontWeight: '800', color: '#111827' },
  attendText: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  sessionBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  sessionTitle: { fontSize: 12.5, fontWeight: '800', color: '#111827' },
  sessionHint: { fontSize: 11.5, lineHeight: 16, color: '#C2410C', marginTop: 4 },
  reload: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  reloadText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  twoUp: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 16 },
  half: { flex: 1, paddingVertical: 22 },
});