import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { ChessGameViewer } from "@/components/ChessGameViewer";
import { Article, TOURNAMENTS, TournamentId } from "@/types";
import { parseArticle } from "@/lib/markdown";

export default function ArticlePage() {
  const { tournament, year, slug } = useParams<{ tournament: string; year: string; slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [pgnData, setPgnData] = useState<string | null>(null);
  const [pgnError, setPgnError] = useState<string | null>(null);

  const tournamentInfo = tournament ? TOURNAMENTS[tournament as TournamentId] : null;

  useEffect(() => {
    loadContent();
  }, [tournament, year, slug]);

  const loadContent = async () => {
    setLoading(true);
    setPgnData(null);
    setPgnError(null);

    try {
      const articleModules = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default" });
      const targetPath = `${tournament}/${year}/${slug}.md`;
      
      let content: string | null = null;
      for (const path in articleModules) {
        if (path.endsWith(targetPath)) {
          content = (await articleModules[path]()) as string;
          break;
        }
      }

      if (content) {
        const parsed = parseArticle(content, tournament as TournamentId, parseInt(year || "0"));
        if (parsed) {
          setArticle(parsed);
          
          if (parsed.chessGame) {
            fetchPgn(parsed.chessGame);
          }
        }
      }
    } catch (error) {
      console.error("Error loading article content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPgn = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      setPgnData(text);
    } catch (error) {
      console.error("Error loading PGN:", error);
      setPgnError(error instanceof Error ? error.message : "Partie konnte nicht geladen werden.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground font-medium">Lade Artikel...</p>
      </div>
    );
  }

  if (!article || !tournamentInfo) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Artikel nicht gefunden</h1>
        <Link to={`/meisterschaft/${tournament}`}>
          <Button>Zurück zur Übersicht</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to={`/meisterschaft/${tournament}`}>
          <Button variant="ghost" className="mb-8 hover:bg-accent group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Zurück zu {tournamentInfo.name}
          </Button>
        </Link>

        <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
          <header className="mb-12 pb-8 border-b border-border/60">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
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

          <div className="article-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                h2: (props) => <h2 className="text-2xl font-bold mt-10 mb-4 border-l-4 border-primary/40 pl-4" {...props} />,
                h3: (props) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,
                p: (props) => <p className="mb-6 leading-relaxed text-muted-foreground/90" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                ol: (props) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-primary bg-muted/30 px-6 py-4 italic rounded-r-lg my-8" {...props} />
                ),
                table: (props) => (
                  <div className="my-8 overflow-hidden rounded-lg border border-border shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-card text-left text-sm" {...props} />
                    </div>
                  </div>
                ),
                thead: (props) => <thead className="bg-muted/50 font-semibold" {...props} />,
                th: (props) => <th className="px-6 py-4 border-b border-border" {...props} />,
                td: (props) => <td className="px-6 py-4 border-b border-border/40" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Chess Game Viewer */}
          {(pgnData || pgnError) && (
            <div className="mt-16 pt-16 border-t border-border/60">
              {pgnError ? (
                <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    Partie konnte nicht geladen werden
                  </h3>
                  <p className="text-sm opacity-90">{pgnError}</p>
                </div>
              ) : (
                pgnData && <ChessGameViewer pgn={pgnData} />
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
