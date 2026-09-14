import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../services/message.service";
import { SendMessageData } from "../types/message.types";

export const useMessages = (workspaceId: string) => {
  return useQuery({
    queryKey: ["messages", workspaceId],
    queryFn: () => getMessages(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useSendMessage = (workspaceId: string) => {
  return useMutation({
    mutationFn: (data: SendMessageData) => sendMessage(workspaceId, data),
  });
};
