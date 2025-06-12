import { createClient } from "@supabase/supabase-js";
import {
  Candidate, Category,
  EC,
  ECPoll,
  ErrorResponse,
  ErrorType,
  Poll,
  Workspace,
} from "./types";

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

// services for nominees
export const getNomineeById = async (nomineeId: number) => {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", nomineeId)
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data;
};

export const getAllNominees = async (
  workspace_id: number,
  keyword?: string
) => {
  let query = supabase
    .from("candidates")
    .select("*")
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false });

  if (keyword && keyword.trim() !== "") {
    query = query.or(
      `first_name.ilike.%${keyword}%,last_name.ilike.%${keyword}%,other_names.ilike.%${keyword}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data;
};

export const createNominee = async (payload: Candidate) => {
  const { data, error } = await supabase
    .from("candidates")
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
  return data;
};

export const updateNominee = async (payload: Candidate) => {
  const { data, error } = await supabase
    .from("candidates")
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
  return data;
};

export const deleteNominee = async (nomineeId: number) => {
  const { data, error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", nomineeId)
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
  return data;
};

// services for polls
export const getAllPols = async (workspace_id: number, keyword?: string) => {
  let query = supabase
    .from("polls")
    .select("*")
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false });

  if (keyword && keyword.trim() !== "") {
    query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  }

  const { data, error } = await query;

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }

  return data;
};

export const getPollById = async (poll_id: number) => {
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", poll_id)
    .single();

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data;
};

export const createPoll = async (payload: Poll) => {
  const { data, error } = await supabase
    .from("polls")
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
  return data;
};

export const updatePoll = async (payload: Poll) => {
  const { data, error } = await supabase
    .from("polls")
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
  return data as Poll;
};

export const deletePoll = async (poll_id: number) => {
  const { data, error } = await supabase
      .from("polls")
      .delete()
      .eq("id", poll_id)
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
  
  return data;
}

// services for categories
export const getCategoryById = async (category_id: number) => {
  let query = supabase
      .from("categories")
      .select("*")
      .eq("id", category_id)
      .single();

  const { data, error } = await query;

  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };

    throw new Error(JSON.stringify(err));
  }
  return data;
}

export const getPollCategories = async (poll_id: number) => {
  let query = supabase
      .from("categories")
      .select("*")
      .eq("poll_id", poll_id)
      .order("created_at", { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    const err: ErrorResponse = {
      message: error.message,
      code: error.code,
      type: ErrorType.InternalServerError,
    };
    
    throw new Error(JSON.stringify(err));
  }
  
  return data;
}

export const createCategory = async (payload: Category) => {
  const { data, error } = await supabase
      .from("categories")
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
  return data;
}

export const updateCategory = async (payload: Category) => {
  const { data, error } = await supabase
      .from("categories")
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
  return data;
}

export const deleteCategory = async (category_id: number) => {
  const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category_id)
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
  return data;
}
