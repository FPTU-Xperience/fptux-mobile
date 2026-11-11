// components/club-detail/ClubActionBar.tsx
import { ArrowRight, MessageCircle } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ApplyState } from '@/types/clubDetail';

type Props = {
  apply: ApplyState;
  onApply: () => void;
  onPressChat?: () => void;
};

export default function ClubActionBar({ apply, onApply, onPressChat }: Props) {
  const insets = useSafeAreaInsets();
  const inactive = apply.disabled || apply.applied;

  const label = apply.applied
    ? 'Đã nộp hồ sơ'
    : apply.disabled
      ? 'Chưa mở tuyển thành viên'
      : 'Nộp hồ sơ gia nhập';

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Pressable style={styles.chat} onPress={onPressChat}>
        <MessageCircle size={20} color="#4B5563" />
      </Pressable>

      <Pressable
        style={[styles.button, inactive && styles.buttonOff]}
        disabled={inactive || apply.loading}
        onPress={onApply}>
        {apply.loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>{label}</Text>
            {!inactive && <ArrowRight size={18} color="#fff" />}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F5',
  },
  chat: {
    width: 48,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: '#F97316',
  },
  buttonOff: { backgroundColor: '#FDBA74' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});