# Agent Instructions for Math Whac-A-Mole

This document outlines the coding standards, best practices, and architecture for the **Math Whac-A-Mole** project. All AI agents and contributors must follow these guidelines.

## 🛠 Tech Stack

- **Framework**: Angular v21+ (Standalone Components, Signals)
- **Styling**: Tailwind CSS (Utility-first)
- **State Management**: Angular Signals & NgRx Signal Store (Preferred)
- **Build Tool**: Angular CLI / Vite

## 📐 Architecture & State Management

### State Management Strategy
- **Use Signals for everything.** Avoid RxJS `BehaviorSubject` or manual subscriptions unless absolutely necessary (e.g., complex event streams).
- **Preference**: Use **NgRx Signal Store** (`@ngrx/signals`) for global or complex component state.
    - *Note*: The existing `GameStore` (`src/services/game.store.ts`) is currently a manual Signal-based service. Future refactors or new features should consider adopting the official `@ngrx/signals` library for consistency and utilizing its features (hooks, entities, etc.).
- **Components** should be "dumb" (presentational) where possible, delegating logic to Stores/Services.
- **Inputs/Outputs**: Use Signal Inputs (`input()`) and Outputs (`output()`).

```typescript
// Example of desired state usage
readonly store = inject(GameStore);
readonly score = this.store.score; // Signal
```

## 📝 Coding Standards (Angular Best Practices)

1.  **Standalone Components**: All components, directives, and pipes must be `standalone: true` (default in v19+).
2.  **Change Detection**: Always use `ChangeDetectionStrategy.OnPush`.
3.  **Control Flow**: Use the built-in control flow syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`.
4.  **Inject() over Constructor**: Use the `inject()` function for Dependency Injection.
5.  **Strict Typing**: No `any`. Define interfaces for all data structures (e.g., `Mole`, `GameStatus`).
6.  **Images**: Use `NgOptimizedImage` for static assets where possible.

### Example Component Structure

```typescript
@Component({
  selector: 'app-example',
  template: `
    @if (store.isLoading()) {
      <p>Loading...</p>
    } @else {
      <button (click)="handleClick()">Action</button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  readonly store = inject(GameStore);
  
  handleClick() {
    this.store.performAction();
  }
}
```

## 🎨 UI/UX Guidelines

- **Tailwind First**: Use Tailwind utility classes for all styling. Avoid `.css` files unless defining custom animations or complex selectors.
- **Responsiveness**: Ensure the game layout works on mobile and desktop (max-width containers, flexible grids).
- **Animations**: Use CSS transitions or Tailwind animation utilities to make the game feel "alive" (e.g., moles popping up, button presses).

## 🚀 Game Logic Overview

The core logic resides in `GameStore`:
- **Moles**: 9 slots in a grid.
- **Problem**: A multiplication problem (e.g., `3 x 4`).
- **Mechanic**: Hitting the mole with the correct answer adds points. Hitting wrong ones subtracts points.
- **Timer**: 60-second countdown.

## 🧪 Testing

- Ensure logical components (Stores/Services) are unit tested.
- Verify game flow (Start -> Play -> Game Over) works without console errors.
