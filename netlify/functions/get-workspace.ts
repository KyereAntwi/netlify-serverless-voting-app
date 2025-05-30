import { verifyAuth0Token } from "./utils/auth";
import { getWorkspaceById } from "./utils/services";
import { ErrorResponse, ErrorType } from "./utils/types";

const handler = async (event: any) => {
  try {
    const { result } = await verifyAuth0Token(event);
    const user = result?.payload;

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const workspaceId = event.queryStringParameters?.id;
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

    return {
      statusCode: 200,
      body: JSON.stringify(workspace),
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
