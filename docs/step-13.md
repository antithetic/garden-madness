# Step 13: MDX Components

## Explanation

MDX (Markdown + JSX) is a powerful format that allows you to seamlessly embed interactive components directly within your Markdown content. This is incredibly useful for a digital garden, as it enables you to go beyond static text and create rich, dynamic, and visually engaging notes and concepts.

Instead of just plain text, you can:

*   **Embed Interactive Elements:** Include charts, graphs, interactive diagrams, or even small applications directly within your notes.
*   **Create Reusable Content Blocks:** Define custom components for common elements like callouts, warnings, code blocks with special features, or image galleries.
*   **Enhance Readability:** Use components to break up long sections of text, highlight important information, or present data in a more digestible format.

By creating custom MDX components, you empower yourself to build a more expressive and functional digital garden, where content is not just consumed but can also be interacted with.

## Best Practices

*   **Keep Components Focused:** Design your MDX components to do one thing well. This makes them easier to understand, test, and reuse.
*   **Pass Props:** Use props to make your components flexible and configurable. For example, a `Callout` component might take a `type` prop (`info`, `warning`, `error`) to change its styling.
*   **Styling:** Style your components using Tailwind CSS or your preferred CSS methodology to ensure they integrate seamlessly with your site's design.
*   **Accessibility:** Ensure your custom components are accessible. Use semantic HTML, provide `alt` text for images, and consider keyboard navigation.
*   **Documentation:** Document your custom MDX components, explaining their purpose, props, and how to use them in your Markdown files.
*   **Component Location:** Store your MDX components in a dedicated directory (e.g., `src/components`) for easy organization and import.

## Code Example

**Action:** Define and use custom Astro/React/Vue components within your MDX.

### 1. Create Custom Components

Let's create a simple `Callout` component that can display different types of messages (info, warning, error).

Create a file `src/components/Callout.astro`:

```astro
---
// src/components/Callout.astro
interface Props {
  type?: 'info' | 'warning' | 'error';
}

const { type = 'info' } = Astro.props;

let bgColor = 'bg-blue-100';
let textColor = 'text-blue-800';
let borderColor = 'border-blue-400';

switch (type) {
  case 'warning':
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    borderColor = 'border-yellow-400';
    break;
  case 'error':
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    borderColor = 'border-red-400';
    break;
  case 'info':
  default:
    // Default values already set
    break;
}
---

<div class={`p-4 rounded-md border-l-4 ${bgColor} ${borderColor}`}>
  <div class={`flex items-center ${textColor}`}>
    <div class="flex-shrink-0 mr-3">
      {/* You can add icons here based on type */}
      {type === 'info' && (
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 001-1V9a1 1 0 10-2 0v1H9V9z" clip-rule="evenodd" />
        </svg>
      )}
      {type === 'warning' && (
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0L14.5 10.5a1.5 1.5 0 01-1.299 2.25H6.799A1.5 1.5 0 015.5 10.5L8.257 3.099zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      )}
      {type === 'error' && (
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      )}
    </div>
    <div class="text-sm font-medium">
      <slot /> {/* This is where the content of the callout will be injected */}
    </div>
  </div>
</div>
```

### 2. Use Components in MDX

Once you have your components, you can import and use them directly in your `.mdx` files. Astro's MDX integration handles this automatically.

Update one of your sample MDX files, for example, `src/content/notes/my-first-note.mdx`:

```mdx
---
title: My First Note
description: This is an atomic note about something important.
tags: ["getting-started", "example", "atomic-notes"]
---

import Callout from '@components/Callout.astro';

This is the content of my first note. It can contain **Markdown** and even React components if MDX is enabled.

Atomic notes are fundamental building blocks in a digital garden. They focus on a single idea or piece of information, making them highly linkable and reusable.

<Callout type="info">
  Remember to keep your notes atomic for better linking and reusability.
</Callout>

Here's a link to a related concept: [[Introduction to Digital Gardens]]

### Key Takeaways

*   Atomic notes are single-idea focused.
*   They are highly linkable.
*   They form the foundation of a connected knowledge base.

<Callout type="warning">
  Be careful not to make your notes too long or cover too many topics.
</Callout>

<Callout type="error">
  Avoid circular dependencies in your note linking, as this can make navigation confusing.
</Callout>
```

When Astro builds this MDX file, it will render the `Callout` component with the specified `type` and inject the content between the `Callout` tags into its `<slot />`. This allows you to create rich, interactive, and consistently styled content blocks within your digital garden.

This approach significantly enhances the expressiveness of your content, moving beyond plain text to a more dynamic and engaging knowledge base.