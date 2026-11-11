// components/profile/SkillsCard.tsx
import { Award } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';

type Props = { skills: string[] };

export default function SkillsCard({ skills }: Props) {
  return (
    <Card>
      <CardTitle icon={Award} title="Kỹ năng & thế mạnh" />
      <View style={styles.wrap}>
        {skills.map((s) => (
          <View key={s} style={styles.chip}>
            <Text style={styles.chipText}>{s}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFEFE3',
    borderWidth: 1,
    borderColor: '#FED7B8',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#9A3412' },
});