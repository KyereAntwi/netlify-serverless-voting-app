import { useQuery } from "@tanstack/react-query";
import type {Category} from "../../../models/types.ts";
import {getCategories} from "../../../services/categories.ts";

const useGetPollCategories = (pollId: number) => {
    return useQuery<Category[], Error>({
        queryKey: ["categories", pollId],
        queryFn: async () => {
            const response = await getCategories(pollId);
            return response as Category[]
        }
    })
}

export default useGetPollCategories;