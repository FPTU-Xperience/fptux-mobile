// components/event-detail/RecruitmentTab.tsx
import { TriangleAlert } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { Recruitment, RecruitmentRole } from '@/types/activityDetail';

type Props = {
  data: Recruitment;
  onApply: (role: RecruitmentRole) => void;
};

export default function RecruitmentTab({ data, onApply }: Props) {
  return (
    <Card>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Tuyển dụng nhân sự</Text>
        <View style={[styles.badge, !data.open && styles.badgeClosed]}>
          <Text style={[styles.badgeText, !data.open && styles.badgeTextClosed]}>
            {data.open ? 'Đang tuyển' : 'Đã đóng'}
          </Text>
        </View>
      </View>

      <Text style={styles.desc}>{data.description}</Text>

      <View style={styles.warning}>
        <TriangleAlert size={16} color="#C2410C" />
        <Text style={styles.warningText}>{data.notice}</Text>
      </View>

      <Text style={styles.visibility}>
        <Text style={styles.visibilityLabel}>Công khai: </Text>
        {data.visibility}
      </Text>

      <View style={styles.list}>
        {data.roles.map((role) => {
          const full = role.approved >= role.capacity;
          return (
            <View key={role.id} style={styles.role}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleMeta}>
                {role.kind} · {role.approved}/{role.capacity} vị trí đã duyệt
              </Text>
              <Text style={styles.roleNote}>{role.note}</Text>
              <Pressable
                style={[styles.apply, (!data.open || full) && styles.applyOff]}
                disabled={!data.open || full}
                onPress={() => onApply(role)}>
                <Text style={styles.applyText}>{full ? 'Đã đủ vị trí' : 'Đăng ký vị trí'}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#DCFCE7' },
  badgeClosed: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#15803D' },
  badgeTextClosed: { color: '#6B7280' },
  desc: { fontSize: 13, lineHeight: 19, color: '#6B7280', marginTop: 8 },

  warning: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFEDE0',
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 17, color: '#9A3412' },

  visibility: { fontSize: 12.5, color: '#6B7280', marginTop: 14 },
  visibilityLabel: { fontWeight: '800', color: '#374151' },

  list: { gap: 12, marginTop: 14 },
  role: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF0F5',
    backgroundColor: '#fff',
  },
  roleTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  roleMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  roleNote: { fontSize: 11.5, color: '#B45309', marginTop: 4, lineHeight: 16 },
  apply: {
    marginTop: 12,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyOff: { backgroundColor: '#FDBA74' },
  applyText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});