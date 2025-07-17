# Step 9: Backlinks Implementation

## Explanation

Backlinks are a fundamental feature of a digital garden, providing a powerful way to discover connections between your notes and concepts. A backlink on a given note (let's say "Note A") shows you all other notes or concepts that link *to* "Note A." This creates a bidirectional link, allowing you to navigate your knowledge graph in reverse.

Implementing backlinks involves two main parts:

1.  **Collecting Backlink Data (Build-time):** Since Astro is a static site generator, you need to analyze all your content files during the build process to identify all internal links. For every link found, you record which document (the *source*) links to which other document (the *target*). This data is then stored in a structured format (e.g., a JSON file) that can be easily accessed by your Astro components.
2.  **Displaying Backlinks (Astro Component):** You'll create an Astro component that reads this pre-generated backlink data. When rendered on a specific note or concept page, it will query the data to find all documents that link to the current page and display them as a list.

This build-time approach ensures that your backlinks are always accurate and performant, as the heavy lifting of parsing and mapping is done once during the build, not on every page request.

## Best Practices

*   **Automate Data Collection:** Integrate the backlink data collection into your build script or, ideally, as a custom Astro integration. This ensures the data is always up-to-date whenever your site is built.
*   **Efficient Data Structure:** Choose a data structure for your backlinks that allows for quick lookups. A JavaScript object (or JSON) where keys are target slugs and values are arrays of source slugs is efficient.
*   **Clear UI:** Present backlinks in a clear and unobtrusive way on your pages. A dedicated section, perhaps at the bottom of the content, is common.
*   **Link Resolution:** Ensure the displayed backlink titles are user-friendly (e.g., the actual title of the note/concept, not just its slug).
*   **Handle No Backlinks:** Gracefully handle cases where a note or concept has no incoming links.

## Code Example

**Action:** Implement a build-time process to collect backlink data and an Astro component to display it. Then, integrate this component into your layouts.

### 1. Collect Backlink Data (Build-time)

Create a utility file, e.g., `src/lib/generate-backlinks.js`. This script will be responsible for reading all your content, parsing internal links, and generating a `backlinks.json` file.

```javascript
// src/lib/generate-backlinks.js
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

export async function generateBacklinks() {
  console.log('Generating backlinks...');

  // Get all entries from both notes and concepts collections
  const allContent = [
    ...(await getCollection('notes')),
    ...(await getCollection('concepts')),
  ];

  // Create a map from title (lowercase) to slug for easy lookup
  const titleToSlugMap = new Map();
  allContent.forEach(entry => {
    titleToSlugMap.set(entry.data.title.toLowerCase(), entry.slug);
  });

  // Initialize the backlinks object: { targetSlug: [sourceSlug1, sourceSlug2, ...] }
  const backlinks = {};

  for (const entry of allContent) {
    // Render the content to get the raw text, which we'll parse for links
    const { Content } = await entry.render();
    const textContent = Content.toString(); // Convert MDX content to string

    // Regex to find [[Link Text]] patterns
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    while ((match = regex.exec(textContent)) !== null) {
      const linkedTitle = match[1];
      // Resolve the linked title to its actual slug using the map
      const targetSlug = titleToSlugMap.get(linkedTitle.toLowerCase());

      if (targetSlug) {
        // If the target slug exists, add the current entry's slug as a backlink
        if (!backlinks[targetSlug]) {
          backlinks[targetSlug] = [];
        }
        // Ensure no duplicate backlinks from the same source
        if (!backlinks[targetSlug].includes(entry.slug)) {
          backlinks[targetSlug].push(entry.slug);
        }
      } else {
        console.warn(`Warning: Unresolved internal link '[[${linkedTitle}]]' in ${entry.slug}`);
      }
    }
  }

  // Define the output path for the backlinks JSON file
  const outputPath = path.resolve(process.cwd(), 'src/data/backlinks.json');

  // Ensure the directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Write the backlinks data to the JSON file
  await fs.writeFile(outputPath, JSON.stringify(backlinks, null, 2));

  console.log('Backlinks generated successfully!');
}

// To run this during the build process, you can add it to your package.json scripts
// or create a custom Astro integration that calls this function.
// For now, you could manually run it before `astro build` or `astro dev`:
// node -r @astrojs/compiler/register src/lib/generate-backlinks.js
// (Note: The -r @astrojs/compiler/register is needed to allow Node.js to import Astro files)
```

**How to run `generateBacklinks()`:**

For development, you can add a script to your `package.json`:

```json
// package.json
{
  // ...
  "scripts": {
    "dev": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && astro dev",
    "build": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && astro build",
    // ...
  },
  // ...
}
```

This ensures that `backlinks.json` is generated before `astro dev` or `astro build` runs. You might need to install `@astrojs/compiler` as a dev dependency: `pnpm add -D @astrojs/compiler`.

### 2. Display Backlinks (Astro Component)

Create an Astro component, e.g., `src/components/Backlinks.astro`, that reads the generated `backlinks.json` and displays the relevant links.

```astro
---
// src/components/Backlinks.astro
import backlinksData from '../data/backlinks.json'; // Adjust path as needed
import { getCollection } from 'astro:content';

interface Props {
  currentSlug: string; // The slug of the current note/concept being viewed
}

const { currentSlug } = Astro.props;

// Fetch all content again to resolve titles from slugs for display
const allContent = [
  ...(await getCollection('notes')),
  ...(await getCollection('concepts')),
];

// Create a map from slug to title for easy lookup
const slugToTitleMap = new Map(allContent.map(entry => [entry.slug, entry.data.title]));

// Get incoming links for the current slug
const incomingLinks = backlinksData[currentSlug] || [];
---

{incomingLinks.length > 0 && (
  <section class="mt-12 border-t pt-8 border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-semibold mb-4">Linked References</h2>
    <ul class="list-disc pl-5 space-y-2">
      {incomingLinks.map((slug) => {
        // Determine if the slug belongs to a note or a concept for correct URL construction
        const collectionType = slug.startsWith('notes/') ? 'notes' : 'concepts';
        const displayTitle = slugToTitleMap.get(slug) || slug; // Fallback to slug if title not found
        return (
          <li>
            <a href={`/${collectionType}/${slug}`} class="text-blue-600 hover:underline dark:text-blue-400">
              {displayTitle}
            </a>
          </li>
        );
      })}
    </ul>
  </section>
)}
```

### 3. Integrate Backlinks Component into Layouts

Finally, add the `Backlinks.astro` component to your `NoteLayout.astro` and `ConceptLayout.astro` files. This will ensure that backlinks are displayed on every individual note and concept page.

**Action:** Update `src/layouts/NoteLayout.astro` and `src/layouts/ConceptLayout.astro`.

#### Update `src/layouts/NoteLayout.astro`

```astro
---
// src/layouts/NoteLayout.astro (updated)
import "@styles/global.css";
import Layout from "@layouts/Layout.astro";
import Backlinks from "@components/Backlinks.astro"; // Import Backlinks component

interface Props {
  frontmatter: {
    title: string;
    description?: string;
    tags?: string[];
  };
}

const { frontmatter } = Astro.props;

// Get the current slug from the URL pathname
// Example: /notes/my-first-note -> notes/my-first-note
const currentSlug = Astro.url.pathname.substring(1); // Remove leading slash
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
      <slot />
    </div>
    <Backlinks currentSlug={currentSlug} /> {/* Add Backlinks component here */}
  </article>
</Layout>
```

#### Update `src/layouts/ConceptLayout.astro`

```astro
---
// src/layouts/ConceptLayout.astro (updated)
import "@styles/global.css";
import Layout from "@layouts/Layout.astro";
import Backlinks from "@components/Backlinks.astro"; // Import Backlinks component

interface Props {
  frontmatter: {
    title: string;
    summary?: string;
    relatedNotes?: string[];
  };
}

const { frontmatter } = Astro.props;

// Get the current slug from the URL pathname
// Example: /concepts/introduction-to-digital-gardens -> concepts/introduction-to-digital-gardens
const currentSlug = Astro.url.pathname.substring(1); // Remove leading slash
---

<Layout>
  <article class="prose lg:prose-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {frontmatter.summary && <p class="text-lg text-gray-600 dark:text-gray-400">{frontmatter.summary}</p>}
    {frontmatter.relatedNotes && frontmatter.relatedNotes.length > 0 && (
      <div class="mb-4">
        <h2 class="text-2xl font-semibold mb-2">Related Notes</h2>
        <ul class="list-disc pl-5">
          {frontmatter.relatedNotes.map((noteSlug) => (
            <li>
              <a href={`/notes/${noteSlug}`} class="text-blue-600 hover:underline dark:text-blue-400">
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
    <Backlinks currentSlug={currentSlug} /> {/* Add Backlinks component here */}
  </article>
</Layout>
```

With these changes, your digital garden will now automatically display a list of all notes and concepts that link to the current page, significantly enhancing the discoverability and interconnectedness of your knowledge base.