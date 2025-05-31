import { useQuery } from "@tanstack/react-query";
import { getAllCandidate } from "../../../services/candidates";
import type { Candidate } from "../../../models/types";

export default function useGetAllNominations(workspaceId: number) {
  return useQuery({
    queryKey: ["nominees", workspaceId],
    queryFn: async () => {
      const response = await getAllCandidate(workspaceId);
      return response.data as Candidate[];
    },
  });
}
