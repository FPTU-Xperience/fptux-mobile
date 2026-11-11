// components/profile/CompetencyCard.tsx
import { Target } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import CardTitle from '@/components/common/CardTitle';
import type { Competency } from '@/types/profile';

import RadarChart from './RadarChart';

type Props = { data: Competency };

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function CompetencyCard({ data }: Props) {
  return (
    <Card>
      <CardTitle
        icon={Target}
        title="Bản đồ đa chiều năng lực"
        right={
          <View style={styles.live}>
            <Text style={styles.liveText}>Realtime</Text>
          </View>
        }
      />

      <Text style={styles.quote}>“{data.quote}”</Text>

      <RadarChart axes={data.axes} />

      <View style={styles.metrics}>
        <Metric label="Độ sâu" value={`${data.depth} / 100`} />
        <View style={styles.divider} />
        <Metric label="Độ đều" value={`${data.evenness}%`} />
        <View style={styles.divider} />
        <Metric label="Hệ số thực" value={`×${data.factor.toFixed(1)}`} />
      </View>

      <Text style={styles.note}>{data.note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  live: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#FFE9D6',
  },
  liveText: { fontSize: 10, fontWeight: '700', color: '#C2410C' },
  quote: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#374151',
    lineHeight: 21,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
  },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 10.5, color: '#6B7280', fontWeight: '600' },
  metricValue: { fontSize: 14, fontWeight: '800', color: '#111827', marginTop: 3 },
  divider: { width: 1, height: 28, backgroundColor: '#E5E7EB' },
  note: {
    marginTop: 12,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#6B7280',
    textAlign: 'center',
  },
});