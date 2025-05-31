import { IconButton, Td, Text, Tr } from "@chakra-ui/react";
import type { Poll } from "../../models/types";
import { NavLink } from "react-router";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface Props {
  poll: Poll;
}

export default function PollItem({ poll }: Props) {
  return (
    <Tr>
      <Td fontWeight={"bold"}>
        <Text as={NavLink} to={""}>
          {poll.title}
        </Text>
      </Td>
      <Td>{new Date(poll.created_at).toLocaleDateString()}</Td>
      <Td>
        {poll.is_active ? (
          <IconButton
            aria-label="active state"
            icon={<CheckIcon />}
            colorScheme="green"
          />
        ) : (
          <IconButton
            aria-label="notactive state"
            icon={<CloseIcon />}
            colorScheme="red"
          />
        )}
      </Td>
    </Tr>
  );
}
