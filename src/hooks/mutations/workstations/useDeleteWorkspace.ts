import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { deleteWorkspace } from "../../../services/workspaces";
import { useNavigate } from "react-router";

export default function useDeleteWorkspace() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  return useMutation({
    mutationFn: async (workspaceId: number) => {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this workspace?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries({ queryKey: ["workspaces"] });

          return deleteWorkspace(workspaceId).then(() => {
            toast({
              title: `Workspace was deleted successfully`,
              status: "success",
              isClosable: true,
            });

            navigation("/");
          });
        } else if (result.isDenied) {
          return;
        }
      });
    },

    onError: (error: Error) => {
      console.error("Error deleting workspace:", error);

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
