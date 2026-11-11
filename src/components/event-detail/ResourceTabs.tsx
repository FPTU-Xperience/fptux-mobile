// components/event-detail/ResourceTabs.tsx
import { FileText, ImageIcon, Play } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import type { DocumentItem, MediaItem } from '@/types/activityDetail';

import EmptyBlock from './EmptyBlock';

export function DocumentsTab({ items }: { items: DocumentItem[] }) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <EmptyBlock
          icon={FileText}
          title="Chưa có tài liệu"
          description="Tài liệu hoạt động sẽ hiển thị tại đây"
        />
      </View>
    );
  }

  return (
    <Card>
      <View style={styles.list}>
        {items.map((d) => (
          <View key={d.id} style={styles.row}>
            <View style={styles.iconBox}>
              <FileText size={18} color="#F97316" />
            </View>
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>
                {d.name}
              </Text>
              <Text style={styles.meta}>{d.meta}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function MediaTab({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <EmptyBlock
          icon={ImageIcon}
          title="Chưa có media"
          description="Ảnh, video chia sẻ sẽ xuất hiện ở đây"
        />
      </View>
    );
  }

  return (
    <Card>
      <View style={styles.grid}>
        {items.map((m) => (
          <View key={m.id} style={styles.tile}>
            {m.kind === 'video' ? (
              <Play size={22} color="#6B7280" />
            ) : (
              <ImageIcon size={22} color="#6B7280" />
            )}
            <Text style={styles.tileText} numberOfLines={1}>
              {m.title}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: { marginHorizontal: 16, marginTop: 16 },
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: '#111827' },
  meta: { fontSize: 11.5, color: '#6B7280', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: '31%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileText: { fontSize: 10.5, color: '#6B7280' },
});