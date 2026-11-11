// components/common/ScreenHeader.tsx
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CampusLabel from './CampusLabel';

type Props = {
  campus?: string;
  /** Dòng nhỏ màu cam phía trên tiêu đề, vd: "KHÔNG GIAN CỦA BẠN" */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Phần tử nhỏ bên phải tiêu đề (icon, badge...) */
  right?: ReactNode;
};

export default function ScreenHeader({ campus, eyebrow, title, subtitle, right }: Props) {
  return (
    <View style={styles.wrap}>
      <CampusLabel campus={campus} />

      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}

      <View style={[styles.titleRow, !eyebrow && styles.titleRowGap]}>
        <Text style={styles.title}>{title}</Text>
        {right}
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 4 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F97316',
    letterSpacing: 1,
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  titleRowGap: { marginTop: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', flex: 1 },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
});