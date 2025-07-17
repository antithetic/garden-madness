# Digital Garden Integration Plan

This document outlines a comprehensive plan for integrating a digital garden into your Astro project, featuring "Notes" and "Concepts" content collections, internal linking, and backlinks.

## Phase 1: Basic Setup and Content Collections

This phase focuses on setting up the foundational structure for your digital garden's content.

### 1. Define Content Collections in `astro.config.mjs`

Astro's Content Collections provide a structured way to manage your content. You'll define `notes` and `concepts` collections, specifying their schemas for data validation and type safety.

**Action:** Modify `astro.config.mjs` to include the `collections` property within `defineConfig`.

**Example `astro.config.mjs` snippet:**

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Define the schema for your 'notes' collection
const notesCollection = defineCollection({
  type: 'content', // 'content' for Markdown/MDX, 'data' for JSON/YAML
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Add any other frontmatter fields you need for notes
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
  }),
});

export default defineConfig({
  integrations: [], // Add integrations here later
  vite: {
    plugins: [tailwindcss()],
  },
  collections: {
    notes: notesCollection,
    concepts: conceptsCollection,
  },
});
```

### 2. Create Content Directories

These directories will house your actual Markdown/MDX files for each collection.

**Action:** Create the following directories within your `src/content` folder:

```
src/
└── content/
    ├── notes/
    └── concepts/
```

### 3. Create Sample MDX Files

Populate your new content directories with some initial files to test your setup.

**Action:** Create sample `.mdx` files in each directory.

**Example `src/content/notes/my-first-note.mdx`:**

```mdx
---
title: My First Note
description: This is an atomic note about something important.
tags: ["getting-started", "example"]
---

This is the content of my first note. It can contain **Markdown** and even React components if MDX is enabled.

Here's a link to a concept: [[Introduction to Digital Gardens]]
```

**Example `src/content/concepts/introduction-to-digital-gardens.mdx`:**

```mdx
---
title: Introduction to Digital Gardens
summary: A high-level overview of what digital gardens are and their benefits.
relatedNotes: ["my-first-note", "atomic-notes-explained"]
---

A digital garden is a personal website that serves as a living, evolving collection of thoughts, ideas, and knowledge. Unlike a blog, which is typically chronological and polished, a digital garden is more like a public notebook, where ideas are cultivated and grow over time.
```

### 4. Install MDX Integration

Astro needs a specific integration to process MDX files.

**Action:** Install the `@astrojs/mdx` package and add it to your `astro.config.mjs`.

**Command:**

```bash
pnpm add @astrojs/mdx
```

**Action:** Update `astro.config.mjs` to include the MDX integration.

**Example `astro.config.mjs` snippet (updated):**

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx"; // Import MDX integration

// ... (your collection definitions remain the same) ...

export default defineConfig({
  integrations: [mdx()], // Add mdx() here
  vite: {
    plugins: [tailwindcss()],
  },
  collections: {
    notes: notesCollection,
    concepts: conceptsCollection,
  },
});
```

## Phase 2: Displaying Content

This phase focuses on rendering your content collections on your website.

### 1. Create Dynamic Routes for Notes and Concepts

Astro uses dynamic routes to generate pages for each item in your content collections.

**Action:** Create the following files:

*   `src/pages/notes/[...slug].astro`
*   `src/pages/concepts/[...slug].astro`

**Example `src/pages/notes/[...slug].astro`:**

```astro
---
import { getCollection } from 'astro:content';
import NoteLayout from '@layouts/NoteLayout.astro'; // We'll create this next

export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes.map((note) => ({
    params: { slug: note.slug },
    props: { note },
  }));
}

const { note } = Astro.props;
const { Content } = await note.render();
---

<NoteLayout frontmatter={note.data}>
  <Content />
</NoteLayout>
```

**Example `src/pages/concepts/[...slug].astro` (similar structure):**

