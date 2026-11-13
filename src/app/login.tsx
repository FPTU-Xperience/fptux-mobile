// app/login.tsx
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ALLOWED_DOMAINS, CAMPUSES } from '@/constants/auth';
import BrandHeader from '@/components/login/BrandHeader';
import CampusList from '@/components/login/CampusList';
import HelpNote from '@/components/login/HelpNote';
import PromoCard from '@/components/login/PromoCard';
import SsoSection from '@/components/login/SsoSection';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const { signIn, signOut, sessionExpired, status } = useAuth();
  const [loading, setLoading] = useState(false);

  const noToken = status === 'unauthenticated';

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // DEV-TOKEN MODE: signIn hiện là no-op; khi dev token hợp lệ, guard
      // của Stack.Protected đã đưa app vào màn chính. Nút này chờ Phase 7.
      await signIn();
      signOut(); // giữ trạng thái unauthenticated khi chưa có token thật
      Alert.alert(
        'Cần token phát triển',
        'App đang ở chế độ dev-token. Hãy đặt EXPO_PUBLIC_DEV_ACCESS_TOKEN trong .env rồi khởi động lại, hoặc chờ tính năng đăng nhập thật (Phase 7).',
      );
    } catch (e) {
      Alert.alert('Đăng nhập thất bại', e instanceof Error ? e.message : 'Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <PromoCard />
        {noToken ? <DevTokenNotice /> : null}
        <SsoSection
          domains={ALLOWED_DOMAINS}
          loading={loading}
          sessionExpired={sessionExpired}
          onPressGoogle={handleGoogle}
        />
        <CampusList campuses={CAMPUSES} />
        <HelpNote />

        <Text style={styles.terms}>
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <Text style={styles.link}>Điều khoản dịch vụ</Text> và{' '}
          <Text style={styles.link}>Chính sách quyền riêng tư</Text> của FPTU Xperience.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.footerBrand}>clubhub.</Text> — Một phần của hành trình FPTU
            Xperience
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  terms: {
    fontSize: 11.5,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  link: { color: '#F97316', textDecorationLine: 'underline', fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 11, color: '#9CA3AF' },
  footerBrand: { fontWeight: '800', color: '#6B7280' },
});

function DevTokenNotice() {
  return (
    <View style={{ marginBottom: 16, padding: 12, borderRadius: 12, backgroundColor: '#FFF7ED' }}>
      <Text style={{ fontSize: 12, color: '#9A3412', lineHeight: 18 }}>
        <Text style={{ fontWeight: '800' }}>Chế độ phát triển. </Text>
        App đang dùng{' '}
        <Text style={{ fontWeight: '700' }}>EXPO_PUBLIC_DEV_ACCESS_TOKEN</Text>. Đặt token thật vào .env
        để đọc dữ liệu thật từ API.
      </Text>
    </View>
  );
}