import { HStack, Switch, Text } from "@chakra-ui/react";
import useTogglePollStatus from "../hooks/mutations/polls/useTogglePollStatus";
import type { Poll } from "../models/types";

interface Prop {
  poll: Poll;
  viewOnly: boolean;
}

export default function TogglePollStatus({ poll, viewOnly }: Prop) {
  const toggleStatusMutation = useTogglePollStatus(poll);

  return (
    <HStack>
      <Switch
        readOnly={viewOnly}
        isChecked={poll.is_active}
        onChange={() => toggleStatusMutation.mutateAsync()}
        disabled={viewOnly}
        title="Change poll active status"
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
  );
}
