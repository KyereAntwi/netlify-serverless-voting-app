import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import { createWorkspace } from "./utils/services";
import { ErrorResponse, ErrorType, Workspace } from "./utils/types";

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

    if (!payload.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Title and description are required." }),
      };
    }

    const workspace: Workspace = {
      created_at: new Date().toISOString(),
      title: payload.title,
      description: payload.description,
      created_by: user.sub ?? "",
      is_active: true,
    };

    const workspaceResponse = await createWorkspace(workspace);

    return {
      statusCode: 201,
      body: JSON.stringify(workspaceResponse),
    };
  } catch (error: any) {
    console.log("Error in create-workspace handler:", error);
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
