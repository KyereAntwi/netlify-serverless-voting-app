import { createClient } from "@supabase/supabase-js";
import { EC, ECPoll, ErrorResponse, ErrorType, Workspace } from "./types";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPERBASE_PUBLIC_KEY ?? ""
);

// services for Workspaces
export const getWorkspaces = async (userId: string) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false })
    .filter("created_by", "eq", userId);

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as Workspace[];
};

export const getWorkspaceById = async (workspaceId: number) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as Workspace;
};

export const createWorkspace = async (payload: Workspace) => {
  const { data, error } = await supabase
    .from("workspaces")
    .insert([payload])
    .select("*")
    .single();
  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as Workspace;
};

export const updateWorkspace = async (payload: Workspace) => {
  const { data, error } = await supabase
    .from("workspaces")
    .update(payload)
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as Workspace;
};

export const deleteWorkspace = async (workspaceId: number) => {
  const { data, error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)
    .select("*")
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as Workspace;
};

// services for ECS
export const getAllECS = async (workspaceId: number) => {
  const { data, error } = await supabase
    .from("ecs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as EC[];
};

export const getECSById = async (ecsId: number) => {
  const { data, error } = await supabase
    .from("ecs")
    .select("*")
    .eq("id", ecsId)
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as EC;
};

export const createECS = async (payload: EC) => {
  const { data, error } = await supabase
    .from("ecs")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as EC;
};

export const updateECS = async (payload: EC) => {
  const { data, error } = await supabase
    .from("ecs")
    .update(payload)
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as EC;
};

export const updateECSPoll = async (ecsId: number, pollId: number) => {
  const { data, error } = await supabase
    .from("ec_poll")
    .insert([{ ec_id: ecsId, poll_id: pollId }])
    .select("*")
    .single();
  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as ECPoll;
};

export const deleteECS = async (ecsId: number) => {
  const { data, error } = await supabase
    .from("ecs")
    .delete()
    .eq("id", ecsId)
    .select("*")
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data as EC;
};
