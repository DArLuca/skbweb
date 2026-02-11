import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description: string;
  image?: string;
}

const tournaments: Tournament[] = [
  {
    id: "sgm",
    name: "SGM",
    description: "Schweizerische Gruppemeisterschaft - Das wichtigste Turnier des Jahres",
  },
  {
    id: "smm",
    name: "SMM",
    description: "Schweizerische Mannschaftsmeisterschaft - Regionaler Wettbewerb",
  },
  {
    id: "klub-meisterschaft",
    name: "Klub-Meisterschaft",
    description: "Internes Klubturnier für alle Mitglieder",
  },
  {
    id: "bvm",
    name: "BVM",
    description: "Berner Vereinsmeisterschaft - Traditionelles Regionalturnier",
  },
];

export default function Meisterschaft() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Meisterschaften</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Entdecken Sie unsere Turniere und verfolgen Sie die spannendsten Momente aus allen Meisterschaften.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.id}
            to={`/meisterschaft/${tournament.id}`}
            className="transition-transform hover:scale-105"
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{tournament.name}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {tournament.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Klicken Sie hier, um Artikel und Berichte zu sehen →
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
