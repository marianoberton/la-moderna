# System Patterns

## Architecture Overview
La Moderna is built using a modern web application architecture with Next.js, leveraging its server-side rendering capabilities and component-based structure. The application follows a client-side rendering approach for interactive elements like carousels and animations.

## Component Structure
The application is organized into reusable components:

```
app/
  ├── components/           # Shared UI components
  │   ├── FeaturedNew.tsx   # Carousel for new featured vehicles
  │   ├── UsedCars.tsx      # Showcase for used vehicles
  │   ├── CtaExchange.tsx   # Call-to-action for vehicle exchange
  │   └── ... 
  ├── page.tsx              # Home page component
  └── ...
components/                 # UI library components (shadcn/ui)
  └── ui/
      ├── button.tsx
      └── ...
```

## Design Patterns

### Component Composition
Components are designed to be modular and reusable, with clear separation of concerns. For example, the `VehicleCard` component is used in both `FeaturedNew` and `UsedCars` components, maintaining consistency in the display of vehicle information.

### Responsive Design Pattern
The application uses a mobile-first approach with Tailwind CSS, defining styles for mobile devices by default and using breakpoint utilities like `sm:`, `md:`, and `lg:` for larger screens.

### Interactive Carousel Pattern
Vehicle showcases use a consistent carousel pattern:
- Horizontal scrolling for mobile devices
- Grid or flex layout for desktop views
- Navigation arrows for easy browsing
- Smooth animations using Framer Motion

### Container-Component Pattern
The application separates UI components (presentational) from container components (data and logic). This separation makes the codebase more maintainable and testable.

## State Management
The application uses React's built-in state management with `useState` and `useEffect` hooks for handling component-level state, such as carousel positions and active indices.

## Animation Patterns
Animations are implemented using Framer Motion with consistent patterns:
- Initial state definitions
- Transition properties for smooth animations
- WhileInView triggers for scroll-based animations
- Consistent duration and delay patterns 