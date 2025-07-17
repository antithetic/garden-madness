# Step 5: Create Dynamic Routes for Notes and Concepts

## Explanation

To display individual notes and concepts from your content collections, you need to create dynamic routes in Astro. Dynamic routes allow you to generate a page for each entry in a collection without manually creating a file for every single note or concept. Astro uses a special file naming convention for this: `[...slug].astro`.

When Astro encounters a file named `[...slug].astro` within your `src/pages` directory, it understands that this file should handle requests for any path that matches its pattern. The `...slug` part is a rest parameter that captures the entire path segment after the base directory (e.g., `/notes/my-first-note` would have `slug` as `my-first-note`).

Inside these dynamic route files, you use the `getStaticPaths()` function. This function is crucial for telling Astro which pages to generate at build time. It should return an array of objects, where each object has:

*   `params`: An object containing the dynamic route parameters (in this case, `slug`).
*   `props`: An object containing any data you want to pass to the page component (e.g., the content collection entry itself).

By using `getCollection('collection-name')`, you can fetch all entries from a specific content collection and then map them to the `params` and `props` required by `getStaticPaths()`. This ensures that every note and concept you add to your content collections will automatically get its own dedicated page.

## Best Practices

*   **`getStaticPaths` for SSG:** Always use `getStaticPaths` for content collections when you want to pre-render all your pages at build time (Static Site Generation - SSG). This is Astro's strength and provides excellent performance.
*   **Pass Full Entry:** It's often best practice to pass the entire content collection entry (`note` or `concept` object) as a prop to your page. This gives you access to both the `data` (frontmatter) and the `render()` method for the content.
*   **Clear Naming:** Name your dynamic route files clearly (e.g., `[...slug].astro`) within their respective collection subdirectories (e.g., `src/pages/notes/`).
*   **Layout Integration:** These dynamic pages will typically use a layout component (e.g., `NoteLayout.astro`, `ConceptLayout.astro`) to provide consistent styling and structure. We'll create these layouts in the next step.

## Code Example

**Action:** Create the following files:

*   `src/pages/notes/[...slug].astro`
*   `src/pages/concepts/[...slug].astro`

### Example `src/pages/notes/[...slug].astro`

This file will handle requests for individual notes, like `/notes/my-first-note`.

```astro
---
// src/pages/notes/[...slug].astro
import { getCollection } from 'astro:content';
import NoteLayout from '@layouts/NoteLayout.astro'; // We'll create this in Step 6

// getStaticPaths tells Astro which pages to generate at build time.
export async function getStaticPaths() {
  // Fetch all entries from the 'notes' content collection.
  const notes = await getCollection('notes');

  // Map each note entry to the required format for getStaticPaths.
  return notes.map((note) => ({
    params: { slug: note.slug }, // The slug is used to create the URL path (e.g., /notes/my-first-note)
    props: { note },             // Pass the entire note object as a prop to the page component
  }));
}

// Destructure the 'note' prop passed from getStaticPaths.
const { note } = Astro.props;

// Render the MDX content. The `Content` component contains the HTML generated from your MDX.
const { Content } = await note.render();
---

<NoteLayout frontmatter={note.data}>
  <Content />
</NoteLayout>
```

### Example `src/pages/concepts/[...slug].astro`

This file will handle requests for individual concepts, like `/concepts/introduction-to-digital-gardens`.

```astro
---
// src/pages/concepts/[...slug].astro
import { getCollection } from 'astro:content';
import ConceptLayout from '@layouts/ConceptLayout.astro'; // We'll create this in Step 6

// getStaticPaths tells Astro which pages to generate at build time.
export async function getStaticPaths() {
  // Fetch all entries from the 'concepts' content collection.
  const concepts = await getCollection('concepts');

  // Map each concept entry to the required format for getStaticPaths.
  return concepts.map((concept) => ({
    params: { slug: concept.slug }, // The slug is used to create the URL path
    props: { concept },             // Pass the entire concept object as a prop
  }));
}

// Destructure the 'concept' prop passed from getStaticPaths.
const { concept } = Astro.props;

// Render the MDX content.
const { Content } = await concept.render();
---

<ConceptLayout frontmatter={concept.data}>
  <Content />
</ConceptLayout>
```

These dynamic route files are the bridge between your raw content files and the publicly accessible pages of your digital garden. They ensure that every piece of content you create in your collections automatically gets a dedicated URL.