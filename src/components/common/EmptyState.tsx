// components/common/EmptyState.tsx
import { Inbox } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle?: string;
  /** Nhãn nút (vd "Khám phá hoạt động"). */
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, subtitle, actionLabel, onAction }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Inbox color="#F97316" size={26} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Text style={styles.action} onPress={onAction}>
          {actionLabel}
        </Text>
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
    gap: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 15, fontWeight: '800' },
  subtitle: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  action: { marginTop: 10, color: '#F97316', fontSize: 13.5, fontWeight: '700' },
});
