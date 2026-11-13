// services/notifications.ts
//
// Nguồn dữ liệu thật cho thông báo.
//
// - GET /api/notifications?unreadOnly=true → NotificationResponse[]
// - POST /api/notifications/{id}/read  (đánh dấu đã đọc)
//
// Contract BE (NotificationService/Contracts/NotificationContracts.cs):
//   { id, recipientUserId, recipientRole, eventType, title, message, isRead, createdAtUtc }

import { apiFetch, toQuery } from '@/services/apiClient';
import type { Notification } from '@/types/api';

/** GET /api/notifications?unreadOnly=true */
export async function fetchNotifications(unreadOnly = false): Promise<Notification[]> {
  const query = toQuery({ unreadOnly: unreadOnly ? true : null });
  const list = await apiFetch<Notification[]>(`/api/notifications${query}`);
  return list ?? [];
}

/** Số thông báo chưa đọc — dùng cho badge trên AppTopBar. */
export async function fetchUnreadCount(): Promise<number> {
  const list = await fetchNotifications(true);
  return list.length;
}

/** PUT /api/notifications/{id}/read — đánh dấu một thông báo đã đọc. */
export async function markNotificationRead(id: number): Promise<void> {
  await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
}

/** PUT /api/notifications/read-all — đánh dấu toàn bộ đã đọc. */
export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/api/notifications/read-all', { method: 'PUT' });
}
