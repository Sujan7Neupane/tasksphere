export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;

  project: TaskProject;
  projectId: string;

  assignedToId: string | null;
  assignedTo: TaskUser | null;

  createdById: string;
  createdBy: TaskUser;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignedToId?: string | null;
};

export type UpdateTaskData = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
};

export type UpdateTaskStatusData = {
  status: TaskStatus;
};

export type AssignTaskData = {
  assignedToId: string | null;
};

export type TaskProject = {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
};
