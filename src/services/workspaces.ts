import type { CreateWorkspaceRequest } from "../models/types";
import apiClient from "./ApiClient";

export const createWorkspace = async (
  workspaceName: CreateWorkspaceRequest
) => {
  const response = await apiClient.post("/create-workspace", workspaceName);
  return response.data;
};

export const getWorkspaces = async () => {
  const response = await apiClient.get("/get-all-workstations");
  return response.data;
};
