# Project Overview: Garden Madness

This project is a monorepo managed with `pnpm` and `turbo`.

## Project Structure

- `apps/astro`: An Astro application, likely serving as the frontend.
- `apps/studio`: A placeholder application, currently with no specific technologies defined.
- `packages`: This directory is currently empty but is typically used for shared utilities or components within a monorepo.

## Technologies Used

### Core Monorepo Tools
- **pnpm**: Package manager.
- **turbo**: Monorepo build system.

### Frontend (apps/astro)
- **Astro**: Web framework for building content-focused websites.
- **Tailwind CSS**: Utility-first CSS framework.
- **@tailwindcss/typography**: Tailwind CSS plugin for styling prose.

### Development Tools
- **ESLint**: Pluggable JavaScript linter.
- **Prettier**: Opinionated code formatter.
- **prettier-plugin-astro**: Prettier plugin for Astro files.
- **prettier-plugin-tailwindcss**: Prettier plugin for sorting Tailwind CSS classes.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run Development Servers**:
    ```bash
    pnpm dev
    ```
    This command will likely start the development servers for all applications defined in the `turbo.json` configuration.

3.  **Build Project**:
    ```bash
    pnpm build
    ```

4.  **Lint Code**:
    ```bash
    pnpm lint
    ```

5.  **Format Code**:
    ```bash
    pnpm format
    ```

6.  **Clean Project**:
    ```bash
    pnpm clean
    ```
