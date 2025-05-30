import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import { updateECSPoll } from "./utils/services";
import { ErrorResponse, ErrorType, ECPoll } from "./utils/types";

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

    if (!payload.ec_id || !payload.poll_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "EC ID, and Poll Id are required.",
        }),
      };
    }

    const ecResponse = await updateECSPoll(payload.ec_id, payload.poll_id);

    return {
      statusCode: 201,
      body: JSON.stringify(ecResponse),
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
