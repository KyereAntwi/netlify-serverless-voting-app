import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { verifyAuth0Token } from "./utils/auth";
import { createNominee } from "./utils/services";
import { ErrorResponse, ErrorType, Candidate } from "./utils/types";

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

    if (!payload.first_name || !payload.last_name || !payload.workspace_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "First Name, Last Name and workspace Id are required.",
        }),
      };
    }

    let profileImageUrl: string | undefined = undefined;
    if (payload.profile_image !== undefined || payload.profile_image !== null) {
      // upload profile image logic can be added here
      // to supabase storage or any other service
    }

    const candidate: Candidate = {
      created_at: new Date().toISOString(),
      created_by: user.sub ?? "",
      first_name: payload.first_name,
      workspace_id: payload.workspace_id,
      last_name: payload.last_name,
      other_names: payload.other_names || "",
      profile_image: profileImageUrl,
    };

    const ecResponse = await createNominee(candidate);

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
