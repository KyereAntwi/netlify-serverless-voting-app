import {useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Swal from "sweetalert2";
import {deleteCategory} from "../../../services/categories.ts";

const useDeleteCategory = (pollId: number) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (categoryId: number) => {
            Swal.fire({
                icon: "warning",
                title: "Are you sure you want to delete this category?",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `Cancel`,
            }).then((result) => {
                if (result.isConfirmed) {
                    return deleteCategory(categoryId)
                        .then(() => {
                            toast({
                                title: `Category was deleted successfully`,
                                status: "success",
                                isClosable: true,
                            })
                            
                            queryClient.invalidateQueries({ queryKey: ["categories", pollId]})
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
    })
}

export default useDeleteCategory;