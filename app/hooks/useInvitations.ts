import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptInvitation,
  cancelInvitation,
  createInvitation,
  getInvitations,
  getMyInvitations,
} from "../services/invitation.service";

export const useInvitations = (workspaceId: string, canManage: boolean) => {
  //   console.log(workspaceId);

  return useQuery({
    queryKey: ["invitations", workspaceId],
    queryFn: () => getInvitations(workspaceId),
    enabled: !!workspaceId && canManage,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvitation,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invitations", variables.workspaceId],
      });
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInvitation,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invitations", variables.workspaceId],
      });
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvitation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myInvitations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useMyInvitations = () => {
  return useQuery({
    queryKey: ["myInvitations"],
    queryFn: getMyInvitations,
  });
};
