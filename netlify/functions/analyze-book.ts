import { requireUserId } from "./lib/auth";
import { getSql } from "./lib/db";
import { HttpError, handleError, json, readJsonBody } from "./lib/http";
import { CHAT_MODEL, embed, getOpenAI, languageName, normalizeLang } from "./lib/openai";

interface AnalyzeRequest {
  bookId?: string;
  language?: string;
  force?: boolean;
}

interface Analysis {
  summary: string;
  genre: string;
  themes: string[];
  audience: string;
  significance: string;
  similarWorks: { titulo: string; autor: string; reason: string }[];
}

const SYSTEM_PROMPT = (lang: string) =>
  `You are an expert librarian and literary critic working for a library management platform.
Given a book's basic catalog data, produce a rigorous analysis. If you don't recognize the exact
book, analyze it based on the most plausible interpretation of its metadata and be honest about
uncertainty in the summary.

Respond ONLY with a JSON object with exactly these keys:
- "summary": string, 3-5 sentences describing the book.
- "genre": string, the primary genre.
- "themes": array of 3 to 6 short theme strings.
- "audience": string, one sentence describing the ideal reader.
- "significance": string, 2-3 sentences on the book's cultural/literary significance.
- "similarWorks": array of exactly 3 objects with keys "titulo", "autor", "reason" (one sentence).

Write every value in ${languageName(lang)}.`;

export default async (req: Request): Promise<Response> => {
  try {
    const userId = await requireUserId(req);
    const body = await readJsonBody<AnalyzeRequest>(req);
    const bookId = body.bookId;
    if (!bookId) throw new HttpError(400, "bookId is required");
    const lang = normalizeLang(body.language);

    const sql = getSql();

    const books = await sql`
      select id, titulo, autor, year, editorial
      from books
      where id = ${bookId} and owner_id = ${userId}`;
    if (books.length === 0) throw new HttpError(404, "Book not found");
    const book = books[0];

    if (!body.force) {
      const cached = await sql`
        select analysis, language
        from book_analyses
        where book_id = ${bookId} and owner_id = ${userId}`;
      if (cached.length > 0 && cached[0].language === lang) {
        return json(200, { analysis: cached[0].analysis, cached: true });
      }
    }

    const completion = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT(lang) },
        {
          role: "user",
          content: `Analyze this book: "${book.titulo}" by ${book.autor} (year ${book.year}, publisher ${book.editorial}).`,
        },
      ],
    });

    const analysis = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    ) as Analysis;

    const embeddingText = [
      `${book.titulo} — ${book.autor} (${book.year}, ${book.editorial})`,
      analysis.summary ?? "",
      `${analysis.genre ?? ""}. ${(analysis.themes ?? []).join(", ")}`,
    ].join("\n");
    const vector = await embed(embeddingText);

    await sql`
      insert into book_analyses (book_id, owner_id, language, analysis, embedding)
      values (${bookId}, ${userId}, ${lang}, ${JSON.stringify(analysis)}::jsonb, ${vector}::vector)
      on conflict (book_id) do update
        set analysis = excluded.analysis,
            language = excluded.language,
            embedding = excluded.embedding,
            updated_at = now()`;

    return json(200, { analysis, cached: false });
  } catch (e) {
    return handleError(e);
  }
};
