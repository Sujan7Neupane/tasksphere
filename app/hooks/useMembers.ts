import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMembers,
  getWorkspaceMembers,
  removeMember,
  updateMemberRole,
} from "../services/member.service";

export const useMembers = (workspaceId: string) => {
  // console.log(workspaceId);

  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemberRole,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.workspaceId],
      });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.workspaceId],
      });
    },
  });
};

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
};
