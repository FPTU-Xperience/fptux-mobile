// components/event-detail/OverviewTab.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { ActivityDetail } from '@/types/activityDetail';

type Props = {
  detail: ActivityDetail;
  onPressClub?: () => void;
};

function TimeBox({ label, time, date }: { label: string; time: string; date: string }) {
  return (
    <View style={styles.timeBox}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

export default function OverviewTab({ detail, onPressClub }: Props) {
  return (
    <>
      <Card>
        <Text style={styles.eyebrow}>VỀ HOẠT ĐỘNG</Text>
        <Text style={styles.heading}>Thông tin chi tiết</Text>
        <Text style={styles.body}>{detail.about}</Text>
      </Card>

      <Card>
        <Text style={styles.heading}>Lịch & địa điểm</Text>

        <View style={styles.timeRow}>
          <TimeBox label="Bắt đầu" time={detail.startAt.time} date={detail.startAt.date} />
          <TimeBox label="Kết thúc" time={detail.endAt.time} date={detail.endAt.date} />
        </View>

        <Text style={styles.fieldLabel}>Địa điểm</Text>
        <Text style={styles.fieldValue}>{detail.location}</Text>

        <Text style={styles.fieldLabel}>Đơn vị tổ chức</Text>
        <Text style={styles.fieldValue}>{detail.organizer}</Text>

        <Text style={styles.contactHeading}>Đầu mối liên hệ</Text>
        <Text style={styles.body}>{detail.contactNote}</Text>

        <Pressable style={styles.outlineButton} onPress={onPressClub}>
          <Text style={styles.outlineText}>Đến trang CLB</Text>
        </Pressable>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#F97316', letterSpacing: 0.8 },
  heading: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 4 },
  body: { fontSize: 13, lineHeight: 20, color: '#6B7280', marginTop: 10 },

  timeRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  timeBox: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F6F7FB',
    borderWidth: 1,
    borderColor: '#EEF0F5',
  },
  timeLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  time: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 6 },
  date: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  fieldLabel: { fontSize: 12, color: '#6B7280', marginTop: 16 },
  fieldValue: { fontSize: 14, fontWeight: '800', color: '#111827', marginTop: 3 },

  contactHeading: { fontSize: 13, fontWeight: '800', color: '#111827', marginTop: 18 },
  outlineButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  outlineText: { fontSize: 12, fontWeight: '700', color: '#374151' },
});