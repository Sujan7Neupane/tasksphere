import api from "../lib/axios";
import { DashboardResponse } from "../types/dashboard.types";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const response = await api.get("/dashboard");

  return response.data;
};
