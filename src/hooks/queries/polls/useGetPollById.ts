import { useQuery } from "@tanstack/react-query";
import { number } from "framer-motion";
import { getPollById } from "../../../services/polls";
import type { Poll } from "../../../models/types";

export default function useGetPollById(pollId: number) {
  return useQuery({
    queryKey: ["poll", number],
    queryFn: async () => {
      const response = await getPollById(pollId);
      return response as Poll;
    },
  });
}
