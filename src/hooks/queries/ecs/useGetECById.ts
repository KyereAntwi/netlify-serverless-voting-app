import { useQuery } from "@tanstack/react-query";
import { getECById } from "../../../services/ecs";
import type { EC } from "../../../models/types";

export default function useGetECById(ecId: number) {
  return useQuery({
    queryKey: ["ec", ecId],
    queryFn: async () => {
      const response = await getECById(ecId);
      return response as EC;
    },
  });
}
