import { createRemoteJWKSet, jwtVerify } from "jose";
import { HttpError } from "./http";

const projectId =
  process.env.STACK_PROJECT_ID ?? process.env.VITE_STACK_PROJECT_ID;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Verifies the Neon Auth (Stack) access token from the Authorization header
 * against the project's JWKS and returns the authenticated user id.
 */
export async function requireUserId(req: Request): Promise<string> {
  if (!projectId) {
    throw new HttpError(500, "Auth is not configured (STACK_PROJECT_ID)");
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Missing access token");

  jwks ??= createRemoteJWKSet(
    new URL(
      `https://api.stack-auth.com/api/v1/projects/${projectId}/.well-known/jwks.json`,
    ),
  );

  try {
    const { payload } = await jwtVerify(token, jwks);
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      throw new Error("Token has no subject");
    }
    return payload.sub;
  } catch {
    throw new HttpError(401, "Invalid or expired access token");
  }
}
