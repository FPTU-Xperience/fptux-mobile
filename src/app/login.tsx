// app/login.tsx
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BrandHeader from '@/components/login/BrandHeader';
import CampusList from '@/components/login/CampusList';
import HelpNote from '@/components/login/HelpNote';
import PromoCard from '@/components/login/PromoCard';
import SsoSection from '@/components/login/SsoSection';
import { useAuth } from '@/providers/AuthProvider';
import { ALLOWED_DOMAINS, CAMPUSES } from '@/services/mockAuth';

export default function LoginScreen() {
  const { signIn, sessionExpired } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Thành công => guard của Stack.Protected tự chuyển sang màn chính
      await signIn();
    } catch (e) {
      setLoading(false);
      Alert.alert(
        'Đăng nhập thất bại',
        e instanceof Error ? e.message : 'Vui lòng thử lại sau.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <PromoCard />
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