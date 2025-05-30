import { z, type ZodType } from "zod";
import type { CreateECRequest, EC } from "../../models/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateEC from "../../hooks/mutations/ecs/useCreateEC";
import useUpdateECInfo from "../../hooks/mutations/ecs/useUpdateECInfo";
import { useEffect } from "react";
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
} from "@chakra-ui/react";

interface ECFormProps {
  onClose: () => void;
  isOpen?: boolean;
  ec?: EC;
  workspaceId: number;
}

const formSchema: ZodType<CreateECRequest> = z.object({
  user_name: z.string().min(2, {
    message: "Username should not be less than 2 characters",
  }),
  user_code: z.string().min(6, {
    message: "Passcode should not be less than 6 characters",
  }),
  workspace_id: z.number(),
});

export default function ECForm({
  ec,
  onClose,
  isOpen,
  workspaceId,
}: ECFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateECRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: ec?.user_name! ?? "",
      user_code: ec?.user_code ?? "",
      workspace_id: workspaceId,
    },
  });

  const createECMutation = useCreateEC({
    onSuccess: onClose,
    workspaceId: workspaceId,
  });

  const editECMutation = useUpdateECInfo({
    onSuccess: onClose,
    ecId: ec?.id!,
  });

  useEffect(() => {
    if (!ec) {
      reset({
        user_name: "",
        user_code: "",
      });
    }

    setValue("workspace_id", workspaceId);
  }, []);

  const onSubmit: SubmitHandler<CreateECRequest> = (data: CreateECRequest) => {
    if (ec) {
      editECMutation.mutateAsync({
        ...ec,
        user_name: data.user_name,
        user_code: data.user_code,
      });
    } else {
      createECMutation.mutateAsync({
        ...data,
        workspace_id: workspaceId,
      });
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
            {ec ? `Update ${ec?.user_name}` : "Create your EC"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl my={2}>
              <FormLabel>EC Username</FormLabel>
              <Input
                {...register("user_name")}
                placeholder="User name here ..."
              />
              {errors?.user_name && (
                <FormHelperText color={"red.500"}>
                  {errors.user_name.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl my={2}>
              <FormLabel>EC Passcode</FormLabel>
              <Input
                type="password"
                {...register("user_code")}
                placeholder="EC code here ..."
              />
              {errors?.user_code && (
                <FormHelperText color={"red.500"}>
                  {errors.user_code.message}
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={createECMutation.isPending || editECMutation.isPending}
              isDisabled={!isValid}
            >
              Save
            </Button>
            <Button
              onClick={onClose}
              isDisabled={
                createECMutation.isPending || editECMutation.isPending
              }
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
