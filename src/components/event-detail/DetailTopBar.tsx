// components/event-detail/DetailTopBar.tsx
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  bookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
};

export default function DetailTopBar({ bookmarked, onBack, onToggleBookmark, onShare }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.row}>
        <Pressable style={styles.back} onPress={onBack} hitSlop={8}>
          <ArrowLeft size={18} color="#374151" />
          <Text style={styles.backText}>Quay lại hoạt động</Text>
        </Pressable>

        <View style={styles.actions}>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  actions: { flexDirection: 'row', gap: 10 },
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