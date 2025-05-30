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
  Alert,
  AlertIcon,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Spinner,
} from "@chakra-ui/react";
import useGetAllECS from "../../hooks/queries/ecs/useGetAllECS";
import { useParams } from "react-router";
import ECForm from "./ECForm";
import ECItem from "./ECItem";

export default function AllECS() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <>
      <Flex flexDir={"column"} w="full" h="full">
        <Card mb={4} p={4} borderRadius="md">
          <CardBody>
            <VStack w={"full"} align="start">
              <Heading size={"lg"}>Electoral Commisionners</Heading>
              <Text>Manage your electoral commissioners here.</Text>
              <HStack alignItems={"end"} w="full" justifyContent="end">
                <Button leftIcon={<AddIcon />} size={"sm"} onClick={onOpen}>
                  Add a Commissioner
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Divider mb={4} />

        <ECList workspaceId={Number(workspaceId)} />
      </Flex>

      <ECForm
        onClose={onClose}
        isOpen={isOpen}
        workspaceId={Number(workspaceId)}
      />
    </>
  );
}

const ECList = ({ workspaceId }: { workspaceId: number }) => {
  const { data, isLoading, error } = useGetAllECS(workspaceId);

  if (isLoading) {
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          size="xl"
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" w="full" mt={4}>
        <AlertIcon />
        An error occurred while fetching electoral commissioners.
      </Alert>
    );
  }

  return (
    <Flex w="full" h="full" direction="column">
      {data!.length > 0 ? (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Commissioner Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data!.map((ec) => (
                <ECItem ec={ec} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Alert status="info" w="full" mt={4}>
          <AlertIcon />
          No electoral commissioners found. Please add a new commissioner.
        </Alert>
      )}
    </Flex>
  );
};
