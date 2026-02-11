import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface ArticleData {
  title: string;
  author: string;
  date: string;
  content: string;
}

const tournamentNames: Record<string, string> = {
  "sgm": "SGM",
  "smm": "SMM",
  "klub-meisterschaft": "Klub-Meisterschaft",
  "bvm": "BVM",
};

export default function ArticlePage() {
  const { tournament, year, slug } = useParams<{ tournament: string; year: string; slug: string }>();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [tournament, year, slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const articleModules = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default" });
      
      for (const path in articleModules) {
        if (path.includes(`/${tournament}/${year}/`) && path.includes(`${slug}.md`)) {
          const content = await articleModules[path]();
          const parsedArticle = parseMarkdown(content as string);
          if (parsedArticle) {
            setArticle(parsedArticle);
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (content: string): ArticleData | null => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) return null;

    const frontmatter = match[1];
    const body = match[2];

    const metadata: Record<string, string> = {};
    frontmatter.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        metadata[key.trim()] = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
      }
    });

    return {
      title: metadata.title || "Untitled",
      author: metadata.author || "Unknown",
      date: metadata.date || "",
      content: body,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Lade Artikel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Artikel nicht gefunden.</p>
          <Link to={`/meisterschaft/${tournament}`}>
            <Button className="mt-4">
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to={`/meisterschaft/${tournament}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zu {tournamentNames[tournament || ""]}
          </Button>
        </Link>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <header className="mb-8 pb-8 border-b">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.date).toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-2" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
