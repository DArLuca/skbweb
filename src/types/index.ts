export type TournamentId = "sgm" | "smm" | "klub-meisterschaft" | "bvm";

export interface Tournament {
  id: TournamentId;
  name: string;
  fullName: string;
  description: string;
}

export interface ArticleMetadata {
  title: string;
  author: string;
  date: string;
  slug: string;
  chessGame?: string;
  tournamentId: TournamentId;
  year: number;
}

export interface Article extends ArticleMetadata {
  content: string;
}

export const TOURNAMENTS: Record<TournamentId, Tournament> = {
  sgm: {
    id: "sgm",
    name: "SGM",
    fullName: "Schweizerische Gruppemeisterschaft (SGM)",
    description: "Das wichtigste Turnier des Jahres - Schweizerische Gruppemeisterschaft.",
  },
  smm: {
    id: "smm",
    name: "SMM",
    fullName: "Schweizerische Mannschaftsmeisterschaft (SMM)",
    description: "Schweizerische Mannschaftsmeisterschaft - Regionaler Wettbewerb.",
  },
  "klub-meisterschaft": {
    id: "klub-meisterschaft",
    name: "Klub-Meisterschaft",
    fullName: "Klub-Meisterschaft",
    description: "Internes Klubturnier für alle Mitglieder.",
  },
  bvm: {
    id: "bvm",
    name: "BVM",
    fullName: "Berner Vereinsmeisterschaft (BVM)",
    description: "Traditionelles Regionalturnier - Berner Vereinsmeisterschaft.",
  },
};

export const AVAILABLE_YEARS = [2026, 2025, 2024, 2023];
