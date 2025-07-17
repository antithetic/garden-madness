# Step 10: Search Functionality

## Explanation

As your digital garden grows, finding specific notes or concepts can become challenging. Implementing a search functionality allows users to quickly locate relevant content by typing keywords. For a static site like an Astro digital garden, client-side search is a common and efficient approach. This means the search index is built during the site generation process, and the search logic runs directly in the user's browser, without needing a backend server.

The process typically involves:

1.  **Building a Search Index:** During the Astro build process, you'll iterate through all your notes and concepts. For each piece of content, you'll extract relevant information (like title, slug, and a portion of the content) and format it into a lightweight JSON object. This collection of JSON objects forms your search index.
2.  **Choosing a Client-Side Search Library:** Libraries like `Lunr.js` or `FlexSearch` are excellent choices. They are optimized for in-browser search, providing fast and efficient results.
3.  **Creating a Search UI:** You'll need an Astro component that includes an input field for the search query and a dynamic area to display the search results as the user types.

## Best Practices

*   **Index Relevant Data:** Only include data in your search index that is necessary for search. Over-indexing can lead to larger file sizes and slower search performance.
*   **Pre-build Index:** Always generate your search index during the build process. This ensures the index is always up-to-date with your latest content.
*   **Debounce Input:** For a live search experience, debounce the user's input to avoid excessive search operations as they type. This improves performance and responsiveness.
*   **Clear Results Display:** Present search results clearly, showing the title and a brief snippet of the matching content, along with a link to the full note/concept.
*   **Accessibility:** Ensure your search input and results are accessible to users with disabilities (e.g., proper ARIA attributes).

## Code Example

**Action:** Integrate a client-side search library and build a search index.

### 1. Choose a Library and Install

For this example, we'll use `Lunr.js` due to its simplicity and effectiveness for static sites. Install it:

```bash
pnpm add lunr
```

### 2. Build Search Index (Build-time)

Create a utility file, e.g., `src/lib/generate-search-index.js`. This script will run during your build process to create `search-index.json`.

```javascript
// src/lib/generate-search-index.js
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import lunr from 'lunr';

export async function generateSearchIndex() {
  console.log('Generating search index...');

  const allContent = [
    ...(await getCollection('notes')),
    ...(await getCollection('concepts')),
  ];

  const documents = [];
  const store = {}; // To store the actual content for display in search results

  for (const entry of allContent) {
    const { Content } = await entry.render();
    const textContent = Content.toString(); // Get the raw text content

    const id = entry.slug; // Use slug as unique ID
    const title = entry.data.title;
    const description = entry.data.description || entry.data.summary || '';

    documents.push({
      id: id,
      title: title,
      description: description,
      content: textContent, // Index the full content
    });

    store[id] = {
      title: title,
      description: description,
      url: `/${entry.collection}/${entry.slug}`, // e.g., /notes/my-first-note
    };
  }

  // Create the Lunr index
  const idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 }); // Boost title matches
    this.field('description');
    this.field('content');

    documents.forEach(doc => {
      this.add(doc);
    });
  });

  // Combine the Lunr index and the store into a single object
  const searchData = {
    index: idx.toJSON(),
    store: store,
  };

  // Define the output path for the search index JSON file
  const outputPath = path.resolve(process.cwd(), 'src/data/search-index.json');

  // Ensure the directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Write the search data to the JSON file
  await fs.writeFile(outputPath, JSON.stringify(searchData, null, 2));

  console.log('Search index generated successfully!');
}

// To run this during the build process, update your package.json scripts:
// "dev": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && node -r @astrojs/compiler/register src/lib/generate-search-index.js && astro dev",
// "build": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && node -r @astrojs/compiler/register src/lib/generate-search-index.js && astro build",
```

### 3. Create Search UI (Astro Component)

Create an Astro component, e.g., `src/components/Search.astro`, that handles the search input and displays results. This component will be client-side interactive, so it needs to be a client component (e.g., `client:load`).

