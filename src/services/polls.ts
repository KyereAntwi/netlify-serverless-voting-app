import type { CreatePollRequest, Poll } from "../models/types";
import apiClient from "./ApiClient";

export const getAllPolls = async (workspace_id: number) => {
  const response = await apiClient.get(
    "/get-all-polls?workspace_id=" + workspace_id
  );
  return response.data;
};

export const getPollById = async (id: number) => {
  const response = await apiClient.get("/get-poll-byid?id=" + id);
  return response.data;
};

export const createPoll = async (data: CreatePollRequest) => {
  const response = await apiClient.post("/create-poll", data);
  return response.data;
};

export const updatePoll = async (data: Poll) => {
  const response = await apiClient.put("/update-poll", data);
  return response.data;
};
