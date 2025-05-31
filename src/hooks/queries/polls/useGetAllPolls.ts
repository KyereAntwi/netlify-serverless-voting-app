import { useQuery } from "@tanstack/react-query";
import { getAllPolls } from "../../../services/polls";
import type { Poll } from "../../../models/types";

export default function useGetAllPolls(workspaceId: number) {
  return useQuery({
    queryKey: ["polls", workspaceId],
    queryFn: async () => {
      const response = await getAllPolls(workspaceId);
      return response as Poll[];
    },
  });
}
