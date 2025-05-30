import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Tr,
  Td,
  Avatar,
  ButtonGroup,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import type { EC } from "../../models/types";
import useDeleteEC from "../../hooks/mutations/ecs/useDeleteEC";
import ECForm from "./ECForm";

interface Props {
  ec: EC;
}

export default function ECItem({ ec }: Props) {
  const deleteMutation = useDeleteEC({ workspace_id: ec.workspace_id });
  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleDelete = async () => {
    deleteMutation.mutateAsync(ec.id);
  };

  return (
    <>
      <Tr key={ec.id}>
        <Td>
          <Avatar size={"sm"} name={ec.user_name} />
        </Td>
        <Td>{ec.user_name}</Td>
        <Td>
          <ButtonGroup variant={"outline"} size={"sm"} isAttached>
            <IconButton
              onClick={() => {
                onOpen();
              }}
              icon={<EditIcon />}
              aria-label="Edit Commissioner"
            />
            <IconButton
              colorScheme="red"
              onClick={() => {
                handleDelete();
              }}
              icon={<DeleteIcon />}
              aria-label="Delete Commissioner"
            />
          </ButtonGroup>
        </Td>
      </Tr>

      <ECForm
        ec={ec}
        isOpen={isOpen}
        onClose={onClose}
        workspaceId={ec.workspace_id}
      />
    </>
  );
}
