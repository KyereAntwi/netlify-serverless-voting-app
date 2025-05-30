import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  HStack,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { NavLink, Outlet, useParams } from "react-router";
import useGetWorkspace from "../../hooks/queries/workstations/useGetWorkspace";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import useDeleteWorkspace from "../../hooks/mutations/workstations/useDeleteWorkspace";
import WorkstationForm from "../../components/WorkstationForm";
import ECForm from "../ecs/ECForm";

export default function Layout() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: worksapce, isLoading } = useGetWorkspace(Number(workspaceId));

  const deleteMutation = useDeleteWorkspace();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const {
    isOpen: isECFormOpen,
    onClose: onECFormClose,
    onOpen: onECFormOpen,
  } = useDisclosure();

  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        <GridItem
          colSpan={{
            base: 0,
            md: 2,
          }}
          display={{
            base: "none",
            md: "block",
          }}
          position="sticky"
          px={4}
        >
          {isLoading && <LoadingState />}

          {worksapce! && (
            <>
              <Card>
                <CardBody>
                  <HStack>
                    <Avatar name={worksapce.title} size={"md"} />

                    <Box>
                      <Breadcrumb>
                        <BreadcrumbItem>
                          <BreadcrumbLink href={`/workspaces`}>
                            Workspaces
                          </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem isCurrentPage>
                          <BreadcrumbLink
                            fontWeight={"bold"}
                            href={`/workspaces/${worksapce.id}`}
                          >
                            {worksapce.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </Breadcrumb>

                      <Text color={"gray.500"} fontWeight={"light"}>
                        {worksapce.description}
                      </Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
              <Divider my={4} />
              <Card>
                <CardBody>
                  <VStack justifyItems={"start"} alignItems="start">
                    <List spacing={3}>
                      <ListItem
                        cursor={"pointer"}
                        as={NavLink}
                        to={"dashboard"}
                      >
                        <ListIcon as={HamburgerIcon} color="green.500" />
                        Workspace Dashboard
                      </ListItem>
                    </List>

                    <Divider />

                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={AddIcon} color="green.500" />
                        Add Nominee
                      </ListItem>
                      <ListItem>
                        <ListIcon as={ViewIcon} color="green.500" />
                        Nominees List
                      </ListItem>
                    </List>

                    <Divider />

                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={AddIcon} color="green.500" />
                        Add Poll
                      </ListItem>
                      <ListItem>
                        <ListIcon as={ListIcon} color="green.500" />
                        Polls List
                      </ListItem>
                    </List>

                    <Divider />

                    <List spacing={3}>
                      <ListItem cursor={"pointer"} onClick={onECFormOpen}>
                        <ListIcon as={AddIcon} color="green.500" />
                        Add EC Member
                      </ListItem>
                      <ListItem cursor={"pointer"} as={NavLink} to={"ecs"}>
                        <ListIcon as={ListIcon} color="green.500" />
                        EC Membership List
                      </ListItem>
                    </List>

                    <Divider />

                    <List spacing={3}>
                      <ListItem onClick={onOpen} cursor="pointer">
                        <ListIcon as={EditIcon} color="green.500" />
                        Edit Workspace
                      </ListItem>
                      <ListItem
                        onClick={() => deleteMutation.mutate(worksapce.id)}
                        cursor="pointer"
                        _hover={{ color: "red.500" }}
                      >
                        <ListIcon as={DeleteIcon} color="red.500" />
                        Delete Workspace
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 5, md: 3 }}>
          <Outlet />
        </GridItem>
      </Grid>

      {worksapce && (
        <>
          <WorkstationForm
            workspace={worksapce!}
            onClose={onClose}
            isOpen={isOpen}
          />

          <ECForm
            onClose={onECFormClose}
            isOpen={isECFormOpen}
            workspaceId={Number(workspaceId)}
          />
        </>
      )}
    </>
  );
}

const LoadingState = () => {
  return (
    <Stack padding={4} spacing={1}>
      <Skeleton height="40px">
        <Box>Hello World!</Box>
      </Skeleton>
      <Skeleton height="40px" bg="green.500" color="white" fadeDuration={1}>
        <Box>Hello React!</Box>
      </Skeleton>
      <Skeleton height="40px" fadeDuration={4} bg="blue.500" color="white">
        <Box>Hello ChakraUI!</Box>
      </Skeleton>
    </Stack>
  );
};
