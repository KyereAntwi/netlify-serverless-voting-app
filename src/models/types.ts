export interface CreateWorkspaceRequest {
  title: string;
  description?: string;
}

export interface Workspace {
  id: number;
  title: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  description?: string;
}

export interface CreateECRequest {
  workspace_id: number;
  user_name: string;
  user_code: string;
}
export interface EC {
  id: number;
  created_at: string;
  workspace_id: number;
  created_by: string;
  user_name: string;
  user_code: string;
}

export interface ECPoll {
  ec_id: number;
  poll_id: number;
}

export interface Candidate {
  id: number;
  created_at: string;
  created_by: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  profile_image?: string;
  workspace_id: number;
}

export interface CreateCandidateRequest {
  first_name: string;
  last_name: string;
  other_names?: string;
  workspace_id: number;
}
