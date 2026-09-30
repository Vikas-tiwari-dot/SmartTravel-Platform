import { api } from "./api";

export async function getNotifications() {
  return api.get("/notifications");
}

export async function markAsRead(id) {
  return api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  return api.patch("/notifications/read-all");
}
