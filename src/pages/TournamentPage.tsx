import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, ArrowLeft } from "lucide-react";

interface Article {
  title: string;
  author: string;
  date: string;
  slug: string;
  content: string;
}

const tournamentNames: Record<string, string> = {
  "sgm": "Schweizerische Gruppemeisterschaft (SGM)",
  "smm": "Schweizerische Mannschaftsmeisterschaft (SMM)",
  "klub-meisterschaft": "Klub-Meisterschaft",
  "bvm": "Berner Vereinsmeisterschaft (BVM)",
};

const availableYears = [2026, 2025, 2024, 2023];

export default function TournamentPage() {
  const { tournament } = useParams<{ tournament: string }>();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [tournament, selectedYear]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Dynamically import all markdown files for the selected tournament and year
      const articleModules = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default" });
      const loadedArticles: Article[] = [];

      for (const path in articleModules) {
        if (path.includes(`/${tournament}/${selectedYear}/`)) {
          const content = await articleModules[path]();
          const article = parseMarkdown(content as string);
          if (article) {
            loadedArticles.push(article);
          }
        }
      }

      // Sort articles by date (newest first)
      loadedArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setArticles(loadedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (content: string): Article | null => {
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
      slug: metadata.slug || "",
      content: body,
    };
  };

  const tournamentName = tournament ? tournamentNames[tournament] : "";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/meisterschaft">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zu Meisterschaften
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{tournamentName}</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  Jahr: {selectedYear}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Lade Artikel...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Keine Artikel für {selectedYear} verfügbar.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article, index) => (
              <Link
                key={index}
                to={`/meisterschaft/${tournament}/${selectedYear}/${article.slug}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <CardDescription>
                      <span className="font-medium">{article.author}</span> • {" "}
                      {new Date(article.date).toLocaleDateString("de-CH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {article.content.substring(0, 200)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
