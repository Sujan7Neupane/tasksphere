export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  platformRole: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUsersResponse = {
  users: AdminUser[];
};
