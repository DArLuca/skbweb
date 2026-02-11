# Adding Chess Games to Articles

This guide explains how to embed interactive chess games in your Mannschaftsbericht articles.

## Overview

The chess game viewer allows you to add playable chess games to any article. Users can navigate through the moves, view the position at any point, and see the complete move history.

## How to Add a Chess Game

### Step 1: Prepare Your PGN File

Create a PGN (Portable Game Notation) file with your chess game. PGN is the standard format for chess games.

Example PGN format:
```
[Event "SGM 2026 - Runde 3"]
[Site "Zurich"]
[Date "2026.02.14"]
[Round "3"]
[White "Müller, Hans"]
[Black "Schneider, Peter"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Nc6 ...
```

Save your PGN file in the `public/games/` directory:
```
public/games/your-game-name.pgn
```

### Step 2: Reference the Game in Your Article

In your Markdown article's frontmatter, add the `chessGame` field pointing to your PGN file:

```markdown
---
title: "Mannschaftsbericht: Team A vs Team B"
author: "Your Name"
date: "2026-02-15"
slug: "mannschaftsbericht"
chessGame: "/games/your-game-name.pgn"
---

# Your Article Content

Write your match report here...
```

### Step 3: The Chess Viewer Appears Automatically

The chess game viewer will automatically appear at the bottom of your article. No additional code needed!

## Features of the Chess Game Viewer

### Interactive Chessboard
- Visual representation of the position
- Updates as you navigate through moves
- Clean, professional design

### Navigation Controls
- **⏮ Skip to Start**: Jump to the initial position
- **◀ Previous**: Go back one move
- **▶ Next**: Go forward one move
- **⏭ Skip to End**: Jump to the final position
- **Move Counter**: Shows current move number

### Move History Panel
- Complete list of all moves in the game
- Click any move to jump to that position
- Current move is highlighted
- Scrollable for long games

## Example Article

See the live example:
- Article: `/meisterschaft/sgm/2026/mannschaftsbericht`
- PGN File: `/public/games/team-zurich-vs-bern.pgn`

## Tips

1. **Annotate Your Games**: You can add comments in your PGN files (though they won't display in the current version)
2. **Multiple Games**: To add multiple games to one article, you'll need to create separate articles or extend the component
3. **Game Quality**: Ensure your PGN is valid - use a chess program to verify it before uploading

## Supported PGN Features

Currently supported:
- ✅ Standard algebraic notation (SAN)
- ✅ Game headers (Event, Site, Date, etc.)
- ✅ Move sequences
- ✅ Result notation (1-0, 0-1, 1/2-1/2)

Not yet supported:
- ❌ Variations
- ❌ Annotations/comments in moves
- ❌ Numeric Annotation Glyphs (NAGs)

## Getting PGN Files

You can export PGN files from:
- Chess.com (Download button on game analysis)
- Lichess.org (Export option)
- ChessBase
- Most chess software

## Troubleshooting

**Game doesn't load:**
- Check that the PGN file path in frontmatter is correct
- Ensure the PGN file is in the `public/games/` directory
- Verify the PGN syntax is valid

**Moves don't display correctly:**
- Make sure the PGN uses standard algebraic notation
- Check for any special characters that might cause issues
- Test your PGN in a chess program first
