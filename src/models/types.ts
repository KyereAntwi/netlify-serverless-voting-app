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