```astro
---
import { getCollection } from 'astro:content';
import ConceptLayout from '@layouts/ConceptLayout.astro'; // We'll create this next

export async function getStaticPaths() {
  const concepts = await getCollection('concepts');
  return concepts.map((concept) => ({
    params: { slug: concept.slug },
    props: { concept },
  }));
}

const { concept } = Astro.props;
const { Content } = await concept.render();
---

<ConceptLayout frontmatter={concept.data}>
  <Content />
</ConceptLayout>
```

### 2. Design Layouts for Notes and Concepts

These layouts will define the visual structure for your individual notes and concepts, including displaying frontmatter and the main content.

**Action:** Create the following files:

*   `src/layouts/NoteLayout.astro`
*   `src/layouts/ConceptLayout.astro`

**Example `src/layouts/NoteLayout.astro`:**

```astro
---
import "@styles/global.css"; // Your global styles
import Layout from "@layouts/Layout.astro"; // Your base layout

const { frontmatter } = Astro.props;
---

<Layout>
  <article class="prose lg:prose-xl mx-auto py-8">
    <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {frontmatter.description && <p class="text-lg text-gray-600">{frontmatter.description}</p>}
    {frontmatter.tags && (
      <div class="flex flex-wrap gap-2 mb-4">
        {frontmatter.tags.map((tag) => (
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    )}
    <div class="note-content">
      <slot /> {/* This is where your MDX content will be injected */}
    </div>
    {/* Backlinks section will go here in Phase 3 */}
  </article>
</Layout>
```

**Example `src/layouts/ConceptLayout.astro` (similar structure, adapted for concepts):**

```astro
---
import "@styles/global.css";
import Layout from "@layouts/Layout.astro";

const { frontmatter } = Astro.props;
---

<Layout>
  <article class="prose lg:prose-xl mx-auto py-8">
    <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {frontmatter.summary && <p class="text-lg text-gray-600">{frontmatter.summary}</p>}
    {/* Display related notes if available */}
    {frontmatter.relatedNotes && frontmatter.relatedNotes.length > 0 && (
      <div class="mb-4">
        <h2 class="text-2xl font-semibold mb-2">Related Notes</h2>
        <ul class="list-disc pl-5">
          {frontmatter.relatedNotes.map((noteSlug) => (
            <li><a href={`/notes/${noteSlug}`}>{noteSlug.replace(/-/g, ' ')}</a></li>
          ))}
        </ul>
      </div>
    )}
    <div class="concept-content">
      <slot />
    </div>
    {/* Backlinks section will go here in Phase 3 */}
  </article>
</Layout>
```

### 3. Create Index Pages for Collections

These pages will serve as entry points, listing all available notes and concepts.

**Action:** Create the following files:

*   `src/pages/notes/index.astro`
*   `src/pages/concepts/index.astro`

**Example `src/pages/notes/index.astro`:**

```astro
---
import Layout from '@layouts/Layout.astro';
import { getCollection } from 'astro:content';

const allNotes = await getCollection('notes');
---

<Layout>
  <main class="container mx-auto py-8">
    <h1 class="text-5xl font-extrabold mb-8">All Notes</h1>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allNotes.map((note) => (
        <li class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <a href={`/notes/${note.slug}`} class="block">
            <h2 class="text-2xl font-semibold text-blue-700 hover:text-blue-900 mb-2">
              {note.data.title}
            </h2>
            {note.data.description && <p class="text-gray-600 text-sm">{note.data.description}</p>}
            {note.data.tags && (
              <div class="flex flex-wrap gap-1 mt-3">
                {note.data.tags.map((tag) => (
                  <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        </li>
      ))}
    </ul>
  </main>
</Layout>
```

**Example `src/pages/concepts/index.astro` (similar structure):**

