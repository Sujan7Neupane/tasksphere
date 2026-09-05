import axios from "axios";

export const getCurrentUser = async () => {
  const response = await axios.get("/api/auth/me");

  return response.data.user;
};

export const updateProfile = async (formData: FormData) => {
  const response = await axios.patch("/api/auth/profile", formData);

  return response.data;
};
