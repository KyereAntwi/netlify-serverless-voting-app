import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Divider,
  TableContainer,
  Alert,
  AlertIcon,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import type { Poll } from "../../models/types";
import useGetAllPolls from "../../hooks/queries/polls/useGetAllPolls";
import GeneralErrorPage from "../../components/GeneralErrorPage";
import PollItem from "./PollItem";
import PollForm from "./PollForm";

export default function Polls() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const { data, isLoading, error } = useGetAllPolls(Number(workspaceId!));

  if (error) {
    return (
      <GeneralErrorPage
        message={`Error loading polls. Error = ${error.message}`}
      />
    );
  }

  return (
    <>
      <Flex width={"full"} height={"full"} flexDirection={"column"}>
        <Card mb={4} p={4} borderRadius="md">
          <CardBody>
            <VStack w={"full"} align="start">
              <Heading size={"lg"}>Polls / Elections</Heading>
              <Text>Manage your Polls here.</Text>
              <HStack alignItems={"end"} w="full" justifyContent="end">
                <Button leftIcon={<AddIcon />} size={"sm"} onClick={onOpen}>
                  Add a Poll
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Divider />

        <PollList polls={data ?? []} isLoading={isLoading} />
      </Flex>

      <PollForm
        onClose={onClose}
        isOpen={isOpen}
        workspaceId={Number(workspaceId!)}
      />
    </>
  );
}

const PollList = ({
  polls,
  isLoading,
}: {
  polls: Poll[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Flex
        w={"full"}
        h={"full"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Flex>
    );
  }

  return polls.length === 0 ? (
    <Alert status="info" w="full" mt={4}>
      <AlertIcon />
      No polls found. Please add a new poll.
    </Alert>
  ) : (
    <TableContainer>
      <Table variant={"simple"}>
        <Thead>
          <Tr>
            <Th>Poll</Th>
            <Th>Created At</Th>
            <Th>State</Th>
          </Tr>
        </Thead>
        <Tbody>
          {polls.map((poll) => (
            <PollItem key={poll.id} poll={poll} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
