// components/login/SsoSection.tsx
import { Lock, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  domains: string[];
  loading: boolean;
  /** Hiện cảnh báo khi vừa bị đưa về login do hết hạn phiên */
  sessionExpired: boolean;
  onPressGoogle: () => void;
};

export default function SsoSection({ domains, loading, sessionExpired, onPressGoogle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <ShieldCheck size={14} color="#C2410C" />
        <Text style={styles.badgeText}>Đăng nhập tài khoản trường</Text>
      </View>

      <Text style={styles.title}>Cổng Single Sign-On (SSO)</Text>
      <Text style={styles.desc}>
        Vui lòng sử dụng địa chỉ email Google do trường cấp
      </Text>

      {sessionExpired && (
        <View style={styles.expired}>
          <TriangleAlert size={16} color="#C2410C" />
          <Text style={styles.expiredText}>
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
          </Text>
        </View>
      )}

      <View style={styles.domains}>
        {domains.map((d, i) => (
          <View key={d} style={styles.domainRow}>
            {i > 0 && <Text style={styles.or}>hoặc</Text>}
            <View style={styles.domain}>
              <Text style={styles.domainText}>@{d}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.google, loading && styles.googleLoading]}
        onPress={onPressGoogle}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#1D4ED8" />
        ) : (
          <>
            <View style={styles.gIcon}>
              <Text style={styles.gText}>G</Text>
            </View>
            <Text style={styles.googleText}>Tiếp tục với Google (@{domains[0]})</Text>
          </>
        )}
      </Pressable>

      <View style={styles.lockRow}>
        <Lock size={13} color="#9CA3AF" />
        <Text style={styles.lockText}>
          Xác thực một lần (SSO) an toàn qua Google Workspace FPT Education
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 26 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFF1E6',
    borderWidth: 1,
    borderColor: '#FDDCC0',
  },
  badgeText: { fontSize: 11.5, fontWeight: '700', color: '#C2410C' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 14 },
  desc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
  },

  expired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFEDE0',
  },
  expiredText: { flex: 1, fontSize: 12.5, lineHeight: 18, color: '#9A3412', fontWeight: '600' },

  domains: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  domainRow: { flexDirection: 'row', alignItems: 'center' },
  or: { fontSize: 12, color: '#6B7280', marginHorizontal: 8 },
  domain: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#D6E2FF',
  },
  domainText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },

  google: {
    alignSelf: 'stretch',
    height: 60,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 18,
    backgroundColor: '#EEF3FF',
    borderWidth: 1.5,
    borderColor: '#D6E2FF',
  },
  googleLoading: { opacity: 0.7 },
  gIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gText: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  googleText: { fontSize: 16, fontWeight: '800', color: '#1D4ED8' },

  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  lockText: { flexShrink: 1, fontSize: 11.5, color: '#9CA3AF', textAlign: 'center' },
});