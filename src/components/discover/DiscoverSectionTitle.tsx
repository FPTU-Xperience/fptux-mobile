// components/discover/DiscoverSectionTitle.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  /** Chữ nhỏ bên phải (vd: "18 CLB gợi ý") */
  meta?: string;
  /** Link bên phải, vd: "Tất cả" */
  linkLabel?: string;
  onPressLink?: () => void;
};

export default function DiscoverSectionTitle({
  title,
  subtitle,
  meta,
  linkLabel,
  onPressLink,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {linkLabel ? (
          <Pressable onPress={onPressLink} hitSlop={8}>
            <Text style={styles.link}>{linkLabel}</Text>
          </Pressable>
        ) : meta ? (
          <Text style={styles.meta}>{meta}</Text>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginTop: 26 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: '#111827' },
  link: { fontSize: 12.5, fontWeight: '700', color: '#F97316' },
  meta: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  subtitle: { fontSize: 12.5, lineHeight: 18, color: '#6B7280', marginTop: 4 },
});