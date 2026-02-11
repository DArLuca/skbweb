import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";
import { fetchLatestNews } from "@/lib/markdown";
import { cn } from "@/lib/utils";

export const NewsSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      const news = await fetchLatestNews(5);
      setLatestNews(news);
    };
    loadNews();
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  if (latestNews.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Aktuelle News</h2>
            <p className="text-muted-foreground">Neuigkeiten rund um den Schachklub Bern</p>
          </div>
          <Link to="/news">
            <Button variant="ghost" className="group hidden md:flex">
              Zum News Archiv <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="relative group">
          <div className="overflow-hidden rounded-3xl shadow-xl" ref={emblaRef}>
            <div className="flex">
              {latestNews.map((article) => (
                <div key={article.slug} className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[500px]">
                  <img
                    src={article.image || "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000&auto=format&fit=crop"}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full text-white">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-4 opacity-90">
                      <div className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <User className="h-3.5 w-3.5" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(article.date).toLocaleDateString("de-CH")}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-extrabold mb-6 max-w-3xl leading-tight">
                      {article.title}
                    </h3>
                    
                    <Link to={`/news/${article.year}/${article.slug}`}>
                      <Button size="lg" className="rounded-full px-8 font-bold shadow-lg hover:shadow-primary/20">
                        Jetzt lesen
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 transition-all rounded-full",
                  index === selectedIndex ? "w-8 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                )}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
        
        <Link to="/news" className="block md:hidden mt-8 text-center">
          <Button variant="outline" className="w-full">
            Alle News ansehen
          </Button>
        </Link>
      </div>
    </section>
  );
};
