# React Steering Documents

## 1. react-patterns.md

# React Patterns

## Purpose
Defines architectural and implementation patterns for scalable React applications.

---

## Core Principles

### Prefer Composition Over Configuration
- Build small composable primitives.
- Avoid overly generic “god components.”
- Favor explicit APIs over configuration-heavy abstractions.

### Keep State Local
- State should live as close as possible to where it is used.
- Avoid lifting state unnecessarily.
- Promote derived state instead of duplicated state.

### Prefer Declarative Logic
Bad:
```js
if (condition) {
  doSomething()
}
```

Good:
```jsx
{condition && <Component />}
```

---

## Component Patterns

### Container / Presentation Separation
- Containers manage data orchestration.
- Presentation components focus only on rendering.

### Controlled Components
Inputs should generally be controlled unless performance constraints dictate otherwise.

### Hooks Over HOCs
- Prefer custom hooks.
- Avoid deep HOC chains.

---

## Data Fetching

### Centralize Server State
Use:
- React Query / TanStack Query
- SWR

Avoid:
- useEffect + fetch boilerplate everywhere

---

## Performance

### Memoization Rules
Only memoize when:
- Rendering cost is measurable
- Referential stability matters

Do NOT memoize preemptively.

---

## Anti-Patterns

Avoid:
- Prop drilling across many layers
- Business logic inside JSX
- Massive useEffect blocks
- Multiple sources of truth
- Index as key in dynamic lists

---

## Review Checklist

- Is state colocated?
- Is logic reusable?
- Is rendering declarative?
- Are hooks isolated and testable?
- Is complexity minimized?



## 2. component-creation.md

# Component Creation Standards

## Purpose
Defines standards for building reusable, maintainable React components.

---

## Component Structure

Preferred structure:

```txt
Component/
├── Component.tsx
├── Component.test.tsx
├── Component.stories.tsx
├── Component.styles.ts
├── index.ts
```

---

## Naming

### Component Names
- PascalCase
- Must describe intent

Good:
- UserCard
- ProductGrid

Bad:
- Card2
- DataThing

### File Names
Match component names exactly.

---

## Component API Design

### Keep APIs Minimal
Avoid excessive props.

Bad:
```tsx
<Button
  primary
  secondary
  rounded
  large
  subtle
/>
```

Good:
```tsx
<Button variant="primary" size="lg" />
```

---

## Props Standards

### Required Props
Keep required props minimal.

### Optional Props
Always provide sane defaults.

### Event Naming
Use:
- onClick
- onChange
- onSubmit

Avoid custom inconsistent names.

---

## Accessibility

All components must:
- Support keyboard navigation
- Include proper ARIA labels
- Preserve semantic HTML
- Maintain focus visibility

---

## Testing Requirements

Every shared component should include:
- Render test
- Interaction test
- Accessibility assertions

---

## Storybook

Every reusable component should include:
- Default story
- Edge-case story
- Loading/error states

---

## Review Checklist

- Is the API intuitive?
- Is accessibility handled?
- Is the component composable?
- Are styles isolated?
- Are tests included?



## 3. design-integrity.md

# Design Integrity Standards

## Purpose
Ensures UI consistency and protects system-wide visual integrity.

---

## Design System First

Never create one-off UI solutions before checking:
- Existing tokens
- Existing primitives
- Existing layouts

---

## Visual Consistency

### Spacing
Use standardized spacing scale only.

Example:
```txt
4 / 8 / 12 / 16 / 24 / 32 / 48
```

Avoid arbitrary spacing values.

---

## Typography

### Typography Hierarchy
Use:
- Display
- Heading
- Body
- Caption

Do not manually style random font sizes.

---

## Color Usage

### Use Semantic Tokens
Good:
```css
color: var(--color-text-primary);
```

Bad:
```css
color: #111111;
```

---

## Interaction Standards

### Hover States
Interactive elements must provide:
- Hover feedback
- Focus feedback
- Disabled state

---

## Motion Standards

Animations should:
- Support reduced motion
- Be purposeful
- Avoid excessive duration

Recommended:
- 150–300ms

---

## Layout Integrity

### Responsive Design
Support:
- Mobile
- Tablet
- Desktop

Design mobile-first whenever possible.

---

## UX Integrity

Avoid:
- Hidden actions
- Ambiguous icons
- Inconsistent interaction patterns
- Layout shifts

---

## Review Checklist

- Does this align with the design system?
- Are spacing/token rules followed?
- Is interaction behavior consistent?
- Is accessibility preserved?
- Does this scale responsively?



## 4. styling-standards.md

# Styling Standards

## Purpose
Defines styling architecture and implementation standards.

---

## Styling Philosophy

Priorities:
1. Consistency
2. Maintainability
3. Predictability
4. Scalability

---

## Preferred Styling Stack

Recommended order:
1. Design tokens
2. Utility classes
3. Component-scoped styles
4. Minimal custom CSS

---

## CSS Rules

### Avoid Global Leakage
Do not style:
```css
div {
}
```

Prefer scoped selectors.

---

## Token Usage

Never hardcode:
- Colors
- Spacing
- Typography
- Radius
- Shadows

Always use tokens.

---

## Utility Class Standards

Utilities should:
- Be readable
- Be composable
- Avoid duplication

Bad:
```html
class="pt-[13px] pb-[11px]"
```

Good:
```html
class="py-3"
```

---

## Responsive Standards

Use consistent breakpoints.

Example:
```txt
sm
md
lg
xl
2xl
```

---

## Dark Mode

All shared UI should support:
- Light mode
- Dark mode

Avoid hardcoded backgrounds/text colors.

---

## Animation Standards

Avoid:
- Infinite distracting animations
- Excessive transforms
- Long transitions

Prefer subtle motion.

---

## CSS Organization

Order:
1. Layout
2. Box model
3. Typography
4. Visual
5. Animation
6. Misc

---

## Review Checklist

- Are tokens used?
- Is CSS scoped properly?
- Is responsive behavior consistent?
- Is dark mode supported?
- Is styling maintainable?
