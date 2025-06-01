import { HStack, Switch, Td, Text, Tr } from "@chakra-ui/react";
import type { Poll } from "../../models/types";
import { NavLink } from "react-router";
import useTogglePollStatus from "../../hooks/mutations/polls/useTogglePollStatus";

interface Props {
  poll: Poll;
}

export default function PollItem({ poll }: Props) {
  const toggleStatusMutation = useTogglePollStatus(poll);

  return (
    <Tr>
      <Td fontWeight={"bold"}>
        <Text as={NavLink} to={""}>
          {poll.title}
        </Text>
      </Td>
      <Td>{new Date(poll.created_at).toLocaleDateString()}</Td>
      <Td>
        <HStack>
          <Switch
            isChecked={poll.is_active}
            onChange={() => toggleStatusMutation.mutateAsync()}
          />{" "}
          {poll.is_active ? (
            <Text size={"sm"} fontWeight={"bold"} color={"green.300"}>
              Active
            </Text>
          ) : (
            <Text size={"sm"} fontWeight={"bold"} color={"orange.500"}>
              Disabled
            </Text>
          )}
        </HStack>
      </Td>
    </Tr>
  );
}
