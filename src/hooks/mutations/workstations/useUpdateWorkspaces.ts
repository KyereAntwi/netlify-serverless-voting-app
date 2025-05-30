import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Workspace } from "../../../models/types";
import { updateWorkspace } from "../../../services/workspaces";

interface Props {
  onSuccess: () => void;
  workspaceId: number;
}

export default function useUpdateWorkspaces({ onSuccess, workspaceId }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Workspace) => {
      const response = await updateWorkspace(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });

      toast({
        title: "Success!",
        description: "Workspace has been updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onSuccess();
    },

    onError: (error: Error) => {
      console.error("Error updating workspace:", error);

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
