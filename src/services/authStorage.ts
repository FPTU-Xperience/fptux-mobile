// services/authStorage.ts
import * as SecureStore from 'expo-secure-store';

import type { Session } from '@/types/auth';

const KEY = 'clubhub.session';

export async function loadStoredSession(): Promise<Session | null> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export async function saveStoredSession(session: Session): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(session));
  } catch {
    // bỏ qua: phiên vẫn dùng được trong bộ nhớ, chỉ không giữ lại sau khi tắt app
  }
}

export async function clearStoredSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // bỏ qua
  }
}