import { z, type ZodType } from "zod";
import {
  pollTypeValues,
  type CreatePollRequest,
  type Poll,
  type PollType,
} from "../../models/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Textarea,
  Switch,
  Divider,
  Wrap,
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import useCreatePoll from "../../hooks/mutations/polls/useCreatePoll";

interface Props {
  onClose: () => void;
  isOpen?: boolean;
  poll?: Poll;
  workspaceId: number;
}

const formSchema: ZodType<CreatePollRequest> = z
  .object({
    title: z.string().min(2, {
      message: "Title should not be less than 2 characters",
    }),
    description: z.string().optional(),
    start_date: z.string().date(),
    end_date: z.string().date(),
    is_active: z.boolean(),
    workspace_id: z.number(),
    type: z.enum(pollTypeValues, {
      message: "Type should be a valid Poll Type",
    }),
  })
  .refine(
    (data) => {
      const now = new Date();
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return start > now && end > now;
    },
    {
      message: "Start date and end date must be in the future.",
      path: ["start_date", "end_date"],
    }
  );

interface typeWithDescription {
  type: PollType;
  title: string;
  description: string;
}

const typesForForm: typeWithDescription[] = [
  {
    type: "OpenBasic",
    title: "Open Basic Poll Type",
    description:
      "Has some items and voters can vote on them. Only one choice can be made. No token authorisation required.",
  },
  {
    type: "SecuredBasic",
    title: "Secured Basic Poll Type",
    description:
      "Has some items and voters can vote on them. Only one choice can be made. Token authorisation required.",
  },
  {
    type: "OpenCategoryForCandidates",
    title: "Open Category For Candidates Poll Type",
    description:
      "Has various categories or topics. Under each category or topic, there are candidate to be made and only one choice can be made under each category or topic. With this one no token authorisation needed for voters to make choices.",
  },
  {
    type: "OpenCategoryForItems",
    title: "Open Category For Items Poll Type",
    description:
      "Has various categories or topics. Under each category or topic, there are items to be made and only one choice can be made under each category or topic. With this one no token authorisation needed for voters to make choices.",
  },
  {
    type: "SecuredCategoryForCandidates",
    title: "Secured Category For Candidates Poll Type",
    description:
      "Has various categories or topics. Under each category or topic, there are candidates to be made and only one choice can be made under each category or topic. With this one a token authorisation is required to cast a vote.",
  },
  {
    type: "SecuredCategoryForItems",
    title: "Secured Category For Items Poll Type",
    description:
      "Has various categories or topics. Under each category or topic, there are items to be made and only one choice can be made under each category or topic. With this one a token authorisation is required to cast a vote.",
  },
];

export default function PollForm({
  onClose,
  isOpen,
  poll,
  workspaceId,
}: Props) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePollRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: poll?.title! ?? "",
      description: poll?.description ?? "",
      start_date: poll?.start_date,
      end_date: poll?.end_date,
      type: poll?.type,
      is_active: poll?.is_active,
      workspace_id: workspaceId,
    },
  });

  const selectedType = watch("type");

  const createMutation = useCreatePoll({
    onSuccess: onClose,
    workspace_id: workspaceId,
  });

  useEffect(() => {
    if (!poll) {
      reset({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        type: "OpenBasic",
        is_active: true,
      });
    }

    setValue("workspace_id", workspaceId);
  }, [poll, setValue, isOpen]);

  const onSubmit: SubmitHandler<CreatePollRequest> = (
    data: CreatePollRequest
  ) => {
    if (poll) {
    } else {
      createMutation.mutateAsync(data);
    }
  };

  const handleTypeSwith = (type: PollType) => {
    setValue("type", type);
  };

  return (
    <Drawer
      isOpen={isOpen ?? false}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={"lg"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {poll ? `Update ${poll?.title}` : "Create Poll"}
        </DrawerHeader>

        <DrawerBody>
          <Flex flexDir={"column"} overflowX={"hidden"} overflowY={"auto"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl my={2}>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register("title")}
                  placeholder="First name here ..."
                />
                {errors?.title && (
                  <FormHelperText color={"red.500"}>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl my={2}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Description here ..."
                />
                {errors?.description && (
                  <FormHelperText color={"red.500"}>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl my={2}>
                <FormLabel>Start Date</FormLabel>
                <Input type="date" {...register("start_date")} />
                {errors?.start_date && (
                  <FormHelperText color={"red.500"}>
                    {errors.start_date.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl my={2}>
                <FormLabel>End Date</FormLabel>
                <Input type="date" {...register("end_date")} />
                {errors?.end_date && (
                  <FormHelperText color={"red.500"}>
                    {errors.end_date.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl my={2} display="flex" alignItems="center">
                <FormLabel htmlFor="is_active" mb="0">
                  Is Active
                </FormLabel>
                <Switch
                  id="is_active"
                  colorScheme="teal"
                  {...register("is_active")}
                />
                {errors?.is_active && (
                  <FormHelperText color={"red.500"}>
                    {errors.is_active.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Divider />

              <Text my={4}>Select the Poll Type</Text>

              <Wrap gap={2}>
                {typesForForm.map((item) => (
                  <Card
                    key={item.type}
                    onClick={() => handleTypeSwith(item.type)}
                    borderColor={
                      selectedType === item.type ? "teal.400" : "gray.200"
                    }
                    borderWidth={selectedType === item.type ? 2 : 1}
                    cursor="pointer"
                    minW="250px"
                    maxW="300px"
                    transition="border-color 0.2s"
                  >
                    <CardHeader>
                      <Switch
                        colorScheme="teal"
                        isChecked={selectedType === item.type}
                        readOnly
                        pointerEvents="none"
                      />
                    </CardHeader>
                    <CardBody>
                      <Text fontWeight={"bold"} size={"md"}>
                        {item.title}
                      </Text>
                      <Divider />
                      <Text>{item.description}</Text>
                    </CardBody>
                  </Card>
                ))}
              </Wrap>

              {errors?.type && (
                <FormHelperText color="red.500">
                  {errors.type.message}
                </FormHelperText>
              )}

              <Divider />

              <FormControl my={2}>
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading={createMutation.isPending}
                  isDisabled={!isValid}
                >
                  Save
                </Button>
                <Button onClick={onClose} isDisabled={createMutation.isPending}>
                  Cancel
                </Button>
              </FormControl>
            </form>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
