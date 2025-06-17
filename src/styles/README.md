# Market Assistant Platform - Design System

This directory contains the design system for the Market Assistant Platform, including all styles, themes, and design tokens.

## Structure

```
styles/
├── global.scss           # Global styles and resets
├── theme/
│   ├── _index.scss      # Main theme file (imports all partials)
│   ├── colors.scss      # Color variables and theming
│   ├── typography.scss  # Typography system
│   ├── spacing.scss     # Spacing and layout system
│   ├── animations.scss  # Animations and transitions
│   ├── components.scss  # Component-specific styles
│   └── types.ts         # TypeScript types for the theme
```

## Usage

### Importing Styles

In your main application entry point (e.g., `_app.tsx`), import the global styles:

```tsx
import '@/styles/global.scss';
```

### Using Theme Variables

Use CSS custom properties (variables) in your components:

```css
.myComponent {
  background-color: var(--background-primary);
  color: var(--text-primary);
  padding: var(--space-4);
  border: 1px solid var(--border-primary);
}
```

### Using TypeScript Types

Import and use the theme types for better type safety:

```tsx
import { Theme } from '@/styles/theme/types';

interface Props {
  theme: Theme;
}

const MyComponent: React.FC<Props> = ({ theme }) => {
  return (
    <div style={{
      color: theme.colors.accent.primary,
      fontFamily: theme.typography.fontFamily.primary,
    }}>
      Hello, world!
    </div>
  );
};
```

## Guidelines

### Colors
- Use semantic color variables (e.g., `var(--accent-primary)`) instead of direct color values
- Follow the color palette defined in `theme/colors.scss`
- Use the opacity utilities for hover/active states

### Typography
- Use the predefined typography scale
- Follow the type hierarchy (h1-h6)
- Use the font families as defined in the theme

### Spacing
- Use the spacing scale for consistent margins and padding
- Favor the spacing variables (e.g., `var(--space-4)`) over fixed pixel values

### Breakpoints
- Use the following breakpoints for responsive design:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## Adding New Components

1. Add new component styles to `theme/components.scss`
2. Follow the BEM naming convention
3. Use theme variables for colors, spacing, and typography
4. Add any new TypeScript types to `theme/types.ts`

## Theme Customization

To customize the theme, modify the variables in the respective `theme/*.scss` files. The theme is built using CSS custom properties, making it easy to override values at runtime if needed.
