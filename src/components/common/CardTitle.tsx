// components/common/CardTitle.tsx
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: LucideIcon;
  title: string;
  right?: ReactNode;
};

export default function CardTitle({ icon: Icon, title, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Icon size={16} color="#F97316" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE9D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '800', color: '#111827', flexShrink: 1 },
});