// components/common/ErrorState.tsx
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  /** Thông điệp lỗi đã chuẩn hóa tiếng Việt (từ getApiErrorMessage). */
  message: string;
  /** Nhãn nút thử lại. */
  retryLabel?: string;
  onRetry?: () => void;
  /** Đang tải lại → hiện spinner thay icon. */
  loading?: boolean;
  /** Ẩn nút thử lại (vd khi không có hành động nào khả dụng). */
  hideRetry?: boolean;
};

export default function ErrorState({
  message,
  retryLabel = 'Thử lại',
  onRetry,
  loading = false,
  hideRetry = false,
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        {loading ? (
          <ActivityIndicator color="#F97316" />
        ) : (
          <AlertCircle color="#EF4444" size={26} />
        )}
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Không tải được dữ liệu</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {!hideRetry && onRetry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          disabled={loading}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonDisabled]}>
          <RefreshCw color="#fff" size={16} />
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: '800' },
  message: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  button: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: '#F97316',
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 13.5, fontWeight: '700' },
});
