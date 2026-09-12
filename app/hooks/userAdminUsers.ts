import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminWorkspace,
  deleteUser,
  getAdminUsers,
  getAdminWorkspace,
  getAdminWorkspaces,
  updateUserStatus,
} from "../services/admin.service";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAdminUsers,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatus(userId, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });
};

// Admin user workspace
export const useAdminWorkspaces = () => {
  return useQuery({
    queryKey: ["adminWorkspaces"],
    queryFn: getAdminWorkspaces,
  });
};

export const useDeleteAdminWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminWorkspace,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminWorkspaces"],
      });
    },
  });
};

export const useAdminWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: ["adminWorkspace", workspaceId],
    queryFn: () => getAdminWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
};
