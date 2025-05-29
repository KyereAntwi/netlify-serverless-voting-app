import { useMutation } from "@tanstack/react-query";
import type { CreateWorkspaceRequest } from "../../../models/types";
import { createWorkspace } from "../../../services/workspaces";

/**
 * Custom hook to create a workspace using React Query's useMutation.
 *
 * @returns {object} The mutation object containing the mutate function and other properties.
 */

interface Props {
  onSuccess?: () => void;
}

export default function useCreateWorkspace({ onSuccess }: Props) {
  return useMutation({
    mutationFn: async (payload: CreateWorkspaceRequest) => {
      const response = await createWorkspace(payload);
      return response;
    },

    onSuccess: () => onSuccess!(),
  });
}
