import { createClient } from "@supabase/supabase-js";
import { ErrorResponse, ErrorType, Workspace } from "./types";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPERBASE_PUBLIC_KEY ?? ""
);

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
