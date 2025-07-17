# Step 8: Internal Linking

## Explanation

One of the core principles of a digital garden is the interconnectedness of ideas. This is achieved through internal linking, allowing you to create a web of knowledge where notes and concepts reference each other. While standard Markdown links (`[text](url)`) work, a more intuitive and common pattern in digital gardens is to use a simpler syntax, often referred to as "wiki-style links" or "bracket links," like `[[Note Title]]`.

To enable this custom syntax in your MDX files and convert it into standard HTML `<a>` tags that point to your Astro pages, you'll need a **Remark plugin**. Remark is a powerful Markdown processor that works with MDX. A Remark plugin allows you to extend Markdown's capabilities by transforming its Abstract Syntax Tree (AST).

Our Remark plugin will:

1.  **Traverse the AST:** It will walk through the parsed MDX content, looking for specific node types (e.g., `text` nodes).
2.  **Identify Patterns:** It will use a regular expression to find instances of `[[...]]` within these text nodes.
3.  **Transform Nodes:** When a match is found, it will replace the original text node with a new `link` node, setting the `url` attribute to the appropriate slug for the linked note or concept, and the link text to what was inside the brackets.

## Best Practices

*   **Robust Slug Resolution:** The most critical part of an internal linking plugin is accurately resolving the `[[Link Text]]` to the correct URL slug. This often requires a pre-built map of all your content titles to their slugs. This map should be generated during the build process and made available to the Remark plugin.
*   **Handle Missing Links Gracefully:** Decide how your plugin should behave if a `[[Link Text]]` does not correspond to an existing note or concept. Options include:
    *   Rendering it as plain text.
    *   Rendering it as a link with a special class (e.g., `broken-link`) that you can style differently.
    *   Logging a warning during the build process.
*   **Performance:** For very large gardens, consider the performance implications of your plugin. Efficient regex and AST traversal are important.
*   **Error Handling:** Implement error handling for unexpected scenarios.
*   **Testing:** Thoroughly test your plugin with various link formats and edge cases.

## Code Example

**Action:** Create a Remark plugin file and integrate it into your `astro.config.mjs` MDX configuration.

### 1. Create a Remark Plugin File

Create a file named `src/lib/remark-internal-links.js`. You might need to create the `src/lib` directory first.

```javascript
// src/lib/remark-internal-links.js
import { visit } from 'unist-util-visit';
import { u } from 'unist-builder'; // Utility to build AST nodes

// This map would ideally be generated at build time and passed to the plugin
// For this example, we'll use a simplified hardcoded map.
// In a real scenario, you'd fetch all notes/concepts and build this map.
const slugMap = new Map([
  ['my first note', 'notes/my-first-note'],
  ['introduction to digital gardens', 'concepts/introduction-to-digital-gardens'],
  ['atomic notes explained', 'notes/atomic-notes-explained'],
]);

export default function remarkInternalLinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /\[\[(.*?)\]\]/g;
      let match;
      let lastIndex = 0;
      const newNodes = [];

      while ((match = regex.exec(node.value)) !== null) {
        const fullMatch = match[0]; // e.g., "[[My Note]]"
        const linkText = match[1]; // e.g., "My Note"
        const start = match.index;
        const end = regex.lastIndex;

        // Add text before the link
        if (start > lastIndex) {
          newNodes.push(u('text', node.value.substring(lastIndex, start)));
        }

        // Resolve the link text to a slug
        const resolvedSlug = slugMap.get(linkText.toLowerCase());

        if (resolvedSlug) {
          // Create the link node if a slug is found
          newNodes.push(
            u('link', { url: `/${resolvedSlug}` }, [u('text', linkText)])
          );
        } else {
          // If no slug is found, render as plain text or a broken link
          console.warn(`Warning: Broken internal link found: [[${linkText}]]`);
          newNodes.push(u('text', fullMatch)); // Render as plain text
          // Or, to render as a broken link:
          // newNodes.push(
          //   u('html', `<span class="broken-link" title="Link not found: ${linkText}">${fullMatch}</span>`)
          // );
        }

        lastIndex = end;
      }

      // Add any remaining text after the last link
      if (lastIndex < node.value.length) {
        newNodes.push(u('text', node.value.substring(lastIndex)));
      }

      if (newNodes.length > 0) {
        // Replace the original text node with the new nodes
        parent.children.splice(index, 1, ...newNodes);
        // Return [visit.SKIP, index] to prevent visiting children of new nodes
        // and to continue processing from the current index in the parent's children array.
        return [visit.SKIP, index];
      }
    });
  };
}
```

**Note on `slugMap`:** In a production environment, you would dynamically generate `slugMap` by reading all your content collections at build time. This ensures that your links are always up-to-date with your content. You could create a separate utility function that generates this map and then import it here, or even pass it as an option to the Remark plugin if you create a custom Astro integration.

### 2. Integrate the Remark Plugin into `astro.config.mjs`

Update your `astro.config.mjs` file to include the `remarkInternalLinks` plugin in the `remarkPlugins` array within the `mdx()` integration.

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkInternalLinks from './src/lib/remark-internal-links.js'; // Import your plugin

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
    mdx({
      // Add your custom Remark plugin here
      remarkPlugins: [
        remarkInternalLinks,
        // Add other Remark plugins here if needed
      ],
    }),
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

With this setup, any `[[Link Text]]` you use in your MDX files will be transformed into proper HTML links, making your digital garden truly interconnected.