import { verifyAuth0Token } from "./utils/auth";
import { getPollById, updatePoll } from "./utils/services";
import { ErrorResponse, ErrorType, Poll } from "./utils/types";

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

    const pollExists = await getPollById(payload.id);

    if (!pollExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Poll not found." }),
      };
    }

    if (pollExists.created_by !== user.sub) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Forbidden: You do not own this entity.",
        }),
      };
    }

    const poll: Poll = {
      id: payload.id,
      created_at: payload.created_at,
      created_by: payload.created_by ?? "",
      title: payload.title,
      workspace_id: payload.workspace_id,
      description: payload.description || "",
      start_date: payload.start_date || "",
      end_date: payload.end_date || "",
      is_active: payload.is_active,
      type: payload.type || "OpenBasic",
    };

    const ecResponse = await updatePoll(poll);

    return {
      statusCode: 200,
      body: JSON.stringify(ecResponse),
    };
  } catch (error: any) {
    console.log("error", error);
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
