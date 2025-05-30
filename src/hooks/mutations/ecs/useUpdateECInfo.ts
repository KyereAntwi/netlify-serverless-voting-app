import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EC } from "../../../models/types";
import { updateEC } from "../../../services/ecs";

interface Props {
  onSuccess: () => void;
  ecId: number;
}

export default function useUpdateECInfo({ onSuccess, ecId }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EC) => {
      const response = await updateEC(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ec", ecId] });

      toast({
        title: "Success!",
        description: "EC has been updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onSuccess();
    },

    onError: (error: Error) => {
      console.error("Error updating EC:", error);

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
