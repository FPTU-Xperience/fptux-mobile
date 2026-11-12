// components/my-clubs/ApplicationsCard.tsx
import { ArrowUpRight, FileText } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { Application, ApplicationResult, ApplicationTabKey } from '@/types/myClubs';

const RESULT: Record<ApplicationResult, { label: string; bg: string; color: string }> = {
  pending: { label: 'Chờ duyệt', bg: '#FFEDE0', color: '#C2410C' },
  approved: { label: 'Đã duyệt', bg: '#DCFCE7', color: '#15803D' },
  rejected: { label: 'Từ chối', bg: '#FEE2E2', color: '#B91C1C' },
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

type Props = {
  applications: Application[];
  onFindClubs: () => void;
};

export default function ApplicationsCard({ applications, onFindClubs }: Props) {
  const [tab, setTab] = useState<ApplicationTabKey>('pending');

  const pendingCount = applications.filter((a) => a.tab === 'pending').length;
  const items = applications.filter((a) => a.tab === tab);

  const tabs: { key: ApplicationTabKey; label: string }[] = [
    { key: 'pending', label: `Chờ duyệt (${pendingCount})` },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'history', label: 'Lịch sử' },
  ];

  return (
    <Card>
      <Text style={styles.title}>Đơn tham gia của tôi</Text>
      <Text style={styles.sub}>Đơn đang chờ duyệt và kết quả duyệt trong 7 ngày gần đây.</Text>

      <View style={styles.tabs}>
        {tabs.map((t) => {
          const active = t.key === tab;
          return (
            <Pressable
              key={t.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(t.key)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <FileText size={22} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyText}>
            {tab === 'pending'
              ? 'Bạn không có đơn chờ duyệt hoặc kết quả duyệt trong 7 ngày gần đây'
              : 'Chưa có đơn nào trong mục này'}
          </Text>
          <Pressable style={styles.link} onPress={onFindClubs}>
            <Text style={styles.linkText}>Tìm kiếm CLB để đăng ký</Text>
            <ArrowUpRight size={14} color="#F97316" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((a) => {
            const r = RESULT[a.result];
            return (
              <View key={a.id} style={styles.item}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(a.clubName)}</Text>
                </View>
                <View style={styles.itemBody}>
                  <Text style={styles.itemName}>{a.clubName}</Text>
                  <Text style={styles.itemDate}>Nộp ngày {a.appliedAt}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: r.bg }]}>
                  <Text style={[styles.badgeText, { color: r.color }]}>{r.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sub: { fontSize: 12.5, lineHeight: 18, color: '#6B7280', marginTop: 6 },

  tabs: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#C2410C' },

  empty: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  linkText: { fontSize: 12.5, fontWeight: '800', color: '#F97316' },

  list: { gap: 10, marginTop: 14 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F7F7FA',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '800', color: '#374151' },
  itemBody: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '800', color: '#111827' },
  itemDate: { fontSize: 11.5, color: '#6B7280', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10.5, fontWeight: '700' },
});