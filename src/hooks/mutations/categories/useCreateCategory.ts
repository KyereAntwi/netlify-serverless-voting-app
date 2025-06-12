import {useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import type {CreateCategoryRequest} from "../../../models/types.ts";
import {createCategory} from "../../../services/categories.ts";

interface Props {
    onSuccess: () => void;
    pollId?: number;
    workspaceId?: number;
}

const useCreateCategory = ({onSuccess, pollId, workspaceId}: Props) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: async (payload: CreateCategoryRequest) => {
            const response = await createCategory(payload);
            return response.data;
        },
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories", pollId]});

            toast({
                title: "Success!",
                description: "Category has been created successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            
            if (pollId) {
                navigate(`/workspaces/${workspaceId}/polls/${pollId}/categories`)
            }
            
            onSuccess();
        },

        onError: (error: Error) => {
            console.error("Error creating category:", error);

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

export default useCreateCategory;