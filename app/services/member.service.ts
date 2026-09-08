import api from "../lib/axios";
import { WorkspaceMember } from "../types/members.types";

export const getMembers = async (
  workspaceId: string,
): Promise<WorkspaceMember[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/members`);

  //   console.log("member response:", response.data);

  return response.data.members;
};

export const updateMemberRole = async ({
  workspaceId,
  userId,
  role,
}: {
  workspaceId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
}) => {
  const response = await api.patch(
    `/workspaces/${workspaceId}/members/${userId}`,
    { role },
  );

  return response.data;
};

export const removeMember = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  const response = await api.delete(
    `/workspaces/${workspaceId}/members/${userId}`,
  );

  return response.data;
};
