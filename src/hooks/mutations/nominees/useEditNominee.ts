import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Candidate } from "../../../models/types";
import { upgradeCandidate } from "../../../services/candidates";
import { useToast } from "@chakra-ui/react";

interface Props {
  nomineeId: number;
  onSuccess: () => void;
}

export default function useEditNominee({ nomineeId, onSuccess }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Candidate) => {
      const response = await upgradeCandidate(payload);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominee", nomineeId] });

      toast({
        title: "Success!",
        description: "Candidate has been updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

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
