export interface ErrorResponse {
  message: string;
  code?: string;
  type?: ErrorType;
}

export enum ErrorType {
  NotFound = "NotFound",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  InternalServerError = "InternalServerError",
}

export interface Workspace {
  id?: number;
  title: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  description?: string;
}

export interface Poll {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  workspace_id: number;
  created_by: string;
  is_active: boolean;
  type: PollType;
}

export enum PollType {
  Single = "Single",
  NonAutorisedCategory = "NonAutorisedCategory",
  AutorisedCategory = "AutorisedCategory",
}

export interface CandidatePoll {
  category_id: number;
  candidate_id: number;
}

export interface Vote {
  id: number;
  created_at: string;
  created_by: string;
  category_id: number;
  candidate_id: number;
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

export interface Category {
  id: number;
  created_at: string;
  title: string;
  description?: string;
  poll_id: number;
}

export interface ECS {
  id: number;
  created_at: string;
  workspace_id: number;
  created_by: string;
  user?: string;
}

export interface SimpleItem {
  id: number;
  created_at: string;
  created_by: string;
  title: string;
  workspace_id: number;
}

export interface ItemPoll {
  poll_id: number;
  item_id: number;
}

export interface VotingCode {
  code: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  created_for: string; // userId
  poll_id: number;
}
