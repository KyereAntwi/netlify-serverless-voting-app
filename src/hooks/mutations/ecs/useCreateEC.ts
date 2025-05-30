import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateECRequest } from "../../../models/types";
import { createEC } from "../../../services/ecs";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router";

interface Props {
  onSuccess: () => void;
  workspaceId?: number;
}

export default function useCreateEC({ onSuccess, workspaceId }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateECRequest) => {
      const response = await createEC(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ecs"] });

      toast({
        title: "Success!",
        description: "EC has been created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      if (workspaceId) {
        navigate(`/workspaces/${workspaceId}/ecs`);
      }

      onSuccess();
    },

    onError: (error: Error) => {
      console.error("Error creating ec:", error);

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
