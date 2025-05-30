import { verifyAuth0Token } from "./utils/auth";
import {
  deleteECS,
  deleteWorkspace,
  getECSById,
  getWorkspaceById,
} from "./utils/services";
import { ErrorResponse, ErrorType } from "./utils/types";

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

    const ecId = event.queryStringParameters?.id;
    if (!ecId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "EC ID is required." }),
      };
    }

    const ec = await getECSById(Number(ecId));

    if (!ec) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "EC not found." }),
      };
    }

    await deleteECS(ecId);

    return {
      statusCode: 202,
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
