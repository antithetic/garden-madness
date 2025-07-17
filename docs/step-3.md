# Step 3: Create Sample MDX Files

## Explanation

After defining your content collections and creating the necessary directories, the next logical step is to populate them with some sample content. This serves several purposes:

*   **Verification:** It allows you to immediately test if your content collection setup is working correctly. If Astro can read and process these files, you're on the right track.
*   **Development Data:** These sample files provide concrete data that you can use during the development of your display components (layouts and pages). You won't have to wait for actual content to be written.
*   **Understanding Frontmatter:** By creating these files, you'll get hands-on experience with how frontmatter (the YAML block at the top of your Markdown/MDX files) corresponds to the schemas you defined in `astro.config.mjs`.

For your digital garden, you'll create sample `.mdx` files for both `notes` and `concepts` collections. These files will include frontmatter fields that match your defined schemas (e.g., `title`, `description`, `tags` for notes; `title`, `summary`, `relatedNotes` for concepts).

## Best Practices

*   **Match Schema:** Ensure the frontmatter in your sample files strictly adheres to the `zod` schemas defined in `astro.config.mjs`. Incorrect types or missing required fields will cause validation errors.
*   **Realistic Content:** While they are samples, try to make the content somewhat realistic. This will help you visualize how your layouts will look with actual data.
*   **Include Links:** For the purpose of testing future linking and backlinking features, include some internal links using the `[[Link Text]]` syntax in your sample MDX files.
*   **MDX Features:** If you plan to use advanced MDX features (like importing React components), include a simple example in your sample files to ensure the MDX integration is working.

## Code Example

**Action:** Create sample `.mdx` files in each directory.

### Example `src/content/notes/my-first-note.mdx`

This note demonstrates basic frontmatter and an internal link to a concept.

```mdx
---
title: My First Note
description: This is an atomic note about something important.
tags: ["getting-started", "example", "atomic-notes"]
---

This is the content of my first note. It can contain **Markdown** and even React components if MDX is enabled.

Atomic notes are fundamental building blocks in a digital garden. They focus on a single idea or piece of information, making them highly linkable and reusable.

Here's a link to a related concept: [[Introduction to Digital Gardens]]

### Key Takeaways

*   Atomic notes are single-idea focused.
*   They are highly linkable.
*   They form the foundation of a connected knowledge base.
```

### Example `src/content/concepts/introduction-to-digital-gardens.mdx`

This concept provides an overview and links to related notes.

```mdx
---
title: Introduction to Digital Gardens
summary: A high-level overview of what digital gardens are and their benefits.
relatedNotes: ["my-first-note", "atomic-notes-explained"]
---

A digital garden is a personal website that serves as a living, evolving collection of thoughts, ideas, and knowledge. Unlike a blog, which is typically chronological and polished, a digital garden is more like a public notebook, where ideas are cultivated and grow over time.

It emphasizes the process of learning and connecting ideas, rather than presenting finished articles. This approach encourages continuous refinement and discovery.

### Core Principles

*   **Growth over Perfection:** Content is allowed to evolve and change.
*   **Interconnectedness:** Ideas are linked to show relationships.
*   **Public by Default:** Sharing knowledge openly fosters learning.

This concept is closely related to [[My First Note]] and the idea of [[Atomic Notes Explained]].
```

### Example `src/content/notes/atomic-notes-explained.mdx` (Optional, but good for testing `relatedNotes`)

```mdx
---
title: Atomic Notes Explained
description: A detailed look into the concept of atomic notes.
tags: ["notes", "methodology"]
---

Atomic notes are the smallest, most fundamental units of knowledge in a digital garden. Each note should ideally contain only one idea, concept, or piece of information. This singular focus makes them incredibly versatile and easy to link.

### Why Atomic?

*   **Reusability:** A single idea can be referenced from many different contexts.
*   **Clarity:** Each note is concise and to the point, reducing cognitive load.
*   **Linkability:** The clear boundaries of an atomic note make it easy to form precise connections to other notes and concepts.

This note expands on ideas first touched upon in [[My First Note]].
```

Create these files in their respective directories (`src/content/notes/` and `src/content/concepts/`). You can use your text editor or the command line for this. For instance:

```bash
# From your project root
# For my-first-note.mdx
cat <<EOF > src/content/notes/my-first-note.mdx
---
title: My First Note
description: This is an atomic note about something important.
tags: ["getting-started", "example", "atomic-notes"]
---

This is the content of my first note. It can contain **Markdown** and even React components if MDX is enabled.

Atomic notes are fundamental building blocks in a digital garden. They focus on a single idea or piece of information, making them highly linkable and reusable.

Here's a link to a related concept: [[Introduction to Digital Gardens]]

### Key Takeaways

*   Atomic notes are single-idea focused.
*   They are highly linkable.
*   They form the foundation of a connected knowledge base.
EOF

# For introduction-to-digital-gardens.mdx
cat <<EOF > src/content/concepts/introduction-to-digital-gardens.mdx
---
title: Introduction to Digital Gardens
summary: A high-level overview of what digital gardens are and their benefits.
relatedNotes: ["my-first-note", "atomic-notes-explained"]
---

A digital garden is a personal website that serves as a living, evolving collection of thoughts, ideas, and knowledge. Unlike a blog, which is typically chronological and polished, a digital garden is more like a public notebook, where ideas are cultivated and grow over time.

It emphasizes the process of learning and connecting ideas, rather than presenting finished articles. This approach encourages continuous refinement and discovery.

### Core Principles

*   **Growth over Perfection:** Content is allowed to evolve and change.
*   **Interconnectedness:** Ideas are linked to show relationships.
*   **Public by Default:** Sharing knowledge openly fosters learning.

This concept is closely related to [[My First Note]] and the idea of [[Atomic Notes Explained]].
EOF

# For atomic-notes-explained.mdx
cat <<EOF > src/content/notes/atomic-notes-explained.mdx
---
title: Atomic Notes Explained
description: A detailed look into the concept of atomic notes.
tags: ["notes", "methodology"]
---

Atomic notes are the smallest, most fundamental units of knowledge in a digital garden. Each note should ideally contain only one idea, concept, or piece of information. This singular focus makes them incredibly versatile and easy to link.

### Why Atomic?

*   **Reusability:** A single idea can be referenced from many different contexts.
*   **Clarity:** Each note is concise and to the point, reducing cognitive load.
*   **Linkability:** The clear boundaries of an atomic note make it easy to form precise connections to other notes and concepts.

This note expands on ideas first touched upon in [[My First Note]].
EOF
```

These sample files will be essential for testing the next steps of the integration plan, especially when you start displaying content and implementing linking features.