```astro
---
import Layout from '@layouts/Layout.astro';
import { getCollection } from 'astro:content';

const allConcepts = await getCollection('concepts');
---

<Layout>
  <main class="container mx-auto py-8">
    <h1 class="text-5xl font-extrabold mb-8">All Concepts</h1>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allConcepts.map((concept) => (
        <li class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <a href={`/concepts/${concept.slug}`} class="block">
            <h2 class="text-2xl font-semibold text-green-700 hover:text-green-900 mb-2">
              {concept.data.title}
            </h2>
            {concept.data.summary && <p class="text-gray-600 text-sm">{concept.data.summary}</p>}
          </a>
        </li>
      ))}
    </ul>
  </main>
</Layout>
```

## Phase 3: Linking and Backlinks

This phase is crucial for the "garden" aspect, enabling connections between your content.

### 1. Internal Linking

You'll want a convenient way to link between your notes and concepts using a simple syntax like `[[Note Title]]`. This requires a custom solution, often a Remark plugin for MDX.

**Action:** Create a Remark plugin to parse `[[...]]` syntax and convert it into standard HTML `<a>` tags.

**Steps:**

1.  **Create a Remark Plugin File:**
    *   Create a file like `src/lib/remark-internal-links.js`.

2.  **Implement the Plugin:**
    *   This plugin will traverse the MDX AST (Abstract Syntax Tree), find text nodes matching your internal link pattern, and replace them with link nodes. You'll need to resolve the link to the correct slug.

**Example `src/lib/remark-internal-links.js` (simplified concept):**

```javascript
import { visit } from 'unist-util-visit';
import { u } from 'unist-builder'; // Utility to build AST nodes

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

        // Create the link node
        // You'll need a way to resolve 'linkText' to an actual slug.
        // For now, we'll just use a placeholder.
        const slug = linkText.toLowerCase().replace(/\s+/g, '-'); // Basic slugification
        newNodes.push(
          u('link', { url: `/${slug}` }, [u('text', linkText)])
        );

        lastIndex = end;
      }

      // Add any remaining text after the last link
      if (lastIndex < node.value.length) {
        newNodes.push(u('text', node.value.substring(lastIndex)));
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return [visit.SKIP, index]; // Skip children of new nodes, continue from current index
      }
    });
  };
}
```

**Action:** Integrate the Remark plugin into your `astro.config.mjs` MDX configuration.

**Example `astro.config.mjs` snippet (MDX config with Remark plugin):**

