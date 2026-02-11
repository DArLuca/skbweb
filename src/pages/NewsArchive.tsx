import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, ArrowLeft, Newspaper } from "lucide-react";
import { AVAILABLE_YEARS, Article } from "@/types";
import { fetchArticles } from "@/lib/markdown";

export default function NewsArchive() {
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles("news", selectedYear);
      setArticles(data);
    } catch (error) {
      console.error("Error loading news articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Button>
      </Link>

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 text-primary">
            <Newspaper className="h-8 w-8" />
            <h1 className="text-4xl font-extrabold tracking-tight">News Archiv</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Bleiben Sie auf dem Laufenden über alles, was im SKB passiert.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between shadow-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse h-[400px]">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardHeader className="space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card className="p-20 text-center border-dashed bg-muted/20">
          <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground text-xl">
            Keine News für {selectedYear} verfügbar.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/news/${selectedYear}/${article.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col group-hover:-translate-y-1">
                {article.image && (
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="text-2xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-2">
                    <span className="font-semibold text-foreground">{article.author}</span>
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
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {article.content.substring(0, 180).replace(/[#*`]/g, "")}...
                  </p>
                  <Button variant="link" className="p-0 h-auto font-bold text-primary group-hover:underline">
                    Mehr lesen →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
