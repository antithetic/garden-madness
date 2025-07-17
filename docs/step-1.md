# Step 1: Define Content Collections in `astro.config.mjs`

## Explanation

Astro's Content Collections provide a powerful and structured way to manage your content, especially for data-driven sites like a digital garden. By defining collections, you tell Astro about the types of content you have (e.g., "notes", "concepts") and the expected structure of their frontmatter (metadata). This enables:

*   **Type Safety:** Using `zod` (imported as `z` from `astro/config`), you can define a schema for your frontmatter. Astro will then validate your content files against this schema, catching errors early in development. This is crucial for maintaining data consistency across your garden.
*   **Content Querying:** Astro provides `getCollection` and `getEntry` utilities to easily query and retrieve content from your defined collections, making it simple to build dynamic pages and lists.
*   **Organization:** It keeps your content neatly separated and organized, making your project easier to manage as it grows.

For your digital garden, we'll define two content collections: `notes` for atomic notes and `concepts` for broader ideas that link notes together.

## Best Practices

*   **Descriptive Schemas:** Make your `zod` schemas as descriptive as possible. Include all expected frontmatter fields, mark optional fields, and specify their types. This acts as documentation for your content creators.
*   **Clear Naming Conventions:** Use clear and consistent naming for your collections (e.g., `notes`, `concepts`).
*   **Separate Schemas:** Define each collection's schema separately for readability and maintainability.
*   **`type: 'content'` vs. `type: 'data'`:** Use `type: 'content'` for Markdown or MDX files that will be rendered as pages. Use `type: 'data'` for JSON, YAML, or other data files that you might want to query but not necessarily render directly as pages.

## Code Example

Modify your `astro.config.mjs` file to include the `collections` property within `defineConfig`.

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx"; // Will be added in a later step

// Define the schema for your 'notes' collection
const notesCollection = defineCollection({
  type: 'content', // 'content' for Markdown/MDX, 'data' for JSON/YAML
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Add any other frontmatter fields you need for notes
    // Example: lastUpdated: z.date().optional(),
  }),
});

// Define the schema for your 'concepts' collection
const conceptsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    relatedNotes: z.array(z.string()).optional(), // Array of note slugs
    // Add any other frontmatter fields you need for concepts
    // Example: mainConcept: z.string().optional(),
  }),
});

export default defineConfig({
  integrations: [
    // Add integrations here later, e.g., mdx()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  collections: {
    notes: notesCollection,
    concepts: conceptsCollection,
  },
});
```

**Explanation of the `zod` schema:**

*   `z.string()`: Defines a required string field.
*   `z.string().optional()`: Defines an optional string field.
*   `z.array(z.string()).optional()`: Defines an optional array where each element is a string. This is perfect for `tags` or `relatedNotes`.

By setting this up, Astro will automatically provide TypeScript types for your content collections, enhancing your development experience with autocompletion and type checking.
