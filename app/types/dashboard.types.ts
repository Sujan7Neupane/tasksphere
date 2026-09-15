export interface DashboardTask {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
}

export interface DashboardNotification {
  id: string;
  type:
    | "WORKSPACE_INVITATION"
    | "TASK_ASSIGNED"
    | "TASK_COMMENT"
    | "ROLE_CHANGED";
  message: string;
  isRead: boolean;
  relatedId: string | null;
  createdAt: string;
}

export interface DashboardResponse {
  workspacesCount: number;
  projectsCount: number;
  tasksCount: number;
  unreadNotificationsCount: number;
  recentTasks: DashboardTask[];
  recentNotifications: DashboardNotification[];
}
