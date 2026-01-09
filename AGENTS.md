# Repository Guidelines

## Policy
- WARNING: Never run `sudo` unless the user explicitly requests it; even then, always ask for confirmation before running any `sudo` command.

## Project Structure & Module Organization
- Front-end runtime lives in `neonjsx/`
- Build files: `package.json`, `tsconfig.json`; node modules are vendored in `node_modules/`.

## Build, Test, and Development Commands
- No formal test suite yet;

## Coding Style & Naming Conventions
- TypeScript/JSX uses the custom JSX factory `h`/`Fragment`; keep components in PascalCase
- Run formatters if added; otherwise match existing style and keep comments minimal and purposeful.

## Commit & Pull Request Guidelines
- Always wait to commit when requested, never do for every change
- Use concise, descriptive commits; conventional prefixes seen here (`feat:`, `fix:`, `chore:`). Example: `feat: add SSE memory stream`.
- Always follow the subject with a blank line and a short body explaining the change (what/why); keep commits scoped and avoid committing build artifacts unless required.
- PRs should summarize changes, mention affected modules, list verification steps (builds, curl/browser checks, load tests), and include screenshots/GIFs for UI updates.
- Use detailed description for every commit
- try to logical commit file related by mean.
