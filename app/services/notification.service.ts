import api from "../lib/axios";
import { NotificationsResponse } from "../types/notification.types";

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const response = await api.get("/notifications");

  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.patch(`/notifications/${notificationId}`);

  return response.data;
};
