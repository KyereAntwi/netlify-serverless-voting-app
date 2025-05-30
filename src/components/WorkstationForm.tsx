import useCreateWorkspace from "../hooks/mutations/workstations/useCreateWorkspace";
import { set, z, ZodType } from "zod";
import type { CreateWorkspaceRequest, Workspace } from "../models/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  ModalFooter,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useEffect } from "react";

interface WorkstationFormProps {
  onClose: () => void;
  isOpen?: boolean;
  workspace?: Workspace;
}

const formSchema: ZodType<CreateWorkspaceRequest> = z.object({
  title: z.string().min(2, {
    message: "Workspace title should not be less than 2 characters",
  }),
  description: z.string().optional(),
});

export default function WorkstationForm({
  onClose,
  workspace,
  isOpen,
}: WorkstationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateWorkspaceRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: workspace?.title! ?? "",
      description: workspace?.description ?? "",
    },
  });

  const createWorkstationMutation = useCreateWorkspace({
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!workspace) {
      // Reset form values if no workspace is provided
      reset({
        title: "",
        description: "",
      });
    }
  }, [workspace]);

  const onSubmit: SubmitHandler<CreateWorkspaceRequest> = (data) => {
    if (workspace) {
      // update logic can be added here
    } else {
      createWorkstationMutation.mutateAsync(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen ?? false}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>
            {workspace ? `Update ${workspace?.title}` : "Create your workspace"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl my={2}>
              <FormLabel>Workspace Title</FormLabel>
              <Input
                {...register("title")}
                placeholder="Workspace title here ..."
              />
              {errors?.title && (
                <FormHelperText color={"red.500"}>
                  {errors.title.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl my={2}>
              <FormLabel>Workspace Description</FormLabel>
              <Textarea
                rows={3}
                {...register("description")}
                placeholder="Workspace description here ..."
              ></Textarea>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={createWorkstationMutation.isPending}
              isDisabled={!isValid}
            >
              Save
            </Button>
            <Button
              onClick={onClose}
              isDisabled={createWorkstationMutation.isPending}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
