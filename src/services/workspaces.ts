import type { CreateWorkspaceRequest, Workspace } from "../models/types";
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

export const updateWorkspace = async (workspace: Workspace) => {
  const response = await apiClient.put("/update-workspace", workspace);
  return response.data;
};

export const getWorkspaceById = async (workspaceId: number) => {
  const response = await apiClient.get(`/get-workspace?id=${workspaceId}`);
  return response.data;
};

export const deleteWorkspace = async (workspaceId: number) => {
  const response = await apiClient.delete(
    `/delete-workspace?id=${workspaceId}`
  );
  return response.data;
};