```astro
---
// src/components/Search.astro
import { useState, useEffect } from 'react'; // Or use Preact, Vue, Svelte, etc.
import lunr from 'lunr';

// We'll load the search index dynamically on the client side
let searchIndex: lunr.Index | null = null;
let searchStore: Record<string, { title: string; description: string; url: string }> = {};

const loadSearchData = async () => {
  if (!searchIndex) {
    const response = await fetch('/src/data/search-index.json'); // Adjust path if needed
    const data = await response.json();
    searchIndex = lunr.Index.load(data.index);
    searchStore = data.store;
  }
};

// This component will be rendered on the client side
// Add `client:load` to the component when using it in your Astro pages/layouts
---

<script is:inline>
  // Inline script to ensure the search data is loaded before the component mounts
  // This is a simplified approach. For more complex apps, consider a dedicated data store.
  window.searchDataPromise = window.searchDataPromise || fetch('/src/data/search-index.json').then(res => res.json());
</script>

<div class="relative w-full max-w-md mx-auto">
  <input
    type="text"
    placeholder="Search notes and concepts..."
    class="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    id="search-input"
  />
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <div id="search-results" class="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg mt-2 max-h-80 overflow-y-auto hidden">
    <!-- Search results will be injected here by JavaScript -->
  </div>
</div>

<script type="module">
  import lunr from 'lunr';

  const searchInput = document.getElementById('search-input');
  const searchResultsDiv = document.getElementById('search-results');

  let searchIndex = null;
  let searchStore = {};

  // Load search data once
  window.searchDataPromise.then(data => {
    searchIndex = lunr.Index.load(data.index);
    searchStore = data.store;
  });

  let debounceTimeout;

  searchInput.addEventListener('input', (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const query = event.target.value.trim();
      if (query.length > 1 && searchIndex) {
        const results = searchIndex.search(query);
        displayResults(results);
      } else {
        searchResultsDiv.innerHTML = '';
        searchResultsDiv.classList.add('hidden');
      }
    }, 300); // Debounce for 300ms
  });

  function displayResults(results) {
    if (results.length === 0) {
      searchResultsDiv.innerHTML = '<p class="p-4 text-gray-500 dark:text-gray-400">No results found.</p>';
      searchResultsDiv.classList.remove('hidden');
      return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('divide-y', 'divide-gray-200', 'dark:divide-gray-700');

    results.forEach(result => {
      const item = searchStore[result.ref];
      if (item) {
        const li = document.createElement('li');
        li.classList.add('p-4', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'cursor-pointer');
        li.innerHTML = `
          <a href="${item.url}" class="block">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${item.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${item.description.substring(0, 150)}...</p>
          </a>
        `;
        ul.appendChild(li);
      }
    });

    searchResultsDiv.innerHTML = '';
    searchResultsDiv.appendChild(ul);
    searchResultsDiv.classList.remove('hidden');
  }

  // Hide results when clicking outside
  document.addEventListener('click', (event) => {
    if (!searchResultsDiv.contains(event.target) && event.target !== searchInput) {
      searchResultsDiv.classList.add('hidden');
    }
  });

  // Show results when input is focused and has content
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 1 && searchResultsDiv.innerHTML !== '') {
      searchResultsDiv.classList.remove('hidden');
    }
  });
</script>
```

**Note:** The `Search.astro` component above uses plain JavaScript for simplicity. For a more robust and maintainable solution, especially if you're already using a UI framework like React, Vue, or Svelte, you would typically build this component using that framework and then use Astro's `client:` directives (e.g., `client:load`, `client:idle`) to hydrate it on the client side.

### 4. Integrate Search Component into Layout

Add the `Search.astro` component to your main `Layout.astro` or a header component so it's available across your site.

```astro
---
// src/layouts/Layout.astro (updated)
import "@styles/global.css";
import Search from "@components/Search.astro"; // Import the Search component
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro Digital Garden</title>
  </head>
  <body>
    <header class="py-4 border-b border-gray-200 dark:border-gray-700">
      <nav class="container mx-auto flex justify-between items-center px-4">
        <a href="/" class="text-2xl font-bold text-gray-900 dark:text-white">Garden Madness</a>
        <div class="flex items-center space-x-4">
          <Search client:load /> {/* Add the search component here, client:load for interactivity */}
          <a href="/notes" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Notes</a>
          <a href="/concepts" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Concepts</a>
        </div>
      </nav>
    </header>
    <slot />
  </body>
</html>

<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

With these steps, your digital garden will now have a functional client-side search, making it much easier for users to navigate and find information within your growing knowledge base.