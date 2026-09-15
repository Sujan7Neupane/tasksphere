export type NotificationType =
  | "WORKSPACE_INVITATION"
  | "TASK_ASSIGNED"
  | "TASK_COMMENT"
  | "ROLE_CHANGED";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedId: string | null;
  createdAt: string;
  userId: string;
}

export interface NotificationsResponse {
  data: Notification[];
  unreadCount: number;
}
