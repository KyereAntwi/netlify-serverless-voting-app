import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePollRequest } from "../../../models/types";
import { createPoll } from "../../../services/polls";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router";

interface Props {
  onSuccess: () => void;
  workspace_id: number;
}

export default function useCreatePoll({ onSuccess, workspace_id }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreatePollRequest) => {
      const response = await createPoll(data);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls", workspace_id] });

      toast({
        title: "Success!",
        description: "Poll has been created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      if (workspace_id) {
        navigate(`/workspaces/${workspace_id}/polls`);
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
