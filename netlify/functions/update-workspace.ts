import { verifyAuth0Token } from "./utils/auth";
import { getWorkspaceById, updateWorkspace } from "./utils/services";
import { ErrorResponse, ErrorType, Workspace } from "./utils/types";

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

    if (!payload.id || !payload.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID and title are required." }),
      };
    }

    const workspaceExists = await getWorkspaceById(payload.id);

    if (!workspaceExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Workspace not found." }),
      };
    }

    if (workspaceExists.created_by !== user.sub) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Forbidden: You do not own this workspace.",
        }),
      };
    }

    const workspaceUpdate: Workspace = {
      id: payload.id,
      title: payload.title,
      description: payload.description || "",
      created_at: workspaceExists.created_at,
      created_by: workspaceExists.created_by,
      is_active: workspaceExists.is_active,
    };

    const workspaceResponse = await updateWorkspace(workspaceUpdate);

    return {
      statusCode: 200,
      body: JSON.stringify(workspaceResponse),
    };
  } catch (error: any) {
    console.log("Error in update-workspace handler:", error);
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
