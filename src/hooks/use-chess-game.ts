import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

interface UseChessGameReturn {
  position: string;
  history: string[];
  currentMoveIndex: number;
  error: string | null;
  goToMove: (index: number) => void;
  nextMove: () => void;
  previousMove: () => void;
  goToStart: () => void;
  goToEnd: () => void;
}

export function useChessGame(pgn: string): UseChessGameReturn {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [position, setPosition] = useState("start");
  const [error, setError] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    const game = new Chess();
    try {
      game.loadPgn(pgn);
      const moves = game.history();
      
      if (moves.length === 0) {
        throw new Error("Keine Züge im PGN gefunden.");
      }

      setHistory(moves);
      game.reset();
      setPosition(game.fen());
      setCurrentMoveIndex(0);
      setError(null);
    } catch (err) {
      console.error("PGN loading error:", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Partie.");
    }
  }, [pgn]);

  const goToMove = useCallback((moveIndex: number) => {
    if (moveIndex < 0 || moveIndex > history.length) return;

    const game = new Chess();
    for (let i = 0; i < moveIndex; i++) {
      const result = game.move(history[i]);
      if (!result) {
        console.error(`Failed to apply move ${i}: ${history[i]}`);
        return;
      }
    }

    setPosition(game.fen());
    setCurrentMoveIndex(moveIndex);
  }, [history]);

  const nextMove = useCallback(() => {
    goToMove(currentMoveIndex + 1);
  }, [currentMoveIndex, goToMove]);

  const previousMove = useCallback(() => {
    goToMove(currentMoveIndex - 1);
  }, [currentMoveIndex, goToMove]);

  const goToStart = useCallback(() => {
    goToMove(0);
  }, [goToMove]);

  const goToEnd = useCallback(() => {
    goToMove(history.length);
  }, [history.length, goToMove]);

  return {
    position,
    history,
    currentMoveIndex,
    error,
    goToMove,
    nextMove,
    previousMove,
    goToStart,
    goToEnd,
  };
}