```javascript
// astro.config.mjs
import { defineConfig, defineCollection, z } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkInternalLinks from './src/lib/remark-internal-links.js'; // Import your plugin

// ... (collection definitions) ...

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkInternalLinks], // Add your plugin here
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

**Important Note for Internal Linking:** The `remarkInternalLinks` plugin above is a simplified example. A robust solution would need to:
*   **Resolve Slugs:** During the build process, you'd need a map of all note/concept titles to their respective slugs to ensure links point to existing content. This map could be passed to the Remark plugin.
*   **Handle Missing Links:** Decide how to handle links to non-existent notes (e.g., render as plain text, or a special "broken link" style).

### 2. Backlinks Implementation

Backlinks show which other notes or concepts refer to the current one. This requires a build-time process to analyze all content.

**Action:** Implement a build-time process to collect backlink data and an Astro component to display it.

**Steps:**

1.  **Collect Backlink Data (Build-time):**
    *   This is the most complex part. You'll need a script or a custom Astro integration that runs during the build process.
    *   **Process:**
        1.  Read all notes and concepts.
        2.  Parse the content of each file to identify all internal links (e.g., using the same regex as your Remark plugin).
        3.  For each link found, record that the *source* document links to the *target* document.
        4.  Store this data in a structured format (e.g., a JSON file or a JavaScript object that can be imported). A good structure would be a map where keys are slugs and values are arrays of slugs that link to them.

    **Example `src/lib/generate-backlinks.js` (conceptual):**

    ```javascript
    import { getCollection } from 'astro:content';
    import fs from 'fs/promises';
    import path from 'path';

    export async function generateBacklinks() {
      const allContent = [
        ...(await getCollection('notes')),
        ...(await getCollection('concepts')),
      ];

      const backlinks = {}; // { targetSlug: [sourceSlug1, sourceSlug2, ...] }

      for (const entry of allContent) {
        const content = await entry.render(); // Get rendered content to parse
        const textContent = content.Content.toString(); // Convert MDX content to string

        const regex = /\[\[(.*?)\]\]/g;
        let match;

        while ((match = regex.exec(textContent)) !== null) {
          const linkedTitle = match[1];
          // You'll need a robust way to convert linkedTitle to its actual slug
          // For simplicity, let's assume a direct slugification for now
          const targetSlug = linkedTitle.toLowerCase().replace(/\s+/g, '-');

          if (!backlinks[targetSlug]) {
            backlinks[targetSlug] = [];
          }
          // Ensure no duplicates
          if (!backlinks[targetSlug].includes(entry.slug)) {
            backlinks[targetSlug].push(entry.slug);
          }
        }
      }

      // Write the backlinks data to a JSON file that can be imported by Astro components
      const outputPath = path.resolve(process.cwd(), 'src/data/backlinks.json');
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(backlinks, null, 2));

      console.log('Backlinks generated successfully!');
    }

    // You might call this function in a custom Astro integration or a build script.
    // For now, you could manually run it before `astro build` or `astro dev`.
    // A more integrated approach would be to create an Astro integration.
    ```

2.  **Display Backlinks (Astro Component):**
    *   Create an Astro component that reads the generated `backlinks.json` file and displays the relevant backlinks for the current page.

    **Action:** Create `src/components/Backlinks.astro`.

    **Example `src/components/Backlinks.astro`:**

    ```astro
    ---
    import backlinksData from '../data/backlinks.json'; // Adjust path as needed
    import { getCollection } from 'astro:content';

    const { currentSlug } = Astro.props;

    // Get all content to resolve titles from slugs
    const allContent = [
      ...(await getCollection('notes')),
      ...(await getCollection('concepts')),
    ];
    const slugToTitleMap = new Map(allContent.map(entry => [entry.slug, entry.data.title]));

    const incomingLinks = backlinksData[currentSlug] || [];
    ---

    {incomingLinks.length > 0 && (
      <section class="mt-12 border-t pt-8 border-gray-200">
        <h2 class="text-2xl font-semibold mb-4">Linked References</h2>
        <ul class="list-disc pl-5">
          {incomingLinks.map((slug) => (
            <li>
              <a href={`/${slug.startsWith('notes/') ? 'notes' : 'concepts'}/${slug}`} class="text-blue-600 hover:underline">
                {slugToTitleMap.get(slug) || slug}
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}
    ```

3.  **Integrate Backlinks Component into Layouts:**
    *   Add the `Backlinks.astro` component to your `NoteLayout.astro` and `ConceptLayout.astro`.

    **Example `src/layouts/NoteLayout.astro` (updated):**

    ```astro
    ---
    import "@styles/global.css";
    import Layout from "@layouts/Layout.astro";
    import Backlinks from "@components/Backlinks.astro"; // Import Backlinks component

    const { frontmatter } = Astro.props;
    const currentSlug = Astro.url.pathname.split('/').pop(); // Get current slug from URL
    ---

    <Layout>
      <article class="prose lg:prose-xl mx-auto py-8">
        <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
        {frontmatter.description && <p class="text-lg text-gray-600">{frontmatter.description}</p>}
        {frontmatter.tags && (
          <div class="flex flex-wrap gap-2 mb-4">
            {frontmatter.tags.map((tag) => (
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div class="note-content">
          <slot />
        </div>
        <Backlinks currentSlug={currentSlug} /> {/* Add Backlinks component */}
      </article>
    </Layout>
    ```

## Phase 4: Advanced Features (Optional but Recommended)

These features enhance the usability and discoverability of your digital garden.

### 1. Search Functionality

Allow users to search across all your notes and concepts.

**Action:** Integrate a client-side search library and build a search index.

**Steps:**

1.  **Choose a Library:** Popular choices include `Lunr.js` or `FlexSearch`.
2.  **Build Search Index:** During the build process (similar to backlinks), create a JSON file containing a simplified version of your content (title, slug, relevant text) that the search library can index.
3.  **Create Search UI:** Develop an Astro component with an input field and display search results dynamically.

### 2. Graph Visualization

Visually represent the connections between your notes and concepts.

**Action:** Use a JavaScript library to render a force-directed graph.

**Steps:**

1.  **Choose a Library:** `D3.js` (more complex, highly customizable), `Vis.js` (easier to get started), or `Mermaid.js` (for simpler diagrams).
2.  **Prepare Data:** The backlink data (and forward links) collected in Phase 3 is your graph data. You'll need to transform it into nodes (notes/concepts) and edges (links).
3.  **Create Graph Component:** Develop a client-side Astro component that initializes the graph library and renders the visualization.

### 3. Tags/Categories

Organize your content by topics.

**Action:** Extend your content schemas and create dynamic tag pages.

**Steps:**

1.  **Update Schemas:** Ensure your `notesCollection` schema includes `tags: z.array(z.string()).optional()`.
2.  **Create Tag Pages:**
    *   `src/pages/tags/[tag].astro`
    *   This page will use `getStaticPaths` to generate a page for each unique tag, listing all content associated with it.

### 4. MDX Components

Create reusable components for rich content within your MDX files.

**Action:** Define and use custom Astro/React/Vue components within your MDX.

**Steps:**

1.  **Create Components:** For example, `src/components/Callout.astro` or `src/components/Admonition.astro`.
2.  **Import in MDX:** You can import and use these components directly in your `.mdx` files.

    ```mdx
    ---
    title: My Note
    ---

    import Callout from '@components/Callout.astro';

    This is some regular content.

    <Callout type="info">
      This is an important piece of information.
    </Callout>
    ```

## Phase 5: Styling and Theming

Ensure your digital garden is visually appealing and user-friendly.

### 1. Tailwind CSS Integration

You already have Tailwind CSS set up. Focus on applying it effectively.

**Action:** Use Tailwind classes in your Astro components and layouts.

**Tips:**

*   Use `prose` plugin for styling Markdown content (`@tailwindcss/typography`).
*   Define custom colors and fonts in `tailwind.config.mjs`.

### 2. Dark Mode

Provide a comfortable viewing experience in different lighting conditions.

**Action:** Implement a dark mode toggle.

**Steps:**

1.  **Tailwind Dark Mode:** Configure Tailwind CSS for dark mode (e.g., `darkMode: 'class'`).
2.  **Toggle Logic:** Use JavaScript to add/remove a `dark` class on the `<html>` element, triggering Tailwind's dark mode styles.

## Implementation Steps (High-Level Summary):

1.  **Install necessary packages:** `@astrojs/mdx`, and any chosen libraries for search, graph visualization, etc.
2.  **Modify `astro.config.mjs`:** Define content collections with schemas and add the MDX integration with your Remark plugin.
3.  **Create content directories:** `src/content/notes` and `src/content/concepts`.
4.  **Develop Astro pages and layouts:** For individual notes/concepts (`[...slug].astro`) and their respective index pages (`index.astro`).
5.  **Implement internal linking:** Create and integrate the Remark plugin.
6.  **Implement backlink generation:** Write a build-time script to collect backlink data and an Astro component to display it.
7.  **Build optional features:** Search, graph visualization, tags, custom MDX components.
8.  **Style the application:** Leverage Tailwind CSS for a cohesive design, including dark mode.
