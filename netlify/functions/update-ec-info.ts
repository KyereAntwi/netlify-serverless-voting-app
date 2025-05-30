import { verifyAuth0Token } from "./utils/auth";
import { getECSById, updateECS } from "./utils/services";
import { EC, ErrorResponse, ErrorType, Workspace } from "./utils/types";

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

    if (!payload.user_code || !payload.user_code || !payload.workspace_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Username, User code and workspace Id are required.",
        }),
      };
    }

    const ecExists = await getECSById(payload.id);

    if (!ecExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "EC not found." }),
      };
    }

    if (ecExists.created_by !== user.sub) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Forbidden: You do not own this entity.",
        }),
      };
    }

    const ecUpdate: EC = {
      id: payload.id,
      created_at: ecExists.created_at,
      created_by: ecExists.created_by,
      user_code: payload.user_code,
      workspace_id: ecExists.workspace_id,
      user_name: payload.user_name,
    };

    const ecResponse = await updateECS(ecUpdate);

    return {
      statusCode: 200,
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

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An unexpected error occurred." }),
    };
  }
};

export { handler };
