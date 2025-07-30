# Himajin Codebase Overview

This document provides a comprehensive overview of the Himajin e-commerce application codebase to assist AI systems in understanding the project structure, technologies, and functionality.

## Project Overview

**Project Type**: E-commerce web application  
**Primary Languages**: TypeScript, JavaScript (React)  
**Main Framework**: Remix  
**Styling**: Tailwind CSS  
**State Management**: Zustand  

## Directory Structure

```
/app - Main application code
  /assets - Static assets like images
  /entry.client.tsx - Client-side entry point for Remix hydration
  /entry.server.tsx - Server-side rendering entry point
  /features - Domain-specific feature modules
    /products - Product-related components and logic
      /components
        /hero-products.tsx - Hero banner component
        /hero-products-skeleton.tsx - Loading skeleton for hero banner
        /product-grid.tsx - Product listing grid
        /product-skeleton.tsx - Loading skeleton for product grid
      /hooks - Product-specific hooks
  /hooks - Shared React custom hooks
    /use-data-fetching.tsx - Data fetching hook with loading states
  /routes - Remix route definitions
    /_index.tsx - Main landing page
  /stores - State management
    /cart-store.ts - Shopping cart state using Zustand
  /tailwind.css - Global CSS styles
  /ui - Reusable UI components
    /button - Button components
    /... - Other UI components
/public - Static public assets
/docs - Documentation
```

## Key Technologies

- **Remix (v2.15.2)**: Full-stack web framework for routing, data loading, and server/client rendering
- **React (v18.3.1)**: UI component library
- **TypeScript**: For type safety
- **Tailwind CSS (v4.1.11)**: Utility-first CSS framework
- **Zustand (v5.0.6)**: Lightweight state management
- **Radix UI**: Unstyled, accessible UI component primitives
- **Storybook (v8.5.0)**: Component development and documentation
- **Vitest (v3.1.4)**: Testing framework
- **Biome (v1.9.4)**: Code formatting and linting
- **Lefthook**: Git hooks manager

## Application Flow

1. The application initializes through the Remix framework which handles routing and server/client rendering
2. `root.tsx` sets up the basic HTML structure and imports global styles
3. `entry.client.tsx` handles client-side hydration
4. `entry.server.tsx` manages server-side rendering
5. The main landing page (`_index.tsx`) renders primary product showcases:
   - Hero banners at the top
   - Product grid below with filtering and search capabilities

## Key Components and Features

### Product Display

- **HeroBanners**: Promotional banners with "Shop Now" buttons
- **ProductGrid**: Displays products with:
  - Filtering by category
  - Search functionality
  - Product cards with images, prices, and "Add to Cart" buttons

### Shopping Cart

- Implemented using Zustand for state management
- Provides functions for adding/removing items
- Toast notifications on cart updates (using Sonner)

### UI Components

- Follows a modern e-commerce design pattern
- Built using a combination of custom UI components and Radix UI primitives
- Styled with Tailwind CSS for consistent design
- Includes loading skeletons for improved UX during data fetching

## State Management

The application primarily uses Zustand for state management, particularly for the shopping cart functionality. The cart state is defined in `/app/stores/cart-store.ts` and exposes functions like `addItem`, `removeItem`, and `clearCart`.

## Data Fetching Pattern

Data fetching is abstracted through the `useDataFetching` hook which:
- Handles loading states
- Provides error handling
- Simulates API delays (for demonstration purposes)

## Testing

- Test files follow the pattern `*.test.ts` or `*.spec.ts`
- Tests are configured using Vitest in `vitest.config.ts`
- The configuration uses happy-dom for DOM testing environment

## Build and Development

- Development server: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Storybook: `pnpm storybook`

## Best Practices and Patterns

1. **Component Structure**: Components are organized by feature and follow a consistent pattern
2. **Type Safety**: TypeScript is used throughout the codebase for type safety
3. **Loading States**: Skeleton loaders are used during data fetching
4. **Error Handling**: Comprehensive error handling with user-friendly error states
5. **Responsive Design**: Mobile-first approach using Tailwind CSS

## Additional Context for AI

When working with this codebase, consider:

- This is a Remix application, so it follows Remix conventions for routing and data loading
- The project uses a feature-based organization rather than a strict MVC pattern
- State management is handled through Zustand rather than Redux or Context API
- The UI is built using a combination of custom components and Radix UI primitives
- Styling is predominantly done with Tailwind CSS utility classes

This overview should provide sufficient context for AI systems to understand the structure and purpose of the Himajin e-commerce application.
