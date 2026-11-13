// components/club-detail/JoinForm.tsx
//
// Form gửi hồ sơ gia nhập CLB (POST /api/clubs/{id}/join).
//
// Quyết định scope #1: thay nút "nộp hồ sơ 1 chạm" bằng form nhỏ, prefill từ
// useAuth().user (họ tên + email ở chế độ read-only vì BE tự lấy hồ sơ chuẩn),
// người dùng điền SĐT + lý do + tick 2 ô đồng ý.
//
// BE validate (ValidationExtensions.ValidateJoinRequest):
//   - fullName / email / reason bắt buộc
//   - phoneNumber: 9-15 chữ số (optional ở BE nhưng form này bắt buộc)
//   - acceptedClubRules && committedToParticipate bắt buộc = true
//   - reason ≤ 1000 ký tự

import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, X } from 'lucide-react-native';

import { getApiErrorMessage } from '@/services/apiClient';
import { joinClub } from '@/services/clubs';
import type { AuthUser } from '@/types/auth';

type Props = {
  visible: boolean;
  clubId: string;
  clubName: string;
  user: AuthUser | null;
  onClose: () => void;
  /** Gọi khi gửi hồ sơ thành công. */
  onSuccess?: () => void;
};

type Errors = {
  phone?: string;
  reason?: string;
  consents?: string;
};

export default function JoinForm({
  visible,
  clubId,
  clubName,
  user,
  onClose,
  onSuccess,
}: Props) {
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reset = () => {
    setPhone('');
    setReason('');
    setAcceptedRules(false);
    setCommitted(false);
    setErrors({});
    setSubmitError(null);
    setSubmitting(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  /** Validate cục bộ trước khi gọi API. */
  const validate = (): boolean => {
    const next: Errors = {};

    const digits = phone.replace(/\D/g, '');
    if (!digits) next.phone = 'Vui lòng nhập số điện thoại.';
    else if (digits.length < 9 || digits.length > 15) {
      next.phone = 'Số điện thoại phải có 9-15 chữ số.';
    }

    if (!reason.trim()) next.reason = 'Vui lòng nêu lý do muốn gia nhập.';
    else if (reason.trim().length > 1000) next.reason = 'Lý do tối đa 1000 ký tự.';

    if (!acceptedRules || !committed) {
      next.consents = 'Bạn cần đồng ý với cả hai cam kết để gửi hồ sơ.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await joinClub(clubId, {
        fullName: user?.name ?? '',
        email: user?.email ?? '',
        phoneNumber: phone.trim(),
        reason: reason.trim(),
        acceptedClubRules: acceptedRules,
        committedToParticipate: committed,
      });

      if (result.success) {
        reset();
        onSuccess?.();
        onClose();
      } else {
        setSubmitError(result.message);
      }
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={close} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Gia nhập {clubName}</Text>
                <Text style={styles.subtitle}>Điền thông tin để gửi hồ sơ tới ban chủ nhiệm.</Text>
              </View>
              <Pressable style={styles.close} onPress={close} hitSlop={8}>
                <X size={18} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* Họ tên & email — prefill, read-only */}
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.name ?? ''}
                editable={false}
                placeholder="Chưa đăng nhập"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email ?? ''}
                editable={false}
                placeholder="Chưa đăng nhập"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
                }}
                placeholder="VD: 0912345678"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

              <Text style={styles.label}>Lý do muốn gia nhập *</Text>
              <TextInput
                style={[styles.input, styles.textarea, errors.reason && styles.inputError]}
                value={reason}
                onChangeText={(t) => {
                  setReason(t);
                  if (errors.reason) setErrors((e) => ({ ...e, reason: undefined }));
                }}
                placeholder="Chia sẻ mong muốn và đóng góp của bạn với CLB..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
              {errors.reason ? <Text style={styles.error}>{errors.reason}</Text> : null}

              <CheckOption
                checked={acceptedRules}
                onToggle={() => {
                  setAcceptedRules((v) => !v);
                  if (errors.consents) setErrors((e) => ({ ...e, consents: undefined }));
                }}
                label="Tôi đã đọc và đồng ý với nội quy của câu lạc bộ."
              />
              <CheckOption
                checked={committed}
                onToggle={() => {
                  setCommitted((v) => !v);
                  if (errors.consents) setErrors((e) => ({ ...e, consents: undefined }));
                }}
                label="Tôi cam kết tham gia đầy đủ các hoạt động của CLB."
              />
              {errors.consents ? <Text style={styles.error}>{errors.consents}</Text> : null}

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
            </ScrollView>

            <Pressable
              style={[styles.submit, submitting && styles.submitOff]}
              onPress={submit}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Gửi hồ sơ gia nhập</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function CheckOption({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(17,24,39,0.45)', justifyContent: 'flex-end' },
  backdropTap: { flex: 1 },
  sheetWrap: { maxHeight: '88%' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 12.5, lineHeight: 18, color: '#6B7280', marginTop: 3 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { marginTop: 14 },
  bodyContent: { paddingBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputDisabled: { backgroundColor: '#F9FAFB', color: '#6B7280' },
  inputError: { borderColor: '#EF4444' },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  error: { fontSize: 11.5, color: '#DC2626', marginTop: 5 },
  submitError: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#DC2626',
    marginTop: 14,
    backgroundColor: '#FEF2F2',
    padding: 11,
    borderRadius: 12,
  },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: { backgroundColor: '#F97316', borderColor: '#F97316' },
  checkLabel: { flex: 1, fontSize: 12.5, lineHeight: 18, color: '#374151' },
  submit: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitOff: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
