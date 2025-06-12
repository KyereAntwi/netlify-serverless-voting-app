import apiClient from "./ApiClient.ts";
import type {Category, CreateCategoryRequest} from "../models/types.ts";

export const getCategories = async (poll_id: number) => {
    //console.log("pollId", poll_id);
    const response = await apiClient.get("/get-poll-categories?poll_id=" + poll_id);
    return response.data;
}

export const createCategory = async (payload: CreateCategoryRequest) => {
    const response = await apiClient.post("/create-category", payload);
    return response.data;
}

export const updateCategory = async (payload: Category) => {
    const response = await apiClient.put("/update-category?id=" + payload.id, payload);
    return response.data;
}

export const deleteCategory = async (category_id: number) => {
    const response = await apiClient.delete(`/delete-category?id=${category_id}`);
    return response.data;
}