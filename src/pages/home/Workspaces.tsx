import {
  Alert,
  AlertIcon,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import useGetWorkspaces from "../../hooks/queries/workstations/useGetWorkspaces";
import WorspaceItem from "./WorspaceItem";

const Home = () => {
  const { data, isLoading, error } = useGetWorkspaces();

  if (isLoading) {
    return (
      <Flex
        w={"full"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          size="xl"
          color="blue.500"
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        w={"full"}
        h={"full"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Alert status="error">
          <AlertIcon />
          An error occurred while fetching workspaces.
        </Alert>
      </Flex>
    );
  }

  return data && data.length > 0 ? (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Avatar</Th>
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

export default Home;
