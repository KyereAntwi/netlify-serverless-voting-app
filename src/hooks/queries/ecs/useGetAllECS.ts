import { useQuery } from "@tanstack/react-query";
import { getECS } from "../../../services/ecs";
import type { EC } from "../../../models/types";

export default function useGetAllECS(workspaceId: number) {
  return useQuery({
    queryKey: ["ecs", workspaceId],
    queryFn: async () => {
      const response = await getECS(workspaceId);
      return response as EC[];
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
