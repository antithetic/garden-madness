# Step 4: Install MDX Integration

## Explanation

Astro, by default, supports Markdown (`.md`) files. However, for a digital garden, you often want more flexibility, such as embedding interactive components (like React, Vue, or Svelte components) directly within your content. This is where MDX comes in. MDX (Markdown + JSX) allows you to write JSX (or TSX) inside your Markdown files, combining the simplicity of Markdown with the power of components.

To enable MDX support in your Astro project, you need to install the official `@astrojs/mdx` integration. This integration extends Astro's capabilities to parse and render `.mdx` files, making them first-class citizens in your content pipeline.

## Best Practices

*   **Install Correctly:** Always use your project's package manager (`pnpm`, `npm`, or `yarn`) to install integrations. This ensures proper dependency management.
*   **Add to `astro.config.mjs`:** After installation, it's crucial to add the integration to your `astro.config.mjs` file. Astro won't know to use it otherwise.
*   **Order of Integrations:** While not critical for MDX alone, the order of integrations in `astro.config.mjs` can sometimes matter, especially when integrations modify the same parts of the build process. For `@astrojs/mdx`, placing it early in the `integrations` array is generally fine.
*   **Check Documentation:** Always refer to the official Astro documentation for the latest installation and configuration instructions for any integration.

## Code Example

**Action:** Install the `@astrojs/mdx` package and add it to your `astro.config.mjs`.

### 1. Install the MDX package

Open your terminal in the project root and run the following command:

```bash
pnpm add @astrojs/mdx
```

This command will download and install the `@astrojs/mdx` package and add it to your `dependencies` in `package.json`.

### 2. Update `astro.config.mjs`

After installation, open your `astro.config.mjs` file and import `mdx` from `@astrojs/mdx`, then add it to the `integrations` array.

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx"; // Import MDX integration

// Define the schema for your 'notes' collection
const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Define the schema for your 'concepts' collection
const conceptsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    relatedNotes: z.array(z.string()).optional(),
  }),
});

export default defineConfig({
  integrations: [
    mdx(), // Add mdx() here to enable MDX support
    // Other integrations will go here, e.g., tailwindcss() if it were an Astro integration
  ],
  vite: {
    plugins: [tailwindcss()], // Tailwind CSS is a Vite plugin, not an Astro integration
  },
  collections: {
    notes: notesCollection,
    concepts: conceptsCollection,
  },
});
```

With these changes, Astro is now configured to process your `.mdx` files, allowing you to use JSX components within your digital garden content.