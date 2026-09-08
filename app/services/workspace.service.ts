import api from "../lib/axios";
import {
  CreateWorkspaceData,
  CreateWorkspaceResponse,
  GetWorkspaceResponse,
  GetWorkspacesResponse,
  UpdateWorkspaceData,
  Workspace,
} from "../types/workapces.types";

// get all workspaces
export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<GetWorkspacesResponse>("/workspaces");
  //   console.log(response);

  return response.data.workspaces;
};

// get specific workspace
export const getWorkspace = async (
  workspaceId: string,
): Promise<GetWorkspaceResponse> => {
  const response = await api.get<GetWorkspaceResponse>(
    `/workspaces/${workspaceId}`,
  );

  // console.log(response);

  return response.data;
};

export const createWorkspace = async (data: CreateWorkspaceData) => {
  const response = await api.post<CreateWorkspaceResponse>("/workspaces", data);

  return response.data;
};

export const updateWorkspace = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: UpdateWorkspaceData;
}) => {
  const response = await api.patch(`/workspaces/${workspaceId}`, data);
  // console.log(response);

  return response.data;
};

export const deleteWorkspace = async (workspaceId: string) => {
  const response = await api.delete(`/workspaces/${workspaceId}`);

  return response.data;
};
