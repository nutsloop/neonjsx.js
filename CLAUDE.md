# CLAUDE.md

## Policy
- WARNING: Never run `sudo` unless the user explicitly requests it; even then, always ask for confirmation before running any `sudo` command.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Typescript JSX runtime library for building web applications.

## Build Commands


### Frontend (TypeScript/JSX)
```bash
npm install                          # Install dependencies
npm run build                        # Build shared JSX runtime
npm run lint                         # Lint TypeScript
npm run lint-fix                     # Auto-fix lint issues
```

## Build Workflow (IMPORTANT)

**ALWAYS ask before building to save tokens.** Build processes consume significant tokens and should only be run when explicitly requested by the user or when absolutely necessary.

- ❌ Don't automatically run build commands after making changes
- ✅ Do make code changes and wait for user to request build
- ✅ Do ask "Should I build this?" when uncertain
- Exception: Only build without asking if the user explicitly requests it (e.g., "build and test this")

## Architecture

### Directory Structure

## Code Style

### TypeScript/JSX
- Custom JSX factory: `h`/`Fragment` (not React)
- PascalCase for component files
- ESLint with TypeScript parser

## Testing

No formal test suite.

## Key Configuration

- Babel JSX: `.babelrc`
- TypeScript: `tsconfig.json`
- Global paths: `scripts/global_variables.sh`

## Commit Guidelines

- Wait for explicit commit request
- Use conventional prefixes: `feat:`, `fix:`, `chore:`
- Include description body explaining what/why
- Group logically related files in single commits
