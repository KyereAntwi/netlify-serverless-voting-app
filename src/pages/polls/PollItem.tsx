import { Td, Text, Tr } from "@chakra-ui/react";
import type { Poll } from "../../models/types";
import { NavLink } from "react-router";
import TogglePollStatus from "../../components/TogglePollStatus";

interface Props {
  poll: Poll;
}

export default function PollItem({ poll }: Props) {
  return (
    <Tr>
      <Td fontWeight={"bold"}>
        <Text
          as={NavLink}
          to={`/workspaces/${poll.workspace_id}/polls/${poll.id}`}
        >
          {poll.title}
        </Text>
      </Td>
      <Td>{new Date(poll.created_at).toLocaleDateString()}</Td>
      <Td>
        <TogglePollStatus poll={poll} viewOnly={true} />
      </Td>
    </Tr>
  );
}
