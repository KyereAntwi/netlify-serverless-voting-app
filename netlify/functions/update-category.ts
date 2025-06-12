import { verifyAuth0Token } from "./utils/auth";
import {getCategoryById, getNomineeById, updateCategory, updateNominee} from "./utils/services";
import {ErrorResponse, ErrorType, Candidate, Category} from "./utils/types";

const handler = async (event: any, context: any) => {
    try {
        const { result } = await verifyAuth0Token(event);
        const user = result?.payload;

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }

        const payload = JSON.parse(event.body || "{}");

        if (!payload.title || !payload.poll_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Title, Poll Id are required.",
                }),
            };
        }

        const catExists: Category = await getCategoryById(payload.id);

        if (!catExists) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Candidate not found." }),
            };
        }

        const catUpdate: Category = {
            id: payload.id,
            created_at: catExists.created_at,
            title: payload.title,
            poll_id: catExists.poll_id
        };

        const catResponse = await updateCategory(catUpdate);

        return {
            statusCode: 200,
            body: JSON.stringify(catResponse),
        };
    } catch (error: any) {
        let err: ErrorResponse | undefined;
        err = JSON.parse(error) as ErrorResponse;

        if (err?.type === ErrorType.Unauthorized) {
            return {
                statusCode: typeof err.code === "number" ? err.code : 401,
                body: JSON.stringify({
                    error: err.message || "Unauthorized",
                }),
            };
        }

        if (err?.type === ErrorType.InternalServerError) {
            return {
                statusCode: typeof err.code === "number" ? err.code : 500,
                body: JSON.stringify({ error: err.message || "Internal Server Error" }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An unexpected error occurred." }),
        };
    }
};

export { handler };
