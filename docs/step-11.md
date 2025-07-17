# Step 11: Graph Visualization

## Explanation

A graph visualization is a powerful way to understand the interconnectedness of your digital garden. It visually represents your notes and concepts as nodes and the links between them as edges. This can help you:

*   **Discover Relationships:** Easily spot connections you might not have noticed by just reading text.
*   **Identify Gaps:** See areas where your knowledge might be sparse or where more connections could be made.
*   **Navigate Intuitively:** Explore your garden by following visual paths rather than just linear links.

Implementing a graph visualization typically involves:

1.  **Choosing a JavaScript Library:** Libraries like `D3.js`, `Vis.js`, or `Mermaid.js` are popular choices. `D3.js` offers maximum flexibility but has a steeper learning curve. `Vis.js` is easier to get started with for interactive network graphs. `Mermaid.js` is great for generating diagrams from Markdown-like text, but less interactive.
2.  **Preparing Data:** The backlink data (and forward links) collected in Step 9 is crucial here. You'll need to transform this data into a format suitable for your chosen graph library, typically an array of `nodes` (your notes/concepts) and an array of `edges` (the links between them).
3.  **Creating a Graph Component:** This will be a client-side Astro component that initializes the graph library and renders the visualization. Since it's interactive, it will need to be hydrated on the client using Astro's `client:` directives.

## Best Practices

*   **Data Transformation:** Ensure your data transformation logic is robust and correctly maps your content collection entries and their links into the `nodes` and `edges` format required by your chosen library.
*   **Performance:** For very large gardens, consider strategies to optimize graph rendering performance, such as lazy loading, clustering, or filtering.
*   **Interactivity:** Provide interactive features like zooming, panning, and clicking on nodes to navigate to the corresponding note/concept.
*   **Styling:** Use CSS to style your graph elements (nodes, edges, labels) to make it visually appealing and easy to understand.
*   **Accessibility:** Consider how users with visual impairments might interact with the graph. Provide alternative text descriptions or tabular data if necessary.

## Code Example

**Action:** Use a JavaScript library to render a force-directed graph.

### 1. Choose a Library and Install

For this example, we'll use `Vis.js` (specifically `vis-network`) as it provides a good balance of features and ease of use for interactive network graphs. Install it:

```bash
pnpm add vis-network
```

### 2. Prepare Data

We'll extend the `generate-backlinks.js` script (or create a new one) to also generate a `graph-data.json` file that contains both nodes and edges. This will involve iterating through all content and creating both forward and backward links.

```javascript
// src/lib/generate-graph-data.js
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

export async function generateGraphData() {
  console.log('Generating graph data...');

  const allContent = [
    ...(await getCollection('notes')),
    ...(await getCollection('concepts')),
  ];

  const nodes = [];
  const edges = [];
  const slugToTitleMap = new Map();

  // First pass: Create nodes and a slug-to-title map
  allContent.forEach(entry => {
    const id = entry.slug;
    const title = entry.data.title;
    const group = entry.collection; // 'notes' or 'concepts'

    nodes.push({
      id: id,
      label: title,
      group: group,
      url: `/${group}/${id}`, // URL for navigation
    });
    slugToTitleMap.set(title.toLowerCase(), id); // For resolving links
  });

  // Second pass: Create edges (links)
  for (const entry of allContent) {
    const sourceId = entry.slug;
    const { Content } = await entry.render();
    const textContent = Content.toString();

    // Regex to find [[Link Text]] patterns
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    while ((match = regex.exec(textContent)) !== null) {
      const linkedTitle = match[1];
      const targetId = slugToTitleMap.get(linkedTitle.toLowerCase());

      if (targetId) {
        // Add a directed edge from source to target
        edges.push({
          from: sourceId,
          to: targetId,
          arrows: 'to',
        });
      }
    }
  }

  const graphData = {
    nodes: nodes,
    edges: edges,
  };

  const outputPath = path.resolve(process.cwd(), 'src/data/graph-data.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(graphData, null, 2));

  console.log('Graph data generated successfully!');
}

// Update your package.json scripts to run this:
// "dev": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && node -r @astrojs/compiler/register src/lib/generate-search-index.js && node -r @astrojs/compiler/register src/lib/generate-graph-data.js && astro dev",
// "build": "node -r @astrojs/compiler/register src/lib/generate-backlinks.js && node -r @astrojs/compiler/register src/lib/generate-search-index.js && node -r @astrojs/compiler/register src/lib/generate-graph-data.js && astro build",
```

