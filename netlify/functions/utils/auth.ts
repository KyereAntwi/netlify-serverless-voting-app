// netlify/functions/utils/auth.ts
import { type JWTVerifyResult, createRemoteJWKSet, jwtVerify } from "jose";
import type { HandlerEvent } from "@netlify/functions";

export interface CustomClaims {
  [key: string]: unknown;
  permissions?: string[];
  // Add other custom claims you expect from your Auth0 access token
  email?: string;
  sub?: string;
  name?: string;
}

export type VerifyAuth0TokenResult<C extends Record<string, unknown> = CustomClaims> = {
  token: string;
  result: JWTVerifyResult & { payload: C };
};

// This JWKS set is created once and reused for performance
const jwks = createRemoteJWKSet(
  new URL(".well-known/jwks.json", process.env.AUTH0_ISSUER_BASE_URL!)
);

export const verifyAuth0Token = async <C extends Record<string, unknown> = CustomClaims>(
  event: HandlerEvent
): Promise<VerifyAuth0TokenResult<C>> => {
  const authorizationHeader = event.headers.authorization;

  if (!authorizationHeader) {
    throw new Error("Authorization header missing.");
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new Error("Invalid Authorization header format (expected Bearer token).");
  }

  // Ensure environment variables are present
  if (!process.env.AUTH0_ISSUER_BASE_URL || !process.env.AUTH0_AUDIENCE) {
    throw new Error("Auth0 environment variables (AUTH0_ISSUER_BASE_URL, AUTH0_AUDIENCE) are not configured for the function.");
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
        if (error.name === 'JOSEAlgNotAllowed') {
            throw new Error("Token algorithm not allowed. Ensure RS256 is used.");
        }
        if (error.name === 'JWSInvalid') {
            throw new Error("Invalid signature or token format.");
        }
        if (error.name === 'JWTExpired') {
            throw new Error("Token has expired. Please log in again.");
        }
        if (error.name === 'JWTInvalidIssuer' || error.name === 'JWTInvalidAudience') {
            throw new Error("Token issuer or audience mismatch. Check your Auth0 configuration.");
        }
    }
    throw new Error("Authentication failed: Invalid or expired token.");
  }
};