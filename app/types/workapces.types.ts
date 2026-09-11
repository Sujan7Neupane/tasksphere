export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
}

export interface GetWorkspacesResponse {
  userId: string;
  workspaces: Workspace[];
}

export interface GetWorkspaceResponse {
  role: "OWNER" | "ADMIN" | "MEMBER";
  workspace: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
}

export interface CreateWorkspaceResponse {
  message: string;
  workspace: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateWorkspaceData {
  name: string;
  description?: string;
}

export type WorkspaceMember = {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
};

export type WorkspaceMembersResponse = {
  workspaceId: string;
  members: WorkspaceMember[];
};
