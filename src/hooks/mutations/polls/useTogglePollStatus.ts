import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useUpdatePoll from "./useUpdatePoll";
import type { Poll } from "../../../models/types";

export default function useTogglePollStatus(poll: Poll) {
  const toast = useToast();

  const mutation = useUpdatePoll({
    id: poll.id,
    workspaceId: poll.workspace_id,
  });

  return useMutation({
    mutationFn: async () => {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to change this poll's status?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          mutation.mutateAsync({
            ...poll,
            is_active: !poll.is_active,
          });
        } else if (result.isDenied) {
          return;
        }
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
