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
import { TOURNAMENTS, AVAILABLE_YEARS, Article, TournamentId } from "@/types";
import { fetchArticles } from "@/lib/markdown";

export default function TournamentPage() {
  const { tournament } = useParams<{ tournament: string }>();
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const tournamentInfo = tournament ? TOURNAMENTS[tournament as TournamentId] : null;

  useEffect(() => {
    if (tournament) {
      loadData();
    }
  }, [tournament, selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles(tournament!, selectedYear);
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!tournamentInfo) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Turnier nicht gefunden</h1>
        <Link to="/meisterschaft" className="text-primary hover:underline mt-4 inline-block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/meisterschaft">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zu Meisterschaften
          </Button>
        </Link>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{tournamentInfo.fullName}</h1>
            <p className="text-muted-foreground">{tournamentInfo.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Jahr: {selectedYear}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {AVAILABLE_YEARS.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={selectedYear === year ? "bg-accent" : ""}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted rounded-t-lg" />
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-muted-foreground">
              Keine Artikel für {selectedYear} in dieser Kategorie verfügbar.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                to={`/meisterschaft/${tournament}/${selectedYear}/${article.slug}`}
              >
                <Card className="hover:shadow-md transition-all hover:border-primary/20 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{article.author}</span>
                      <span className="text-muted-foreground opacity-50">•</span>
                      <span>
                        {new Date(article.date).toLocaleDateString("de-CH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.content.substring(0, 200).replace(/[#*`]/g, "")}...
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
