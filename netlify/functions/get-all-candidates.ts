import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import { getAllNominees, getWorkspaceById } from "./utils/services";
import { ErrorResponse, ErrorType } from "./utils/types";

const handler: Handler = async (event: HandlerEvent) => {
  try {
    const { result } = await verifyAuth0Token(event);
    const user = result?.payload;

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const workspaceId = event.queryStringParameters?.workspace_id;
    if (!workspaceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Workspace ID is required." }),
      };
    }

    const workspace = await getWorkspaceById(Number(workspaceId));
    if (!workspace) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Workspace not found." }),
      };
    }
    if (workspace.created_by !== user.sub) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Forbidden: You do not have access to this workspace.",
        }),
      };
    }

    const keyword = event.queryStringParameters?.keyword || "";
    const candidates = await getAllNominees(Number(workspaceId), keyword);

    return {
      statusCode: 200,
      body: JSON.stringify(candidates),
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
