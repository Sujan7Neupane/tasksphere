import api from "../lib/axios";

import {
  AssignTaskData,
  CreateTaskData,
  Task,
  UpdateTaskData,
  UpdateTaskStatusData,
} from "../types/task.types";

export const getTasks = async (
  projectId: string,
): Promise<{ tasks: Task[] }> => {
  const response = await api.get(`/project/${projectId}/tasks`);

  return response.data;
};

export const createTask = async (projectId: string, data: CreateTaskData) => {
  const response = await api.post(`/project/${projectId}/tasks`, data);

  console.log(response);

  return response.data;
};

export const getTask = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

export const updateTask = async (taskId: string, data: UpdateTaskData) => {
  const response = await api.put(`/tasks/${taskId}`, data);

  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  data: UpdateTaskStatusData,
) => {
  const response = await api.patch(`/tasks/${taskId}/status`, data);

  return response.data;
};

export const assignTask = async (taskId: string, data: AssignTaskData) => {
  const response = await api.patch(`/tasks/${taskId}/assign`, data);

  return response.data;
};
