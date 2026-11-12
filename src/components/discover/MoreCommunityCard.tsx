// components/discover/MoreCommunityCard.tsx
import { ArrowUpRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecoMoreCta } from '@/types/recommendation';

type Props = {
  data: RecoMoreCta;
  onPress: () => void;
};

export default function MoreCommunityCard({ data, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{data.eyebrow}</Text>
      <Text style={styles.text}>{data.text}</Text>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{data.button}</Text>
        <ArrowUpRight size={15} color="#111827" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFEFE3',
    borderWidth: 1,
    borderColor: '#FDD9BC',
  },
  eyebrow: { fontSize: 10.5, fontWeight: '800', color: '#C2410C', letterSpacing: 0.8 },
  text: { fontSize: 17, fontWeight: '800', color: '#7C2D12', lineHeight: 23, marginTop: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FDD9BC',
  },
  buttonText: { fontSize: 13.5, fontWeight: '800', color: '#111827' },
});