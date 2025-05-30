import type { CreateECRequest, EC } from "../models/types";
import apiClient from "./ApiClient";

export const getECS = async (workspaceId: number) => {
  const response = await apiClient.get(
    "/get-all-ecs?workspace_id=" + workspaceId
  );
  return response.data;
};

export const getECById = async (ecId: number) => {
  const response = await apiClient.get("/get-ec-byid?id=" + ecId);
  return response.data;
};

export const createEC = async (ec: CreateECRequest) => {
  const response = await apiClient.post("/create-ec", ec);
  return response.data;
};

export const updateEC = async (ec: EC) => {
  const response = await apiClient.put("/update-ec-info", ec);
  return response.data;
};

export const deleteEC = async (ecId: number) => {
  const response = await apiClient.delete("/delete-ec?id=" + ecId);
  return response.data;
};

export const updateECSPoll = async (ecId: number, pollId: number) => {
  const response = await apiClient.put("/update-ec-polls", {
    ec_id: ecId,
    poll_id: pollId,
  });
  return response.data;
};
