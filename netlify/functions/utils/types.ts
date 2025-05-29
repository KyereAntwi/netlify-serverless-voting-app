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
  id: number;
  title: string;
  created_at: string;
  userId: string;
  isActive: boolean;
  description?: string;
}
