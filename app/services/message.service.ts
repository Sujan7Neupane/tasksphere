import api from "../lib/axios";
import { MessagesResponse, SendMessageData } from "../types/message.types";

export const getMessages = async (
  workspaceId: string,
): Promise<MessagesResponse> => {
  const response = await api.get(`/workspaces/${workspaceId}/messages`);

  return response.data;
};

export const sendMessage = async (
  workspaceId: string,
  data: SendMessageData,
) => {
  const response = await api.post(`/workspaces/${workspaceId}/messages`, data);

  return response.data;
};
