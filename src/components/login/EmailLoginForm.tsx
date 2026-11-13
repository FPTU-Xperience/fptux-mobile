// components/login/EmailLoginForm.tsx
import { ChevronDown, Eye, EyeOff, TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  /** Đăng nhập: app validate form trước khi gọi. */
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  /** Thông báo lỗi từ server (invalid_credentials...) — hiện trong form. */
  error: string | null;
  /** Xóa lỗi server khi user sửa lại input (tránh báo lỗi cũ). */
  onClearError: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailLoginForm({ onSubmit, loading, error, onClearError }: Props) {
  // Mở sẵn: đăng nhập Google đang gặp trục trặc nên email là đường chính.
  const [expanded, setExpanded] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const clearAllErrors = () => {
    setFieldError(null);
    onClearError();
  };

  const submit = async () => {
    Keyboard.dismiss();
    if (loading) return;
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setFieldError('Vui lòng nhập một địa chỉ email hợp lệ.');
      return;
    }
    if (!password) {
      setFieldError('Vui lòng nhập mật khẩu.');
      return;
    }
    setFieldError(null);
    onClearError();
    try {
      await onSubmit(normalized, password);
    } catch {
      // Lỗi server do parent nắm (prop `error`) → không cần hiển thị ở đây.
    }
  };

  return (
    <View style={styles.wrap}>
      <Pressable style={[styles.toggle, expanded && styles.toggleOpen]} onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.toggleText}>
          {expanded ? 'Ẩn đăng nhập bằng email / mật khẩu' : 'Đăng nhập bằng email / mật khẩu'}
        </Text>
        <ChevronDown size={16} color="#6B7280" style={expanded ? styles.chevronOpen : undefined} />
      </Pressable>

      {expanded && (
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#9CA3AF"
            autoComplete="email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (fieldError || error) clearAllErrors();
            }}
            editable={!loading}
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Mật khẩu"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              textContentType="password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (fieldError || error) clearAllErrors();
              }}
              editable={!loading}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8} style={styles.eyeBtn}>
              {showPassword ? <Eye size={16} color="#6B7280" /> : <EyeOff size={16} color="#6B7280" />}
            </Pressable>
          </View>

          {(fieldError || error) && (
            <View style={styles.errorBox}>
              <TriangleAlert size={15} color="#9A3412" />
              <Text style={styles.errorText}>{fieldError || error}</Text>
            </View>
          )}

          <Pressable style={[styles.submit, loading && styles.submitLoading]} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Đăng nhập</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', marginTop: 20 },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  toggleOpen: { opacity: 0.6 },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  toggleText: { fontSize: 13.5, fontWeight: '700', color: '#1D4ED8' },

  form: {
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: 14.5,
    color: '#111827',
    marginBottom: 14,
  },
  passwordRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  passwordInput: { flex: 1, marginBottom: 0 },
  eyeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFEDE0',
    marginBottom: 14,
  },
  errorText: { flex: 1, fontSize: 12, color: '#9A3412', lineHeight: 17 },

  submit: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLoading: { opacity: 0.8 },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
