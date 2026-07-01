import { requireUserId } from "./lib/auth";
import { getSql } from "./lib/db";
import { HttpError, handleError, json, readJsonBody } from "./lib/http";
import { CHAT_MODEL, embed, getOpenAI, languageName, normalizeLang } from "./lib/openai";

interface AskRequest {
  question?: string;
  language?: string;
}

interface AnalysisRow {
  id: string;
  titulo: string;
  autor: string;
  year: number;
  editorial: string;
  analysis: {
    summary?: string;
    genre?: string;
    themes?: string[];
  } | null;
  similarity: number;
}

export default async (req: Request): Promise<Response> => {
  try {
    const userId = await requireUserId(req);
    const body = await readJsonBody<AskRequest>(req);
    const question = body.question?.trim();
    if (!question) throw new HttpError(400, "question is required");
    if (question.length > 2000) throw new HttpError(400, "question is too long");
    const lang = normalizeLang(body.language);

    const sql = getSql();
    const vector = await embed(question);

    // RAG retrieval: the most relevant analyzed books of this user.
    const rows = (await sql`
      select
        b.id, b.titulo, b.autor, b.year, b.editorial,
        a.analysis,
        1 - (a.embedding <=> ${vector}::vector) as similarity
      from book_analyses a
      join books b on b.id = a.book_id
      where a.owner_id = ${userId} and a.embedding is not null
      order by a.embedding <=> ${vector}::vector
      limit 6`) as unknown as AnalysisRow[];

    const [{ total }] = (await sql`
      select count(*)::int as total from books where owner_id = ${userId}`) as {
      total: number;
    }[];

    const context = rows
      .map((r) => {
        const a = r.analysis ?? {};
        const themes = (a.themes ?? []).join(", ");
        return `- "${r.titulo}" — ${r.autor} (${r.year}, ${r.editorial}). ${a.summary ?? ""}${themes ? ` Themes: ${themes}.` : ""}`;
      })
      .join("\n");

    const completion = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are the AI assistant of a professional library management platform.
The user's collection has ${total} books in total; below is the catalog context retrieved for
their question (only books that have been AI-analyzed appear here).

Rules:
- Answer in ${languageName(lang)}.
- Base your answer ONLY on the catalog context. Cite book titles in quotes when referring to them.
- If the context is insufficient to answer, say so briefly and suggest analyzing more books.
- Be concise and helpful; use short paragraphs or lists.

Catalog context:
${context || "(no analyzed books yet)"}`,
        },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0].message.content ?? "";
    const sources = rows.map(({ id, titulo, autor, similarity }) => ({
      id,
      titulo,
      autor,
      similarity,
    }));

    return json(200, { answer, sources });
  } catch (e) {
    return handleError(e);
  }
};
