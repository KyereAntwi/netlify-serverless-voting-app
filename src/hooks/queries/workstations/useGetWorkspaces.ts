import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../../../services/workspaces";
import type { Workspace } from "../../../models/types";

export default function useGetWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await getWorkspaces();
      return response as Workspace[];
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
