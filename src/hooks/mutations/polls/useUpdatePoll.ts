import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Poll } from "../../../models/types";
import { useToast } from "@chakra-ui/react";
import { updatePoll } from "../../../services/polls";

interface Prop {
  id: number;
  workspaceId?: number;
}

export default function useUpdatePoll({ id, workspaceId }: Prop) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Poll) => {
      const response = await updatePoll(payload);
      return response;
    },

    onSuccess: () => {
      if (id && id > 0) {
        queryClient.invalidateQueries({ queryKey: ["poll", id] });
      }

      if (workspaceId && workspaceId > 0) {
        queryClient.invalidateQueries({ queryKey: ["polls", workspaceId] });
      }

      toast({
        title: "Success!",
        description: "Poll has been updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },

    onError: (error: Error) => {
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
