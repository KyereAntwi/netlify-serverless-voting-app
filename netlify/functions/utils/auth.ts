// netlify/functions/utils/auth.ts
import { type JWTVerifyResult, createRemoteJWKSet, jwtVerify } from "jose";
import type { HandlerEvent } from "@netlify/functions";
import { ErrorResponse, ErrorType } from "./types";

export interface CustomClaims {
  [key: string]: unknown;
  permissions?: string[];
  // Add other custom claims you expect from your Auth0 access token
  email?: string;
  sub?: string;
  name?: string;
}

export type VerifyAuth0TokenResult<
  C extends Record<string, unknown> = CustomClaims
> = {
  token: string;
  result: JWTVerifyResult & { payload: C };
};

// This JWKS set is created once and reused for performance
const jwks = createRemoteJWKSet(
  new URL(".well-known/jwks.json", process.env.AUTH0_ISSUER_BASE_URL!)
);

export const verifyAuth0Token = async <
  C extends Record<string, unknown> = CustomClaims
>(
  event: HandlerEvent
): Promise<VerifyAuth0TokenResult<C>> => {
  const authorizationHeader = event.headers.authorization;

  if (!authorizationHeader) {
    const err: ErrorResponse = {
      message: "Authorization header missing.",
      code: "InvalidAuthorizationHeader",
      type: ErrorType.Unauthorized,
    };
    throw new Error(JSON.stringify(err));
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    const err: ErrorResponse = {
      message: "Invalid Authorization header format (expected Bearer token).",
      code: "InvalidAuthorizationHeader",
      type: ErrorType.Unauthorized,
    };

    throw new Error(JSON.stringify(err));
  }

  // Ensure environment variables are present
  if (!process.env.AUTH0_ISSUER_BASE_URL || !process.env.AUTH0_AUDIENCE) {
    const err: ErrorResponse = {
      message:
        "Auth0 environment variables (AUTH0_ISSUER_BASE_URL, AUTH0_AUDIENCE) are not configured for the function.",
      code: "InvalidAuthorizationHeader",
      type: ErrorType.Unauthorized,
    };

    throw new Error(JSON.stringify(err));
  }

  try {
    const { payload, protectedHeader } = await jwtVerify(token, jwks, {
      issuer: process.env.AUTH0_ISSUER_BASE_URL!,
      audience: process.env.AUTH0_AUDIENCE!,
    });

    return {
      token,
      result: {
        payload: payload as C,
        protectedHeader,
      },
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    // Provide more specific error messages for debugging if needed
    if (error instanceof Error) {
      if (error.name === "JOSEAlgNotAllowed") {
        const err: ErrorResponse = {
          message: "Token algorithm not allowed. Ensure RS256 is used.",
          code: "InvalidAuthorizationHeader",
          type: ErrorType.Unauthorized,
        };

        throw new Error(JSON.stringify(err));
      }
      if (error.name === "JWSInvalid") {
        const err: ErrorResponse = {
          message: "Invalid signature or token format.",
          code: "InvalidAuthorizationHeader",
          type: ErrorType.Unauthorized,
        };

        throw new Error(JSON.stringify(err));
      }
      if (error.name === "JWTExpired") {
        const err: ErrorResponse = {
          message: "Token has expired. Please log in again.",
          code: "InvalidAuthorizationHeader",
          type: ErrorType.Unauthorized,
        };

        throw new Error(JSON.stringify(err));
      }
      if (
        error.name === "JWTInvalidIssuer" ||
        error.name === "JWTInvalidAudience"
      ) {
        const err: ErrorResponse = {
          message:
            "Token issuer or audience mismatch. Check your Auth0 configuration.",
          code: "InvalidAuthorizationHeader",
          type: ErrorType.Unauthorized,
        };

        throw new Error(JSON.stringify(err));
      }
    }

    const err: ErrorResponse = {
      message: "Authentication failed: Invalid or expired token.",
      code: "InvalidAuthorizationHeader",
      type: ErrorType.Unauthorized,
    };

    throw new Error(JSON.stringify(err));
  }
};
