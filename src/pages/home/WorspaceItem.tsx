import { Tr, Td, Avatar, Text } from "@chakra-ui/react";
import type { Workspace } from "../../models/types";
import { NavLink } from "react-router";

interface WorspaceItemProps {
  workpace: Workspace;
}

export default function WorspaceItem({ workpace }: WorspaceItemProps) {
  return (
    <Tr>
      <Td>
        <Avatar name={workpace.title} />
      </Td>
      <Td>
        <Text as={NavLink} to={"/"}>
          {workpace.title}
        </Text>
      </Td>
      <Td>
        {(workpace.description ?? "").slice(0, 50) +
          ((workpace.description ?? "").length > 50 ? "..." : "")}
      </Td>
      <Td>{new Date(workpace.created_at).toLocaleDateString()}</Td>
    </Tr>
  );
}
