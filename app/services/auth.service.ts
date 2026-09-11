import api from "../lib/axios";

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.user;
};

export const updateProfile = async (formData: FormData) => {
  const response = await api.patch("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  // console.log(response);

  return response.data;
};

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordData) => {
  const response = await api.patch("/auth/change-password", data);

  return response.data;
};
