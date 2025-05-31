import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCandidateRequest } from "../../../models/types";
import { createCandidate } from "../../../services/candidates";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router";

interface Props {
  onSuccess: () => void;
  workspaceId: number;
}

export default function useCreateNominee({ onSuccess, workspaceId }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateCandidateRequest) => {
      const response = await createCandidate(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominees", workspaceId] });

      toast({
        title: "Success!",
        description: "Nominee has been created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      if (workspaceId) {
        navigate(`/workspaces/${workspaceId}/nominees`);
      }

      onSuccess();
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
