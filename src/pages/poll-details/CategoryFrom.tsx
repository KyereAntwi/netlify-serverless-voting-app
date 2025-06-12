import type {Category, CreateCategoryRequest} from "../../models/types.ts";
import {z, type ZodType} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {
    Button,
    FormControl, FormHelperText,
    FormLabel, Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import useCreateCategory from "../../hooks/mutations/categories/useCreateCategory.ts";
import useUpdateCategory from "../../hooks/mutations/categories/useUpdateCategory.ts";

interface Props {
    category?: Category;
    isOpen: boolean;
    onClose?: () => void;
    pollId: number;
    workspaceId: number;
}

const formSchema: ZodType<CreateCategoryRequest> = z
    .object({
        title: z.string().min(2, {
            message: "Title should not be less than 2 characters",
        }),
        poll_id: z.number()
    })

const CategoryForm = ({
    category,
    isOpen,
    onClose,
    pollId,
    workspaceId
}: Props) => {
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<CreateCategoryRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: category?.title,
            poll_id: category?.poll_id
        }
    })
    
    const createMutation = useCreateCategory({
        onSuccess: onClose!,
        pollId: pollId,
        workspaceId: workspaceId
    });
    
    const updateMutation = useUpdateCategory({
        onSuccess: onClose!,
        poll_id: category ? pollId : 0,
    })
    
    useEffect(() => {
        if (!category) {
            reset({
                title: ""
            })
        } else {
            setValue("title", category.title)
        }
        
        setValue("poll_id", pollId)
    }, [category, isOpen, setValue, pollId])
    
    const onSubmit: SubmitHandler<CreateCategoryRequest> = (data) => {
        if (category) {
            updateMutation.mutateAsync({
                title: data.title,
                created_at: category.created_at,
                id: category.id,
                poll_id: pollId
            })
        } else {
            createMutation.mutateAsync(data);
        }
    }
    
    return(
        <Modal
            isOpen={isOpen ?? false}
            onClose={onClose!}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>
                        {category ? `Update ${category?.title}` : "Add category"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl my={2}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                {...register("title")}
                                placeholder="Title here ..."
                            />
                            {errors?.title && (
                                <FormHelperText color={"red.500"}>
                                    {errors.title.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            isDisabled={!isValid}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={onClose}
                            isDisabled={
                                createMutation.isPending || updateMutation.isPending
                            }
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default CategoryForm;