import api from "../../lib/axios";
import {
  CreateInvitationData,
  Invitation,
  MyInvitation,
} from "../types/invitations.types";

export const getInvitations = async (
  workspaceId: string,
): Promise<Invitation[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/invitations`);

  //   console.log(response);

  return response.data.invitations;
};

export const createInvitation = async ({
  workspaceId,
  email,
}: CreateInvitationData) => {
  const response = await api.post(`/workspaces/${workspaceId}/invitations`, {
    email,
  });

  return response.data;
};

export const cancelInvitation = async ({
  workspaceId,
  invitationId,
}: {
  workspaceId: string;
  invitationId: string;
}) => {
  const response = await api.delete(
    `/workspaces/${workspaceId}/invitations/${invitationId}`,
  );

  return response.data;
};

export const acceptInvitation = async (token: string) => {
  const response = await api.post(`/invitations/${token}/accept`);

  return response.data;
};

// Accept invitation through links
export const getMyInvitations = async (): Promise<MyInvitation[]> => {
  const response = await api.get("/invitations");
  //   console.log(response.data);

  return response.data.invitations;
};
