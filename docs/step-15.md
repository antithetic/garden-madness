# Step 15: Dark Mode

## Explanation

Dark mode has become a popular feature in modern web applications, offering a more comfortable viewing experience in low-light conditions and potentially reducing eye strain. Implementing dark mode in your digital garden enhances user experience and provides a personalized browsing environment.

With Tailwind CSS, implementing dark mode is straightforward. Tailwind provides a `darkMode` configuration option, typically set to `class`. This means that when a specific class (by default, `dark`) is present on the `<html>` element, Tailwind will apply its `dark:` prefixed utility classes.

To enable dark mode, you'll need:

1.  **Tailwind Configuration:** Set `darkMode: 'class'` in your `tailwind.config.mjs`.
2.  **Toggle Mechanism:** A way for users to switch between light and dark modes. This usually involves a button that adds or removes the `dark` class from the `<html>` element using JavaScript.
3.  **Styling with `dark:` prefix:** Apply `dark:` prefixed utility classes to your elements to define their appearance in dark mode.

## Best Practices

*   **User Preference:** Respect the user's system preference for dark mode (e.g., using `prefers-color-scheme` media query) as a default, but still provide a manual toggle for override.
*   **Persistence:** Store the user's dark mode preference in `localStorage` so their choice persists across sessions.
*   **Smooth Transition:** Use CSS transitions for properties like `background-color` and `color` to create a smooth visual transition when switching modes.
*   **Contrast:** Ensure sufficient contrast between text and background colors in both light and dark modes for readability.
*   **Iconography:** Consider changing icon colors or even using different icons for dark mode if necessary.

## Code Example

**Action:** Implement a dark mode toggle.

### 1. Configure Tailwind CSS for Dark Mode

Open `tailwind.config.mjs` and add `darkMode: 'class'`.

```javascript
// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Enable dark mode based on the 'dark' class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 2. Create a Dark Mode Toggle Component

Create a new Astro component, e.g., `src/components/ThemeToggle.astro`. This component will handle the logic for switching themes and persisting the user's preference.

```astro
---
// src/components/ThemeToggle.astro
// This component will be interactive on the client side
---

<button
  id="theme-toggle"
  class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  aria-label="Toggle dark mode"
>
  <svg
    id="theme-toggle-light-icon"
    class="w-6 h-6 hidden dark:block"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 3.325l-.707.707M6.372 6.372l-.707-.707m12.728 0l-.707-.707M6.372 17.628l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    ></path>
  </svg>
  <svg
    id="theme-toggle-dark-icon"
    class="w-6 h-6 block dark:hidden"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
    ></path>
  </svg>
</button>

<script is:inline>
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Function to set the theme
  function setTheme(theme) {
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // On page load, apply the stored theme or system preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Toggle theme on button click
  themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  });
</script>
```

### 3. Integrate Theme Toggle into Layout

Add the `ThemeToggle.astro` component to your main `Layout.astro` or a header component.

```astro
---
// src/layouts/Layout.astro (updated snippet)
import "@styles/global.css";
import Search from "@components/Search.astro";
import ThemeToggle from "@components/ThemeToggle.astro"; // Import the ThemeToggle component
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
          <a href="/graph" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Graph</a>
          <a href="/tags" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Tags</a>
          <ThemeToggle client:load /> {/* Add the theme toggle here */}
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
    /* Add smooth transition for theme changes */
    transition: background-color 0.3s ease, color 0.3s ease;
  }
</style>
```

### 4. Apply Dark Mode Styles

Now, you can use Tailwind's `dark:` prefix to apply styles that only take effect when the `dark` class is present on the `<html>` element. You've already seen examples of this in previous steps (e.g., `dark:bg-gray-800`, `dark:text-white`). Continue applying these throughout your components and layouts to ensure a complete dark mode experience.

For example, in `src/styles/global.css`:

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply font-sans text-gray-800 bg-gray-50;
}

/* Dark mode styles */
html.dark body {
  @apply text-gray-200 bg-gray-900;
}

/* Add transitions for smooth theme changes */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

By following these steps, your digital garden will offer a fully functional dark mode, enhancing its usability and aesthetic appeal for all users.