// components/club-detail/ClubTopBar.tsx
import { ArrowLeft, Bookmark, Building2, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  campusLabel: string;
  bookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
};

export default function ClubTopBar({
  campusLabel,
  bookmarked,
  onBack,
  onToggleBookmark,
  onShare,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.row}>
        <Pressable style={styles.back} onPress={onBack} hitSlop={8}>
          <ArrowLeft size={18} color="#374151" />
          <Text style={styles.backText} numberOfLines={1}>
            Tất cả câu lạc bộ
          </Text>
        </Pressable>

        <View style={styles.actions}>
          <View style={styles.campus}>
            <Building2 size={13} color="#6B7280" />
            <Text style={styles.campusText}>{campusLabel}</Text>
          </View>
          <Pressable style={styles.round} onPress={onToggleBookmark} hitSlop={6}>
            <Bookmark
              size={17}
              color={bookmarked ? '#F97316' : '#374151'}
              fill={bookmarked ? '#F97316' : 'transparent'}
            />
          </Pressable>
          <Pressable style={styles.round} onPress={onShare} hitSlop={6}>
            <Share2 size={17} color="#374151" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#F4F5FA' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  backText: { fontSize: 13, fontWeight: '600', color: '#374151', flexShrink: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  campus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8EAF1',
  },
  campusText: { fontSize: 10.5, fontWeight: '700', color: '#4B5563' },
  round: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});