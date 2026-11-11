// components/event-detail/EmptyBlock.tsx
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  style?: StyleProp<ViewStyle>;
};

export default function EmptyBlock({ icon: Icon, title, description, style }: Props) {
  return (
    <View style={[styles.box, style]}>
      <View style={styles.iconCircle}>
        <Icon size={20} color="#6B7280" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 13, fontWeight: '800', color: '#111827', marginTop: 10, textAlign: 'center' },
  desc: { fontSize: 11, lineHeight: 16, color: '#6B7280', marginTop: 4, textAlign: 'center' },
});