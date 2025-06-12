import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { deleteEC } from "../../../services/ecs";

interface DeleteECProps {
  workspace_id: number;
}

export default function useDeleteEC({ workspace_id }: DeleteECProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ec_id: number) => {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this ec?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          return deleteEC(ec_id).then(() => {
            toast({
              title: `EC was deleted successfully`,
              status: "success",
              isClosable: true,
            });

            queryClient.invalidateQueries({ queryKey: ["ecs", workspace_id] });
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
