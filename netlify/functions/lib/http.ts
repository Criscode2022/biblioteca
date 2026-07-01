/** Shared HTTP helpers for Netlify Functions (v2, web-standard Request/Response). */

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const handleError = (e: unknown): Response => {
  if (e instanceof HttpError) return json(e.status, { error: e.message });
  console.error("Unhandled function error:", e);
  return json(500, { error: "Internal server error" });
};

export const readJsonBody = async <T>(req: Request): Promise<T> => {
  if (req.method !== "POST") throw new HttpError(405, "Method not allowed");
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
};
