import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspaceRequest } from "../../../models/types";
import { createWorkspace } from "../../../services/workspaces";
import { useToast } from "@chakra-ui/react";

/**
 * Custom hook to create a workspace using React Query's useMutation.
 *
 * @returns {object} The mutation object containing the mutate function and other properties.
 */

interface Props {
  onSuccess: () => void;
}

export default function useCreateWorkspace({ onSuccess }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWorkspaceRequest) => {
      const response = await createWorkspace(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast({
        title: "Success!",
        description: "Workstation has been created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onSuccess();
    },

    onError: (error: Error) => {
      console.error("Error creating workspace:", error);

      toast({
        title: "Error!",
        description: "Operation failed. Error = " + error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });
}
