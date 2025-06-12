import {useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateCategory} from "../../../services/categories.ts";
import type {Category} from "../../../models/types.ts";

interface Props {
    onSuccess: () => void;
    poll_id?: number;
}

const useUpdateCategory = ({onSuccess, poll_id}: Props) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (payload: Category) => {
            const response = await updateCategory(payload);
            return response;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories", poll_id]});

            toast({
                title: "Success!",
                description: "Category has been updated successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            
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
        }
    });
}

export default useUpdateCategory;