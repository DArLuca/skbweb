# AGENTS.md

This file contains instructions for agentic coding agents (AI) working on this repository.

## 1. Project Overview

- **Stack:** React, TypeScript, Vite, Tailwind CSS.
- **UI Library:** Shadcn UI (Radix UI + Tailwind).
- **Routing:** react-router-dom.
- **State/Logic:** React Hooks.

## 2. Build, Lint, and Test Commands

### Build & Run
- **Development Server:** `npm run dev` (Runs Vite)
- **Production Build:** `npm run build` (Runs `tsc` then `vite build`)
- **Preview Build:** `npm run preview`

### Linting
- **Lint Code:** `npm run lint` (ESLint)
- **Type Check:** `npx tsc --noEmit`

### Testing
- **Status:** No test framework (Vitest/Jest) is currently configured in `package.json`.
- **Action:** If you are asked to write tests, you must first propose installing a test runner (e.g., Vitest) and configuring it.
- **Single Test:** N/A (Install Vitest to enable `npx vitest run path/to/file.test.ts`).

## 3. Code Style & Conventions

### Formatting
- **Indentation:** The codebase has mixed indentation (2 spaces in `main.tsx`, `package.json`; 4 spaces in `App.tsx`).
    - **Rule:** Detect and follow the indentation of the file you are editing.
    - **New Files:** Default to **2 spaces**.
- **Semicolons:** Mixed usage.
    - **Rule:** Prefer **semicolons** (`;`) for user-written code (matching `App.tsx`, `main.tsx`).
    - **Note:** Shadcn UI components (in `components/ui/`) may lack semicolons; preserve their style if editing them.
- **Quotes:** Double quotes (`"`) are preferred.

### Imports
- **Path Aliases:** Use `@/` to resolve paths from `src/` (e.g., `import { cn } from "@/lib/utils"`).
- **Order:**
    1. React / Library imports (e.g., `react`, `react-router-dom`).
    2. UI Components / Icons (e.g., `@radix-ui/*`, `lucide-react`).
    3. Local Components (e.g., `@/components/*`).
    4. Utilities / Styles (e.g., `@/lib/utils`, `./App.css`).

### Naming Conventions
- **Components:** PascalCase (e.g., `Navbar.tsx`, `function Navbar()`).
- **Files:**
    - Components: PascalCase (e.g., `Navbar.tsx`).
    - Utilities/Hooks: camelCase (e.g., `use-toast.ts`, `utils.ts`) or kebab-case (shadcn standard).
- **Variables/Functions:** camelCase.

### TypeScript
- **Props:** Use `interface` for defining component props.
    ```typescript
    export interface MyComponentProps {
      title: string;
      isActive?: boolean;
    }
    ```
- **Strictness:** No `any`. Use specific types. Use `React.FC` or explicit return types if helpful, but standard function declarations are preferred (`function App()`).

### UI & Styling
- **Tailwind:** Use Tailwind CSS classes for styling.
- **Shadcn:** Use existing UI components from `@/components/ui` whenever possible.
- **Class Merging:** Always use `cn(...)` (from `@/lib/utils`) when allowing custom `className` props or conditional classes.
    ```typescript
    <div className={cn("bg-red-500", className, isActive && "bg-green-500")} />
    ```
- **Icons:** Use `lucide-react`.

## 4. Error Handling
- Use `try/catch` blocks for async operations.
- Display errors to the user using UI feedback (toasts or alerts) rather than just console logs.

## 5. File Structure
- `src/components/ui/`: Reusable primitives (buttons, inputs).
- `src/components/`: Composite components (Navbar, Footer).
- `src/pages/`: Page-level components.
- `src/lib/`: Utilities (`utils.ts`).
- `src/assets/`: Static assets.

## 6. Cursor / Copilot Rules
*(No specific rules files found in .cursor/rules/ or .github/copilot-instructions.md)*
