// components/my-clubs/FeaturedClubs.tsx
import { Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { FeaturedClub } from '@/types/myClubs';

type Props = {
  clubs: FeaturedClub[];
  /** id các CLB đã có đơn chờ duyệt */
  pendingIds: Set<string>;
  joiningId: string | null;
  onPressClub: (club: FeaturedClub) => void;
  onJoin: (club: FeaturedClub) => void;
  onPressAll: () => void;
};

export default function FeaturedClubs({
  clubs,
  pendingIds,
  joiningId,
  onPressClub,
  onJoin,
  onPressAll,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>CỘNG ĐỒNG NỔI BẬT FPTU</Text>
        <Pressable onPress={onPressAll} hitSlop={8}>
          <Text style={styles.all}>Xem tất cả</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {clubs.map((c) => {
          const pending = pendingIds.has(c.id);
          const joining = joiningId === c.id;
          return (
            <Pressable key={c.id} style={styles.card} onPress={() => onPressClub(c)}>
              <View style={[styles.tag, { backgroundColor: c.tagBg }]}>
                <Text style={[styles.tagText, { color: c.tagColor }]}>{c.tag}</Text>
              </View>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.desc} numberOfLines={3}>
                {c.description}
              </Text>

              <Pressable
                style={[styles.join, pending && styles.joinOff]}
                disabled={pending || joining}
                onPress={() => onJoin(c)}>
                {joining ? (
                  <ActivityIndicator size="small" color="#374151" />
                ) : (
                  <>
                    {!pending && <Plus size={14} color="#374151" />}
                    <Text style={styles.joinText}>{pending ? 'Đã gửi đơn' : 'Tham gia'}</Text>
                  </>
                )}
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: { fontSize: 12, fontWeight: '800', color: '#374151', letterSpacing: 0.8 },
  all: { fontSize: 12, fontWeight: '700', color: '#F97316' },
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  card: {
    width: 170,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.4 },
  name: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 10 },
  desc: { fontSize: 11.5, lineHeight: 16, color: '#6B7280', marginTop: 4, minHeight: 48 },
  join: {
    marginTop: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF0F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  joinOff: { backgroundColor: '#F3F4F6' },
  joinText: { fontSize: 12.5, fontWeight: '800', color: '#374151' },
});