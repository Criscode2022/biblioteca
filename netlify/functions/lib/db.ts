import { neon } from "@neondatabase/serverless";
import { HttpError } from "./http";

/**
 * Returns a Neon serverless SQL client. Uses a direct (server-side) connection
 * string, so ownership must be enforced explicitly in every query via owner_id.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new HttpError(500, "DATABASE_URL is not configured");
  return neon(url);
}
