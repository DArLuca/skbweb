import { Article, TournamentId, Category } from "@/types";

/**
 * Parses a markdown string into an Article object.
 */
export const parseArticle = (
  content: string,
  category: Category,
  year: number,
  tournamentId?: TournamentId
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
      image: metadata.image,
      content: body,
      category,
      tournamentId,
      year,
    };
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return null;
  }
};

/**
 * Loads all articles for a specific category and optionally tournament and year.
 */
export const fetchArticles = async (
  category: Category,
  year: number,
  tournamentId?: string
): Promise<Article[]> => {
  const articleModules = import.meta.glob("/content/**/*.md", {
    query: "?raw",
    import: "default",
  });
  const loadedArticles: Article[] = [];

  for (const path in articleModules) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    
    let isMatch = false;
    if (category === "news") {
      isMatch = normalizedPath.includes(`/news/${year}/`);
    } else if (category === "meisterschaft" && tournamentId) {
      isMatch = normalizedPath.includes(`/${tournamentId}/${year}/`);
    }

    if (isMatch) {
      const content = (await articleModules[path]()) as string;
      const article = parseArticle(content, category, year, tournamentId as TournamentId);
      if (article) {
        loadedArticles.push(article);
      }
    }
  }

  return loadedArticles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Fetches the latest N news articles across all years.
 */
export const fetchLatestNews = async (limit: number = 5): Promise<Article[]> => {
  const articleModules = import.meta.glob("/content/news/**/*.md", {
    query: "?raw",
    import: "default",
  });
  const loadedArticles: Article[] = [];

  for (const path in articleModules) {
    const pathParts = path.split("/");
    const year = parseInt(pathParts[pathParts.length - 2]);
    
    const content = (await articleModules[path]()) as string;
    const article = parseArticle(content, "news", year);
    if (article) {
      loadedArticles.push(article);
    }
  }

  return loadedArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
