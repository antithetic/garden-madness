# Step 6: Design Layouts for Notes and Concepts

## Explanation

Layouts in Astro are reusable components that define the overall structure and common elements of your pages. For your digital garden, you'll create specific layouts for `notes` and `concepts`. These layouts will be responsible for:

*   **Consistent Structure:** Ensuring all notes and concepts have a similar look and feel (e.g., title at the top, content area, metadata display).
*   **Displaying Frontmatter:** Accessing and rendering the `frontmatter` (metadata) from your content collection entries, such as `title`, `description`, `tags`, `summary`, and `relatedNotes`.
*   **Injecting Content:** Using the `<slot />` component to inject the actual MDX content (rendered from `note.render()` or `concept.render()`) into the defined structure.
*   **Styling:** Applying global styles and Tailwind CSS classes to format the content appropriately. The `prose` class from `@tailwindcss/typography` is particularly useful for styling raw Markdown/MDX content.

These layouts act as wrappers around your content, providing the necessary context and presentation without having to repeat the same HTML structure in every single MDX file.

## Best Practices

*   **Reusability:** Design your layouts to be as generic as possible while still serving their specific purpose. If there's common structure between `NoteLayout` and `ConceptLayout`, consider creating a more general base layout (like `Layout.astro` which you already have) that they both extend.
*   **Semantic HTML:** Use appropriate HTML5 semantic elements (`<article>`, `<section>`, `<header>`, `<footer>`) to improve accessibility and SEO.
*   **Responsive Design:** Ensure your layouts are responsive and look good on various screen sizes, leveraging Tailwind CSS utilities.
*   **Clear Props:** Clearly define the props your layouts expect (e.g., `frontmatter`) and use them to display dynamic data.
*   **Placeholder for Future Features:** Include comments or empty sections for features you plan to add later, like backlinks, to make integration easier.

## Code Example

**Action:** Create the following files:

*   `src/layouts/NoteLayout.astro`
*   `src/layouts/ConceptLayout.astro`

### Example `src/layouts/NoteLayout.astro`

This layout will be used for displaying individual notes. It includes the title, description, and tags from the note's frontmatter.

```astro
---
// src/layouts/NoteLayout.astro
import "@styles/global.css"; // Your global styles (e.g., from src/styles/global.css)
import Layout from "@layouts/Layout.astro"; // Your base layout (e.g., src/layouts/Layout.astro)

// Define the expected props for this layout
interface Props {
  frontmatter: {
    title: string;
    description?: string;
    tags?: string[];
  };
}

const { frontmatter } = Astro.props;
---

<Layout>
  <article class="prose lg:prose-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {frontmatter.description && <p class="text-lg text-gray-600 dark:text-gray-400">{frontmatter.description}</p>}
    {frontmatter.tags && frontmatter.tags.length > 0 && (
      <div class="flex flex-wrap gap-2 mb-4">
        {frontmatter.tags.map((tag) => (
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
            {tag}
          </span>
        ))}
      </div>
    )}
    <div class="note-content">
      <slot /> {/* This is where your MDX content will be injected */}
    </div>
    {/* Backlinks section will go here in Phase 3 (Step 8) */}
  </article>
</Layout>
```

### Example `src/layouts/ConceptLayout.astro`

This layout will be used for displaying individual concepts. It includes the title, summary, and a list of related notes from the concept's frontmatter.

```astro
---
// src/layouts/ConceptLayout.astro
import "@styles/global.css";
import Layout from "@layouts/Layout.astro";

// Define the expected props for this layout
interface Props {
  frontmatter: {
    title: string;
    summary?: string;
    relatedNotes?: string[];
  };
}

const { frontmatter } = Astro.props;
---

<Layout>
  <article class="prose lg:prose-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {frontmatter.summary && <p class="text-lg text-gray-600 dark:text-gray-400">{frontmatter.summary}</p>}
    {/* Display related notes if available */}
    {frontmatter.relatedNotes && frontmatter.relatedNotes.length > 0 && (
      <div class="mb-4">
        <h2 class="text-2xl font-semibold mb-2">Related Notes</h2>
        <ul class="list-disc pl-5">
          {frontmatter.relatedNotes.map((noteSlug) => (
            <li>
              {/* Note: This link assumes notes are at /notes/{slug}. Adjust if your routing differs. */}
              <a href={`/notes/${noteSlug}`} class="text-blue-600 hover:underline dark:text-blue-400">
                {/* Basic slug to title conversion for display. A more robust solution might fetch the actual title. */}
                {noteSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
    <div class="concept-content">
      <slot />
    </div>
    {/* Backlinks section will go here in Phase 3 (Step 8) */}
  </article>
</Layout>
```

These layouts provide the visual framework for your digital garden content. Remember to install `@tailwindcss/typography` if you plan to use the `prose` class for automatic styling of your Markdown content.