import { useQuery } from "@tanstack/react-query";
import { getPollById } from "../../../services/polls";
import type { Poll } from "../../../models/types";

export default function useGetPollById(pollId: number) {
  return useQuery({
    queryKey: ["poll", pollId],
    queryFn: async () => {
      const response = await getPollById(pollId);
      return response as Poll;
    },
  });
}
