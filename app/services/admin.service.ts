import { AdminUsersResponse } from "../types/user.types";
import api from "../lib/axios";
import {
  AdminWorkspaceDetailResponse,
  AdminWorkspacesResponse,
} from "../types/adminWorkspace.types";

// Admin users api
export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const response = await api.get("/auth/users");

  return response.data;
};

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  const response = await api.patch(`/auth/users/${userId}`, {
    isActive,
  });

  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/auth/users/${userId}`);

  return response.data;
};

// Admin WORKSPACE
export const getAdminWorkspaces =
  async (): Promise<AdminWorkspacesResponse> => {
    const response = await api.get("/admin/workspaces");

    return response.data;
  };

export const deleteAdminWorkspace = async (workspaceId: string) => {
  const response = await api.delete(`/admin/workspaces/${workspaceId}`);

  return response.data;
};

// details page
export const getAdminWorkspace = async (
  workspaceId: string,
): Promise<AdminWorkspaceDetailResponse> => {
  const response = await api.get(`/admin/workspaces/${workspaceId}`);

  return response.data;
};
