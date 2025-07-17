# Step 2: Create Content Directories

## Explanation

Once you've defined your content collections in `astro.config.mjs`, Astro expects to find the actual content files within specific directories. By default, Astro looks for content collection files inside the `src/content/` directory, with subdirectories named after your collections.

For your digital garden, you've defined `notes` and `concepts` collections. Therefore, you need to create corresponding directories: `src/content/notes/` and `src/content/concepts/`.

This directory structure is crucial for Astro to correctly identify and process your content. It keeps your content organized and separate from your Astro pages, components, and layouts, promoting a clean project structure.

## Best Practices

*   **Follow Astro's Convention:** Always place content collection files within `src/content/<collection-name>/`. Deviating from this can lead to Astro not finding your content.
*   **Consistency:** Maintain a consistent file naming convention within each collection (e.g., `kebab-case` for slugs).
*   **Clear Separation:** Keep your content files (`.mdx`, `.md`) strictly within these content directories. Avoid mixing them with other source files like `.astro` components or `.ts` utility files.

## Code Example

To create these directories, you can use your operating system's file explorer or the command line.

**Action:** Create the following directories within your `src/content` folder:

```
src/
└── content/
    ├── notes/
    └── concepts/
```

**Using the command line (from your project root):**

```bash
mkdir -p src/content/notes
mkdir -p src/content/concepts
```

After executing these commands, your project structure should reflect the new directories, ready to house your digital garden's content.