import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import { createPoll } from "./utils/services";
import { ErrorResponse, ErrorType, Poll } from "./utils/types";

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

    if (
      !payload.title ||
      !payload.start_date ||
      !payload.end_date ||
      !payload.workspace_id
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Title, Start date, End date and workspace Id are required.",
        }),
      };
    }

    const poll: Poll = {
      created_at: new Date().toISOString(),
      created_by: user.sub ?? "",
      title: payload.title,
      workspace_id: payload.workspace_id,
      description: payload.description || "",
      start_date: payload.start_date || "",
      end_date: payload.end_date || "",
      is_active: payload.is_active || true,
      type: payload.type || "OpenBasic",
    };

    const pollResponse = await createPoll(poll);

    return {
      statusCode: 201,
      body: JSON.stringify(pollResponse),
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
