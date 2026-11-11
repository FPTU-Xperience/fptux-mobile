// components/scan/ManualCodeModal.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
};

export default function ManualCodeModal({ visible, submitting = false, onClose, onSubmit }: Props) {
  const [code, setCode] = useState('');

  // Xóa mã cũ mỗi lần mở lại
  useEffect(() => {
    if (visible) setCode('');
  }, [visible]);

  const canSubmit = code.trim().length > 0 && !submitting;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <Text style={styles.title}>Nhập mã điểm danh</Text>
          <Text style={styles.desc}>
            Nhập mã do ban tổ chức cung cấp khi không quét được mã QR.
          </Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="VD: HOLA-2024"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            style={styles.input}
          />

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirm, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
              onPress={() => onSubmit(code.trim())}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Xác nhận</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  desc: { fontSize: 13, lineHeight: 19, color: '#6B7280', marginTop: 6 },
  input: {
    marginTop: 16,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111827',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: { backgroundColor: '#F3F4F6' },
  cancelText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  confirm: { backgroundColor: '#F97316' },
  confirmText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  disabled: { opacity: 0.5 },
});