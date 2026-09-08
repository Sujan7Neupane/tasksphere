export interface Invitation {
  id: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitationData {
  workspaceId: string;
  email: string;
}

export interface MyInvitation {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  createdAt: string;

  workspace: {
    id: string;
    name: string;
    description: string | null;
  };

  invitedBy: {
    id: string;
    name: string;
  };
}
