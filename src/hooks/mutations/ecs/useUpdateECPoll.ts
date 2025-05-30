import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ECPoll } from "../../../models/types";
import { updateECSPoll } from "../../../services/ecs";
import { useToast } from "@chakra-ui/react";

interface Props {
  ecId: number;
}

export default function useUpdateECPoll({ ecId }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ECPoll) => {
      const response = await updateECSPoll(payload.ec_id, payload.poll_id);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ec_polls", ecId] });

      toast({
        title: "Success!",
        description: "Operation completed successfully.",
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
