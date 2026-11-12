// components/login/PromoCard.tsx
import { Users } from 'lucide-react-native';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

type Props = {
  /** Ảnh minh họa. Nếu bỏ trống sẽ dùng khối màu thay thế. */
  image?: ImageSourcePropType;
};

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export default function PromoCard({ image }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>KHỞI ĐẦU TRẢI NGHIỆM</Text>

      <Text style={styles.title}>
        Make your time <Text style={styles.italic}>mean something.</Text>
      </Text>

      <View style={styles.imageBox}>
        {image ? (
          <Image source={image} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <>
            <View style={styles.circleA} />
            <View style={styles.circleB} />
            <Users size={48} color="rgba(255,255,255,0.55)" />
          </>
        )}

        <View style={styles.badgeLeft}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>70+ Câu lạc bộ sinh viên</Text>
        </View>
        <View style={styles.badgeRight}>
          <Text style={styles.badgeText}>Hola Season</Text>
        </View>
      </View>

      <Text style={styles.desc}>
        Không gian số kết nối hơn 70+ câu lạc bộ, sự kiện văn hoá - thể thao và hàng ngàn hoạt
        động đặc quyền tại FPT University.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    padding: 18,
    borderRadius: 26,
    backgroundColor: '#FFF4EA',
    borderWidth: 1,
    borderColor: '#FDE3CC',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#F97316', letterSpacing: 1 },
  title: {
    fontFamily: SERIF,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 38,
    marginTop: 10,
  },
  italic: { color: '#F97316', fontStyle: 'italic' },

  imageBox: {
    height: 180,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleA: {
    position: 'absolute',
    left: -30,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(249,115,22,0.45)',
  },
  circleB: {
    position: 'absolute',
    right: -40,
    bottom: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  badgeLeft: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  badgeRight: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  badgeText: { fontSize: 10.5, fontWeight: '700', color: '#1F2937' },

  desc: { fontSize: 13.5, lineHeight: 21, color: '#4B5563', marginTop: 16 },
});