import { requireUserId } from "./lib/auth";
import { getSql } from "./lib/db";
import { HttpError, handleError, json, readJsonBody } from "./lib/http";
import { embed } from "./lib/openai";

interface SearchRequest {
  query?: string;
  limit?: number;
}

export default async (req: Request): Promise<Response> => {
  try {
    const userId = await requireUserId(req);
    const body = await readJsonBody<SearchRequest>(req);
    const query = body.query?.trim();
    if (!query) throw new HttpError(400, "query is required");
    const limit = Math.min(Math.max(body.limit ?? 8, 1), 20);

    const vector = await embed(query);
    const sql = getSql();

    // Cosine distance over the analyses' embeddings; only the caller's rows.
    const results = await sql`
      select
        b.id, b.titulo, b.autor, b.year, b.editorial,
        a.analysis->>'summary' as summary,
        1 - (a.embedding <=> ${vector}::vector) as similarity
      from book_analyses a
      join books b on b.id = a.book_id
      where a.owner_id = ${userId} and a.embedding is not null
      order by a.embedding <=> ${vector}::vector
      limit ${limit}`;

    return json(200, { results });
  } catch (e) {
    return handleError(e);
  }
};