### 3. Create Graph Component (Astro Component)

Create an Astro component, e.g., `src/components/KnowledgeGraph.astro`, that will render the `Vis.js` network. This component needs to be client-side interactive.

```astro
---
// src/components/KnowledgeGraph.astro
import { onMount } from 'astro';
import { Network } from 'vis-network';
import graphData from '../data/graph-data.json'; // Import the generated graph data

// Define options for the network graph
const options = {
  nodes: {
    shape: 'dot',
    size: 15,
    font: {
      size: 12,
      color: '#333',
    },
    borderWidth: 2,
  },
  edges: {
    width: 1,
    color: {
      color: '#ccc',
      highlight: '#888',
      hover: '#888',
      inherit: 'from',
      opacity: 0.5,
    },
    smooth: {
      type: 'continuous',
    },
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.5,
    },
    solver: 'barnesHut',
  },
  interaction: {
    navigationButtons: true,
    keyboard: true,
  },
  groups: {
    notes: {
      color: { background: '#ADD8E6', border: '#6CB4EE' }, // Light blue
    },
    concepts: {
      color: { background: '#90EE90', border: '#3CB371' }, // Light green
    },
  },
};

// This script will run on the client side after the component is mounted
onMount(() => {
  const container = document.getElementById('knowledge-graph');
  if (container) {
    const network = new Network(container, graphData, options);

    // Add click event listener to navigate to the node's URL
    network.on('click', (properties) => {
      if (properties.nodes.length > 0) {
        const nodeId = properties.nodes[0];
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (node && node.url) {
          window.location.href = node.url;
        }
      }
    });
  }
});
---

<div id="knowledge-graph" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>

<style>
  /* Basic styling for the graph container */
  #knowledge-graph {
    background-color: #f9f9f9; /* Light background for the graph area */
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
```

### 4. Create a Page to Display the Graph

Create a new Astro page, e.g., `src/pages/graph.astro`, to display your knowledge graph.

```astro
---
// src/pages/graph.astro
import Layout from '@layouts/Layout.astro';
import KnowledgeGraph from '@components/KnowledgeGraph.astro';
---

<Layout>
  <main class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-5xl font-extrabold mb-8 text-center">Knowledge Graph</h1>
    <KnowledgeGraph client:load /> {/* Render the graph component on the client */}
  </main>
</Layout>
```

### 5. Add Navigation Link

Consider adding a link to your `graph.astro` page in your main navigation (e.g., in `src/layouts/Layout.astro` or a header component) so users can easily access the visualization.

```astro
---
// src/layouts/Layout.astro (updated snippet)
import "@styles/global.css";
import Search from "@components/Search.astro";
---

<!doctype html>
<html lang="en">
  <head>
    <!-- ... existing head content ... -->
  </head>
  <body>
    <header class="py-4 border-b border-gray-200 dark:border-gray-700">
      <nav class="container mx-auto flex justify-between items-center px-4">
        <a href="/" class="text-2xl font-bold text-gray-900 dark:text-white">Garden Madness</a>
        <div class="flex items-center space-x-4">
          <Search client:load />
          <a href="/notes" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Notes</a>
          <a href="/concepts" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Concepts</a>
          <a href="/graph" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Graph</a> {/* New link */}
        </div>
      </nav>
    </header>
    <slot />
  </body>
</html>

<!-- ... existing style ... -->
```

With these additions, your digital garden will feature an interactive knowledge graph, providing a unique and insightful way to explore the connections within your content.