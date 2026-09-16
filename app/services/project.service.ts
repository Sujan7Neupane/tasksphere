import api from "../../lib/axios";

export const getProjects = async (workspaceId: string) => {
  // console.log("workspace id", workspaceId);

  const response = await api.get(`/workspaces/${workspaceId}/projects`);

  return response.data;
};

export const createProject = async (
  workspaceId: string,
  data: {
    name: string;
    description?: string;
  },
) => {
  const response = await api.post(`/workspaces/${workspaceId}/projects`, data);

  return response.data;
};

export const getProject = async (projectId: string) => {
  console.log(projectId);

  const response = await api.get(`/project/${projectId}`);

  return response.data;
};

export const updateProject = async (
  projectId: string,
  data: {
    name: string;
    description?: string;
  },
) => {
  const response = await api.put(`/project/${projectId}`, data);

  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/project/${projectId}`);

  return response.data;
};
