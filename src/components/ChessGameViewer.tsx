import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import { useChessGame } from "@/hooks/use-chess-game";

interface ChessGameViewerProps {
  pgn: string;
}

export function ChessGameViewer({ pgn }: ChessGameViewerProps) {
  const {
    position,
    history,
    currentMoveIndex,
    error,
    goToMove,
    nextMove,
    previousMove,
    goToStart,
    goToEnd,
  } = useChessGame(pgn);

  if (error) {
    return (
      <Card className="my-8 border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle>Partie zum Nachspielen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            <p className="font-semibold">Fehler beim Laden der Partie:</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Partie zum Nachspielen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chessboard */}
          <div className="lg:col-span-2">
            <div className="w-full max-w-[550px] mx-auto">
              <Chessboard
                position={position}
                boardWidth={550}
                arePiecesDraggable={false}
                customBoardStyle={{
                  borderRadius: "4px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={goToStart}
                disabled={currentMoveIndex === 0}
                title="Zum Anfang"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={previousMove}
                disabled={currentMoveIndex === 0}
                title="Vorheriger Zug"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[100px] text-center text-sm font-medium bg-muted py-2 rounded-md">
                Zug {currentMoveIndex} / {history.length}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMove}
                disabled={currentMoveIndex === history.length}
                title="Nächster Zug"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToEnd}
                disabled={currentMoveIndex === history.length}
                title="Zum Ende"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Move history */}
          <div className="lg:col-span-1 flex flex-col h-[550px]">
            <h3 className="font-semibold mb-3 px-1">Zugfolge</h3>
            <div className="flex-1 bg-muted/50 rounded-lg p-3 overflow-y-auto border border-border">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => {
                  const whiteIdx = i * 2;
                  const blackIdx = i * 2 + 1;
                  
                  return (
                    <div key={i} className="contents">
                      {/* White Move */}
                      <button
                        onClick={() => goToMove(whiteIdx + 1)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left text-sm ${
                          currentMoveIndex === whiteIdx + 1
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="text-muted-foreground w-4 text-[11px] font-bold">
                          {i + 1}.
                        </span>
                        {history[whiteIdx]}
                      </button>

                      {/* Black Move */}
                      {blackIdx < history.length ? (
                        <button
                          onClick={() => goToMove(blackIdx + 1)}
                          className={`px-2 py-1.5 rounded transition-colors text-left text-sm ${
                            currentMoveIndex === blackIdx + 1
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-muted"
                          }`}
                        >
                          {history[blackIdx]}
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
