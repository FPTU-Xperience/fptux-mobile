// components/login/HelpNote.tsx
import { CircleHelp } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function HelpNote() {
  return (
    <View style={styles.box}>
      <View style={styles.titleRow}>
        <CircleHelp size={16} color="#C2410C" />
        <Text style={styles.title}>Chưa có tài khoản mail FPTU?</Text>
      </View>
      <Text style={styles.text}>
        Tân sinh viên và cán bộ vui lòng liên hệ phòng Công tác sinh viên (CTS) hoặc IT Helpdesk
        tại campus để kích hoạt mail.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFF4EA',
    borderWidth: 1,
    borderColor: '#FDE3CC',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 13.5, fontWeight: '800', color: '#7C2D12' },
  text: { fontSize: 12.5, lineHeight: 19, color: '#6B7280', marginTop: 6 },
});