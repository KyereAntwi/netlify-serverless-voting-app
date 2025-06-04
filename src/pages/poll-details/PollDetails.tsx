import {
  AddIcon,
  ArrowBackIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  RepeatIcon,
  SettingsIcon,
  StarIcon,
} from "@chakra-ui/icons";
import {
  HStack,
  Button,
  Avatar,
  Box,
  VStack,
  Heading,
  Spacer,
  Text,
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { NavLink } from "react-router";
import { type Poll } from "../../models/types";
import TogglePollStatus from "../../components/TogglePollStatus";
import PollForm from "../polls/PollForm";

interface Props {
  poll: Poll;
}

export default function PollDetails({ poll }: Props) {
  const { type, title, description, workspace_id } = poll;
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <HStack my={4} alignItems={"center"} justifyContent={"start"}>
        <Button
          as={NavLink}
          to={`/workspaces/${workspace_id}/polls`}
          leftIcon={<ArrowBackIcon />}
          variant={"ghost"}
        >
          Go back to Polls list
        </Button>
      </HStack>
      <HStack my={4}>
        <Avatar size={"lg"} name={poll?.title} />
        <Box>
          <VStack alignItems={"start"} justifyContent={"center"}>
            <Heading fontSize={"1.2rem"}>{title}</Heading>
            <Text fontSize={"sm"}>{description}</Text>
          </VStack>
        </Box>

        <Spacer />

        <Box>
          <VStack alignItems={"end"} justifyContent={"center"}>
            <TogglePollStatus poll={poll} viewOnly={false} />

            <ButtonGroup>
              <IconButton
                aria-label="Edit poll"
                icon={<EditIcon />}
                onClick={onOpen}
              />

              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem
                    isDisabled={type.includes("Basic")}
                    icon={<SettingsIcon />}
                  >
                    Add Category
                  </MenuItem>
                  <MenuItem
                    icon={<AddIcon />}
                    isDisabled={!type.includes("Basic")}
                  >
                    Add a Basic Item
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    icon={<StarIcon />}
                    isDisabled={!type.includes("Secured")}
                  >
                    Generate Voters Code
                  </MenuItem>
                  <MenuItem icon={<ExternalLinkIcon />}>
                    Open Live Preview
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<RepeatIcon />}>Clone Poll</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<DeleteIcon />} color={"red"}>
                    Completely delete poll
                  </MenuItem>
                </MenuList>
              </Menu>
            </ButtonGroup>
          </VStack>
        </Box>
      </HStack>

      <PollForm
        poll={poll}
        isOpen={isOpen}
        onClose={onClose}
        workspaceId={workspace_id}
      />
    </>
  );
}
