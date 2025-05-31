import { z, type ZodType } from "zod";
import type { Candidate, CreateCandidateRequest } from "../../models/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import useCreateNominee from "../../hooks/mutations/nominees/useCreateNominee";
import useEditNominee from "../../hooks/mutations/nominees/useEditNominee";

interface Props {
  onClose: () => void;
  isOpen?: boolean;
  nominee?: Candidate;
  workspaceId: number;
}

const formSchema: ZodType<CreateCandidateRequest> = z.object({
  first_name: z.string().min(2, {
    message: "First name should not be less than 2 characters",
  }),
  last_name: z.string().min(2, {
    message: "Last name should not be less than 2 characters",
  }),
  other_names: z.string().optional(),
  workspace_id: z.number(),
});

export default function CandidateForm({
  onClose,
  isOpen,
  nominee,
  workspaceId,
}: Props) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateCandidateRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: nominee?.first_name! ?? "",
      last_name: nominee?.last_name ?? "",
      other_names: nominee?.other_names,
      workspace_id: workspaceId,
    },
  });

  const createMutation = useCreateNominee({
    onSuccess: onClose,
    workspaceId: workspaceId,
  });

  const updateMutation = useEditNominee({
    nomineeId: nominee?.id!,
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!nominee) {
      reset({
        first_name: "",
        last_name: "",
        other_names: "",
      });
    }

    setValue("workspace_id", workspaceId);
  }, []);

  const onSubmit: SubmitHandler<CreateCandidateRequest> = (
    data: CreateCandidateRequest
  ) => {
    if (nominee) {
      updateMutation.mutateAsync({
        ...nominee,
        first_name: data.first_name,
        last_name: data.last_name,
        other_names: data.other_names,
      });
    } else {
      createMutation.mutateAsync(data);
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
            {nominee ? `Update ${nominee?.first_name}` : "Create your Nominee"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl my={2}>
              <FormLabel>First name</FormLabel>
              <Input
                {...register("first_name")}
                placeholder="First name here ..."
              />
              {errors?.first_name && (
                <FormHelperText color={"red.500"}>
                  {errors.first_name.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl my={2}>
              <FormLabel>Last name</FormLabel>
              <Input
                {...register("last_name")}
                placeholder="Last name here ..."
              />
              {errors?.last_name && (
                <FormHelperText color={"red.500"}>
                  {errors.last_name.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl my={2}>
              <FormLabel>Other names</FormLabel>
              <Input
                {...register("other_names")}
                placeholder="Other names here ..."
              />
              {errors?.other_names && (
                <FormHelperText color={"red.500"}>
                  {errors.other_names.message}
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
              isDisabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
