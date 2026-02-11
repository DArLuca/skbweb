# Meisterschaft Content Management

This directory contains all the Markdown articles for the Meisterschaft section of the website.

## Directory Structure

```
content/
├── sgm/
│   ├── 2026/
│   │   ├── intro.md
│   │   └── highlights.md
│   └── 2025/
├── smm/
│   ├── 2026/
│   │   └── season-start.md
│   └── 2025/
├── klub-meisterschaft/
│   ├── 2026/
│   │   └── announcement.md
│   └── 2025/
└── bvm/
    ├── 2026/
    │   └── info.md
    └── 2025/
```

## Adding New Articles

### 1. Create a new Markdown file

Create a new `.md` file in the appropriate tournament and year folder.

Example: `content/sgm/2026/new-article.md`

### 2. Add Frontmatter

Every article must start with frontmatter containing metadata:

```markdown
---
title: "Your Article Title"
author: "Author Name"
date: "2026-02-15"
slug: "new-article"
---

# Your Article Content

Write your article content here using Markdown syntax.
```

### 3. Frontmatter Fields

- **title**: The title of the article (displayed prominently)
- **author**: Author name
- **date**: Publication date in YYYY-MM-DD format
- **slug**: URL-friendly identifier (used in the URL path)

### 4. Markdown Syntax

You can use standard Markdown syntax including:

- Headings: `#`, `##`, `###`
- Lists: `-` or `1.`
- Links: `[text](url)`
- Bold: `**text**`
- Italic: `*text*`
- Blockquotes: `> quote`
- Code: `` `code` ``

## Tournament IDs

- **sgm**: Schweizerische Gruppemeisterschaft
- **smm**: Schweizerische Mannschaftsmeisterschaft
- **klub-meisterschaft**: Klub-Meisterschaft
- **bvm**: Berner Vereinsmeisterschaft

## Adding New Years

To add support for a new year:

1. Create a new year folder under the tournament directory
2. Add your Markdown articles to that folder
3. The year will automatically appear in the year dropdown

## Future: Database Migration

This Markdown-based system is designed as a prototype. In the future, articles will be migrated to a database with an admin interface for easier content management.
