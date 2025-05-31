import {
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import type { Candidate } from "../../models/types";
import { DeleteIcon, EditIcon, HamburgerIcon, SunIcon } from "@chakra-ui/icons";
import { useState } from "react";
import CandidateForm from "./CandidateForm";
import useDeleteNominee from "../../hooks/mutations/nominees/useDeleteNominee";

interface Props {
  nominee: Candidate;
}

export default function CandidateItem({ nominee }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const deleteMutation = useDeleteNominee(nominee.workspace_id);

  return (
    <>
      <Tr
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Td>
          <Avatar
            name={`${nominee.first_name} ${nominee.last_name}`}
            src={nominee.profile_image}
            size={"sm"}
          />
        </Td>
        <Td>
          {nominee.first_name} {nominee.other_names} {nominee.last_name}
        </Td>
        <Td>{new Date(nominee.created_at).toLocaleDateString()}</Td>
        <Td>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              display={hovered ? "block" : "none"}
            />
            <MenuList>
              <MenuItem icon={<SunIcon />}>Upload Profile picture</MenuItem>
              <MenuDivider />
              <MenuItem icon={<EditIcon />} onClick={onOpen}>
                Edit
              </MenuItem>
              <MenuItem
                icon={<DeleteIcon />}
                onClick={() => deleteMutation.mutate(nominee.id)}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Td>
      </Tr>

      <CandidateForm
        isOpen={isOpen}
        onClose={onClose}
        workspaceId={nominee.workspace_id}
        nominee={nominee!}
      />
    </>
  );
}
