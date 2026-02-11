import { Article, TournamentId } from "@/types";

/**
 * Parses a markdown string into an Article object.
 */
export const parseArticle = (
  content: string,
  tournamentId: TournamentId,
  year: number
): Article | null => {
  try {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      console.warn("Markdown missing frontmatter delimiters (---)");
      return null;
    }

    const frontmatter = match[1];
    const body = match[2];

    const metadata: Record<string, string> = {};
    frontmatter.split("\n").forEach((line) => {
      const firstColon = line.indexOf(":");
      if (firstColon !== -1) {
        const key = line.substring(0, firstColon).trim();
        const value = line.substring(firstColon + 1).trim().replace(/^["']|["']$/g, "");
        metadata[key] = value;
      }
    });

    if (!metadata.title || !metadata.slug) {
      console.warn("Markdown missing critical frontmatter (title or slug)");
      return null;
    }

    return {
      title: metadata.title,
      author: metadata.author || "Unbekannt",
      date: metadata.date || "",
      slug: metadata.slug,
      chessGame: metadata.chessGame,
      content: body,
      tournamentId,
      year,
    };
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return null;
  }
};

/**
 * Loads all articles for a specific tournament and year using Vite's import.meta.glob.
 */
export const fetchArticles = async (
  tournamentId: string,
  year: number
): Promise<Article[]> => {
  const articleModules = import.meta.glob("/content/**/*.md", {
    query: "?raw",
    import: "default",
  });
  const loadedArticles: Article[] = [];

  for (const path in articleModules) {
    // Expected path format: /content/tournamentId/year/slug.md
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (normalizedPath.includes(`/${tournamentId}/${year}/`)) {
      const content = (await articleModules[path]()) as string;
      const article = parseArticle(content, tournamentId as TournamentId, year);
      if (article) {
        loadedArticles.push(article);
      }
    }
  }

  return loadedArticles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
