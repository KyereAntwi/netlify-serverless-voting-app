import {useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Swal from "sweetalert2";
import {deletePoll} from "../../../services/polls.ts";

const useDeletePoll = (workspaceId: number) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (pollId: number) => {
            Swal.fire({
                icon: "warning",
                title: "This operation will completely delete the Poll with its related data. Are you sure you want to continue?",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `Cancel`,
            }).then((result) => {
                if (result.isConfirmed) {
                    return deletePoll(pollId).then(() => {
                        toast({
                            title: `Poll was deleted successfully`,
                            status: "success",
                            isClosable: true,
                        })

                        queryClient.invalidateQueries({ queryKey: ["polls", workspaceId]})
                    })
                } else if (result.isDenied) {
                    return;
                }
            })
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
    })
}

export default useDeletePoll;