import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  HStack,
  Button,
  Card,
  CardBody,
  useDisclosure,
} from "@chakra-ui/react";
import useGetWorkspaces from "../../hooks/queries/workstations/useGetWorkspaces";
import WorspaceItem from "./WorspaceItem";
import LoadingPage from "../../components/LoadingPage";
import GeneralErrorPage from "../../components/GeneralErrorPage";
import type { Workspace } from "../../models/types";
import { AddIcon } from "@chakra-ui/icons";
import WorkstationForm from "../../components/WorkstationForm";

const WorkspaceList = ({ data }: { data: Workspace[] }) => {
  return data && data.length > 0 ? (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((workspace) => (
            <WorspaceItem key={workspace.id} workpace={workspace} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Alert status="info" w="full" mt={4}>
      <AlertIcon />
      No workspaces found. Please create a new workspace.
    </Alert>
  );
};

const Home = () => {
  const { data, isLoading, error } = useGetWorkspaces();
  const { onClose, onOpen, isOpen } = useDisclosure();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <GeneralErrorPage message="An error occurred while fetching workspaces." />
    );
  }

  return (
    <>
      <Flex w={"full"} h={"full"} p={4} direction="column">
        <Card mb={4} p={4} borderRadius="md">
          <CardBody>
            <VStack w={"full"} align="start">
              <Heading size={"lg"}>Your Workstations</Heading>
              <Text>
                Manage your workstations here. You can create, edit, or delete
                workstations as needed.
              </Text>
              <Text>
                Click on a workstation title to view its details or to make
                changes.
              </Text>
              <HStack alignItems={"end"} w="full" justifyContent="end">
                <Button leftIcon={<AddIcon />} size={"sm"} onClick={onOpen}>
                  Add a Workstation
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Divider mb={4} />

        <WorkspaceList data={data || []} />
      </Flex>

      <WorkstationForm onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default Home;
