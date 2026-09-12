export type AdminWorkspaceOwner = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type AdminWorkspace = {
  id: string;
  name: string;
  description: string | null;
  owner: AdminWorkspaceOwner | null;
  memberCount: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminWorkspacesResponse = {
  workspaces: AdminWorkspace[];
};

// workspace member types
export type AdminWorkspaceMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: AdminWorkspaceOwner;
};

export type AdminWorkspaceDetail = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  owner: AdminWorkspaceOwner | null;
  memberCount: number;
  projectCount: number;
  members: AdminWorkspaceMember[];
};

export type AdminWorkspaceDetailResponse = {
  workspace: AdminWorkspaceDetail;
};
