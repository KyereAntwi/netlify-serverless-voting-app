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
  Spinner,
  Alert,
  AlertIcon,
  TableContainer,
  Table,
  Tbody,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import useGetAllNominations from "../../hooks/queries/nominees/useGetAllNominations";
import type { Candidate } from "../../models/types";
import GeneralErrorPage from "../../components/GeneralErrorPage";
import CandidateItem from "./CandidateItem";
import CandidateForm from "./CandidateForm";

export default function Candidates() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data, isLoading, error } = useGetAllNominations(Number(workspaceId!));
  const { onClose, onOpen, isOpen } = useDisclosure();

  if (error) {
    return (
      <GeneralErrorPage
        message={`Error fetching nominees. Error = ${error.message}`}
      />
    );
  }

  return (
    <>
      <Flex flexDirection={"column"} w={"full"} h={"full"}>
        <Card mb={4} p={4} borderRadius="md">
          <CardBody>
            <VStack w={"full"} align="start">
              <Heading size={"lg"}>Nominations</Heading>
              <Text>Manage your nominees here.</Text>
              <HStack alignItems={"end"} w="full" justifyContent="end">
                <Button leftIcon={<AddIcon />} size={"sm"} onClick={onOpen}>
                  Register a nominee
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Divider />

        <NomineesList
          workspaceId={Number(workspaceId!)}
          nominees={data!}
          isLoading={isLoading}
        />
      </Flex>

      <CandidateForm
        isOpen={isOpen}
        onClose={onClose}
        workspaceId={Number(workspaceId)}
      />
    </>
  );
}

const NomineesList = ({
  nominees,
  isLoading,
}: {
  workspaceId: number;
  nominees: Candidate[];
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

  return nominees!.length === 0 ? (
    <Alert status="info" w="full" mt={4}>
      <AlertIcon />
      No nominations found. Please add a new nominee.
    </Alert>
  ) : (
    <TableContainer>
      <Table variant={"simple"}>
        <Tbody>
          {nominees.map((nominee) => (
            <CandidateItem key={nominee.id} nominee={nominee} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
