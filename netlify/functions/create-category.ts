import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import {createCategory, createECS} from "./utils/services";
import {Category, EC, ErrorResponse, ErrorType, Workspace} from "./utils/types";

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
) => {
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
                    error: "Title and Poll Id are required.",
                }),
            };
        }

        const category: Category = {
            created_at: new Date().toISOString(),
            poll_id: payload.poll_id,
            title: payload.title,
        };

        const catResponse = await createCategory(category);

        return {
            statusCode: 201,
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

        // Default error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An unexpected error occurred." }),
        };
    }
};

export { handler };
