import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { deleteCandidate } from "../../../services/candidates";

export default function useDeleteNominee(workspace_id: number) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nomineeId: number) => {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this nominee?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries({
            queryKey: ["nominees", workspace_id],
          });

          return deleteCandidate(nomineeId).then(() => {
            toast({
              title: `Nominee was deleted successfully`,
              status: "success",
              isClosable: true,
            });
          });
        } else if (result.isDenied) {
          return;
        }
      });
    },

    onError: (error: Error) => {
      console.error("Error deleting ec:", error);

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
