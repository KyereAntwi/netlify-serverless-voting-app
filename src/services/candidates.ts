import type { Candidate, CreateCandidateRequest } from "../models/types";
import apiClient from "./ApiClient";

export const createCandidate = async (data: CreateCandidateRequest) => {
  const response = await apiClient.post("/create-candidate", data);
  return response;
};

export const deleteCandidate = async (id: number) => {
  const response = await apiClient.delete("/delete-candidate?id=" + id);
  return response;
};

export const getAllCandidate = async (workspace_id: number) => {
  const response = await apiClient.get(
    "/get-all-candidates?workspace_id=" + workspace_id
  );
  return response;
};

export const getCandidate = async (id: number) => {
  const response = await apiClient.get("/get-candidate-byid?id=" + id);
  return response;
};

export const upgradeCandidate = async (candidate: Candidate) => {
  const response = await apiClient.put("/update-candidate", candidate);
  return response;
};
