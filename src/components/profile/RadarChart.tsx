// components/profile/RadarChart.tsx
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import type { CompetencyAxis } from '@/types/profile';

type Props = {
  axes: CompetencyAxis[];
  height?: number;
};

const W = 360;
const H = 270;
const CX = W / 2;
const CY = 132;
const R = 78;
const RINGS = [0.25, 0.5, 0.75, 1];

const point = (index: number, count: number, radius: number) => {
  const angle = ((-90 + (360 / count) * index) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
};

const toPoints = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(' ');

export default function RadarChart({ axes, height = 260 }: Props) {
  const n = axes.length;

  const dataPoints = axes.map((a, i) =>
    point(i, n, (Math.max(0, Math.min(100, a.value)) / 100) * R),
  );

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`}>
      {/* Lưới */}
      {RINGS.map((r) => (
        <Polygon
          key={r}
          points={toPoints(axes.map((_, i) => point(i, n, R * r)))}
          fill={r === 1 ? '#FAFAFB' : 'none'}
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}

      {/* Trục */}
      {axes.map((_, i) => {
        const p = point(i, n, R);
        return <Line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth={1} />;
      })}

      {/* Vùng dữ liệu */}
      <Polygon
        points={toPoints(dataPoints)}
        fill="rgba(249,115,22,0.25)"
        stroke="#F97316"
        strokeWidth={2}
      />
      {dataPoints.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#F97316" stroke="#fff" strokeWidth={1.5} />
      ))}

      {/* Nhãn */}
      {axes.map((a, i) => {
        const p = point(i, n, R + 20);
        const anchor = p.x < CX - 5 ? 'end' : p.x > CX + 5 ? 'start' : 'middle';
        const dy = p.y < CY - R ? -2 : p.y > CY + R ? 10 : 4;
        return (
          <SvgText
            key={a.label}
            x={p.x}
            y={p.y + dy}
            fontSize={12}
            fontWeight="700"
            fill="#111827"
            textAnchor={anchor}>
            {a.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}