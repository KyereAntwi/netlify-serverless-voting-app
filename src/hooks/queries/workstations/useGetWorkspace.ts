import { useQuery } from "@tanstack/react-query";
import { getWorkspaceById } from "../../../services/workspaces";
import type { Workspace } from "../../../models/types";

export default function useGetWorkspace(workspaceId: number) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await getWorkspaceById(workspaceId);
      return response as Workspace;
    },
  });
}
