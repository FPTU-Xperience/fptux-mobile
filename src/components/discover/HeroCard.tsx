// components/discover/HeroCard.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecoHero } from '@/types/recommendation';

type Props = {
  hero: RecoHero;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
};

export default function HeroCard({ hero, onPressPrimary, onPressSecondary }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.decoBig} />
      <View style={styles.decoSmall} />

      <View style={styles.eyebrow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrowText}>{hero.eyebrow}</Text>
      </View>

      <Text style={styles.title}>{hero.title}</Text>
      <Text style={styles.highlight}>{hero.highlight}</Text>
      <Text style={styles.desc}>{hero.description}</Text>

      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.primary]} onPress={onPressPrimary}>
          <Text style={styles.primaryText}>{hero.primaryCta}</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={onPressSecondary}>
          <Text style={styles.secondaryText}>{hero.secondaryCta}</Text>
        </Pressable>
      </View>

      <View style={styles.miniRow}>
        {hero.miniCards.map((m) => (
          <View key={m.id} style={[styles.mini, m.tone === 'dark' ? styles.miniDark : styles.miniLight]}>
            <Text style={[styles.miniLabel, m.tone === 'dark' && styles.miniLabelDark]}>
              {m.label}
            </Text>
            <Text style={[styles.miniTitle, m.tone === 'dark' && styles.miniTitleDark]}>
              {m.title}
            </Text>
            {m.note ? <Text style={styles.miniNote}>{m.note}</Text> : null}
          </View>
        ))}
      </View>

      <View style={styles.proof}>
        <View style={styles.avatars}>
          {hero.socialProof.avatars.map((a, i) => (
            <View key={a} style={[styles.avatar, i > 0 && styles.avatarOverlap]}>
              <Text style={styles.avatarText}>{a}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.proofText}>{hero.socialProof.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 18,
    borderRadius: 26,
    backgroundColor: '#F97316',
    overflow: 'hidden',
  },
  decoBig: {
    position: 'absolute',
    right: -70,
    top: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  decoSmall: {
    position: 'absolute',
    left: -40,
    bottom: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eyebrow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  eyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  eyebrowText: { color: '#fff', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.6 },

  title: { color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 36, marginTop: 16 },
  highlight: { color: '#3B1A06', fontSize: 30, fontWeight: '800', lineHeight: 36 },
  desc: { color: '#FFF1E6', fontSize: 13, lineHeight: 19, marginTop: 10 },

  buttons: { flexDirection: 'row', gap: 10, marginTop: 16 },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#1F2937' },
  primaryText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  secondary: { backgroundColor: 'rgba(255,255,255,0.28)' },
  secondaryText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  miniRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  mini: { flex: 1, padding: 12, borderRadius: 16, minHeight: 84, justifyContent: 'center' },
  miniDark: { backgroundColor: '#1F2937' },
  miniLight: { backgroundColor: 'rgba(255,255,255,0.92)' },
  miniLabel: { fontSize: 9, fontWeight: '800', color: '#9A3412', letterSpacing: 0.6 },
  miniLabelDark: { color: '#FDBA74' },
  miniTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 4, lineHeight: 19 },
  miniTitleDark: { color: '#fff', fontSize: 18 },
  miniNote: { fontSize: 9.5, color: '#9CA3AF', marginTop: 6, fontWeight: '700' },

  proof: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  avatars: { flexDirection: 'row' },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FED7AA',
    borderWidth: 2,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: { marginLeft: -8 },
  avatarText: { fontSize: 8.5, fontWeight: '800', color: '#9A3412' },
  proofText: { flex: 1, fontSize: 11.5, color: '#FFF1E6', fontWeight: '600' },
});