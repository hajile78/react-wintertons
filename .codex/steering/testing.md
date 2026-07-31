# Testing Standards

## Purpose

This document defines how tests are designed, written, reviewed, and maintained
in this repository. It applies to all new tests and to production changes that
require test coverage.

Use [TESTING_TASKS.md](../../TESTING_TASKS.md) for implementation order and this
document for the standards each task must satisfy.

The key words **MUST**, **MUST NOT**, **SHOULD**, and **SHOULD NOT** describe the
strength of each rule.

## Testing Goals

Tests MUST:

- Protect user-visible behavior and important data contracts.
- Fail for a meaningful behavioral regression, not an implementation refactor.
- Be deterministic, isolated, readable, and fast enough to run frequently.
- Give a future maintainer enough context to understand the expected behavior.
- Cover success, failure, empty, loading, and boundary states where applicable.

Tests MUST NOT exist only to increase a coverage percentage.

## Test Stack

Use:

- **Vitest** as the test runner, assertion library, and mocking framework.
- **jsdom** for component and hook tests that require browser APIs.
- **React Testing Library** for rendering and querying React UI.
- **`@testing-library/user-event`** for realistic user interaction.
- **`@testing-library/jest-dom/vitest`** for DOM assertions.
- **Playwright** only for a small set of critical browser journeys.

Do not introduce a second test runner or competing component-test library without
an explicit repository-level decision.

## Test Layers

### Unit Tests

Use unit tests for pure utilities, service request construction, role checks, and
other code with a small dependency surface.

- Mock only external collaborators.
- Assert inputs, outputs, errors, and meaningful side effects.
- Avoid rendering React when a plain function test is sufficient.

### Component Tests

Use component tests for rendered states and user interactions.

- Render the real component and its immediate collaborators by default.
- Interact through the DOM as a user would.
- Assert accessible output and observable effects.
- Do not assert React state, hook call order, or private helper behavior.

### Integration Tests

Use integration tests for provider composition, routing, containers, React Query,
and workflows spanning multiple components.

- Use real child components where practical.
- Mock at the network, authentication SDK, clock, or browser boundary.
- Test representative flows rather than repeating every unit-test permutation.

### Browser Tests

Use browser tests for a few critical paths that require real navigation and
browser behavior.

- Keep them fewer than component/integration tests.
- Use a controlled test API or network interception.
- Never run destructive workflows against production services.

## File Organization and Naming

- Place a test next to its subject:
  `PostsList.tsx` -> `PostsList.test.tsx`.
- Use `.test.ts` for non-React code and `.test.tsx` for rendered React code.
- Put shared test infrastructure in `src/test/`.
- Name fixtures and helpers by domain intent, such as `buildPost` or
  `renderWithProviders`.
- Use `describe` only when it provides useful behavioral grouping.
- Test names SHOULD read as behavior:

```ts
it('redirects anonymous users to login with the attempted location')
```

Avoid names such as `works`, `test component`, or names tied only to internal
method calls.

## Test Structure

Prefer Arrange, Act, Assert with visible separation when a test has multiple
steps:

```tsx
it('submits the entered credentials', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginView alert={hiddenAlert} onSubmit={onSubmit} onDismissAlert={vi.fn()} />)

  await user.type(screen.getByLabelText(/email/i), 'person@example.com')
  await user.type(screen.getByLabelText(/password/i), 'correct horse')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith('person@example.com', 'correct horse')
})
```

- Each test SHOULD prove one coherent behavior.
- Multiple assertions are encouraged when they describe the same behavior.
- Avoid conditional logic, loops, and hidden assertions inside test bodies.
- Prefer a small amount of local duplication over abstractions that hide intent.
- Extract a helper only after it makes several tests easier to understand.

## Querying the DOM

Use queries in this priority order:

1. `getByRole` with an accessible name.
2. `getByLabelText`.
3. `getByPlaceholderText` when the placeholder is meaningful UI.
4. `getByText`.
5. `getByDisplayValue`.
6. `getByTestId` only when no user-observable selector exists.

Rules:

- Use `getBy*` for elements that must already exist.
- Use `findBy*` for elements that appear asynchronously.
- Use `queryBy*` only to assert absence.
- Scope repeated content with `within`.
- Do not select by CSS class, DOM traversal, or implementation-only IDs.
- Do not add `data-testid` to compensate for inaccessible markup. Improve the
  markup first.

## User Interaction

- Use `userEvent.setup()` and `await` user interactions.
- Prefer `user.click`, `user.type`, `user.clear`, `user.selectOptions`, and
  keyboard interaction over `fireEvent`.
- Use `fireEvent` only for browser events that `user-event` cannot express.
- Test results of an interaction, not merely that a handler was called, unless
  the handler is the component's explicit public contract.
- Include keyboard behavior for custom or nontrivial interactive controls.

## Accessibility

Tests MUST reinforce accessible implementation:

- Inputs have associated labels.
- Icon-only buttons have accessible names.
- Loading and error states expose appropriate status or alert semantics.
- Dialogs use dialog semantics, accessible names, and deliberate focus behavior.
- Navigation and controls are usable by keyboard.

Prefer semantic assertions over brittle markup assertions:

```tsx
expect(screen.getByRole('alert')).toHaveTextContent('Error loading posts')
```

Automated assertions do not replace keyboard and screen-reader-oriented review
for complex interactions.

## Mocking Boundaries

Mock the smallest stable external boundary.

MUST mock:

- Network access (`fetch` or the API service, depending on the test layer).
- Better Auth SDK calls in service/context tests.
- External browser actions such as `window.open`.
- Time and randomness when they affect output.

SHOULD NOT mock:

- The component under test.
- Simple presentational child components.
- React itself.
- Third-party libraries merely to avoid learning their public testing pattern.

Use `vi.spyOn` when preserving the real module is valuable. Use `vi.mock` when
the entire external module must be replaced.

All mocks MUST be restored or cleared between tests. Global mocks MUST NOT leak
into another test file.

## Network and API Tests

Unit and component tests MUST NOT contact `https://api.wintertons.us` or any
other live service.

Service tests MUST verify:

- URL and HTTP method.
- Required headers.
- Exact request body shape.
- Response transformation.
- Non-success responses and malformed data behavior.

Higher-level integration tests SHOULD mock the API module or intercept requests
using one consistent project-wide strategy. Do not duplicate fetch mechanics in
every component test.

Never put real credentials, tokens, or production personal data in fixtures.

## React Query

Every test requiring React Query MUST receive a fresh `QueryClient`.

The test client SHOULD use:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
```

- Never share a query cache between tests.
- Await rendered loading, success, and error states rather than implementation
  callbacks.
- Test query keys and invalidation only when they form part of application
  behavior.
- Suppress expected error logging locally; do not globally hide unexpected errors.

## Routing

- Use `MemoryRouter` or `createMemoryRouter` with explicit initial entries.
- Test navigation by observing the rendered destination or current location.
- Protected-route tests MUST cover anonymous, authenticated, unauthorized, and
  authorized behavior.
- Redirect tests MUST verify preserved route state when the application relies on
  returning users to their original destination.
- Do not mock React Router hooks when a small in-memory route tree can exercise
  the real behavior.

## Context and Hooks

- Render context consumers under the real provider when testing provider behavior.
- Test a custom hook through its public return value and observable effects.
- Test required-provider guard errors.
- Do not test React internals or count renders unless render count is the behavior
  being protected.
- Hook dependencies and callbacks SHOULD remain stable enough that tests do not
  rely on accidental rerender timing.

## Async Behavior

- Await every promise-producing user interaction.
- Use `findBy*` or `waitFor` for observable asynchronous changes.
- Put assertions inside `waitFor`; do not perform the action being retried there.
- Do not use arbitrary sleeps, polling loops, or promise-flushing helpers when an
  observable DOM condition can be awaited.
- A test MUST fail if its async expectation is never reached.
- Avoid wrapping Testing Library APIs in `act` unless the library cannot manage
  the update itself.

## Time, Randomness, and Storage

- Use `vi.useFakeTimers()` for timer-driven UI such as alerts.
- Use `vi.setSystemTime()` for dates and cache expiry.
- Mock `Math.random` for random quote selection.
- Seed `localStorage` explicitly and clear it after every test.
- Restore real timers, system time, random functions, and storage state in
  cleanup.
- Tests MUST be independent of the developer's timezone where displayed dates
  matter. Assert a controlled format or set a known test timezone.

## Errors and Console Output

- Expected errors MAY use a local console spy.
- The test MUST assert the expected log and restore the spy.
- Unexpected `console.error` or `console.warn` SHOULD fail the test suite.
- Do not globally silence console output.
- Error tests SHOULD confirm both the user-facing state and any recovery action.

## Fixtures

- Use the smallest valid fixture that communicates the scenario.
- Prefer typed builders with overridable defaults:

```ts
const buildPost = (overrides: Partial<Post> = {}): Post => ({
  id: 'post-1',
  title: 'A title',
  body: '<p>A body</p>',
  user: 'Main',
  created: new Date('2026-01-15T12:00:00Z'),
  ...overrides,
})
```

- Use clearly fictional values.
- Keep scenario-specific values in the test rather than burying them in a global
  fixture.
- Avoid giant production-response fixtures unless the response shape itself is
  under test.

## Assertions

Prefer specific assertions:

- `toBeVisible()` over `toBeTruthy()`.
- `toHaveAccessibleName()` for named controls.
- `toHaveValue()` for form fields.
- `toHaveBeenCalledWith()` for external contracts.
- `toHaveAttribute()` for meaningful link destinations or semantics.

Avoid:

- Assertions on large `innerHTML` strings.
- Full-tree snapshots.
- Assertions on incidental Tailwind classes outside style primitives.
- Testing library implementation details.
- Exact call counts unless the count is behaviorally important.

Small focused snapshots MAY be used for stable serialized data, but require a
clear reason in review.

## Security-Sensitive Behavior

Any code using `dangerouslySetInnerHTML` MUST have an explicit trust or
sanitization contract.

- If content is untrusted, sanitize it before rendering and test dangerous input.
- If content is trusted, document the boundary and test that only the trusted
  source can supply it.
- Authentication and role tests MUST include denied paths, not only allowed paths.
- Tests MUST NOT log secrets or use real authentication credentials.

## Coverage

Coverage is a signal, not the objective.

- New or changed behavior MUST include relevant tests.
- Bug fixes MUST include a test that fails without the fix.
- Branch-heavy base code SHOULD receive stronger branch coverage than static UI.
- Coverage exclusions MUST be narrow and justified.
- Do not use ignore comments to conceal difficult behavior without review.

The eventual repository floor is:

- 80% statements.
- 80% lines.
- 80% functions.
- 75% branches.

Thresholds MAY be introduced gradually from the measured baseline, but they MUST
not decrease without an explicit decision.

## Reliability and Performance

Tests MUST:

- Pass independently and in random execution order.
- Avoid shared mutable state.
- Avoid real network access.
- Avoid dependence on wall-clock time, random values, locale, or timezone.
- Clean up global state and spies.

Retrying a flaky test is not a fix. Identify and remove the nondeterministic
dependency.

Keep unit/component tests fast. Move behavior to browser tests only when a real
browser adds meaningful confidence.

## Production Changes Discovered by Tests

Testing often exposes ambiguous or inaccessible production behavior.

- Do not encode an accidental bug as the expected result merely to make a test pass.
- Make the behavior decision explicit, update production code, and test the
  chosen contract.
- Keep production refactors separate from broad test additions when practical.
- Accessibility improvements needed for reliable role-based testing are valid
  production changes.

Known decisions are tracked in [TESTING_TASKS.md](../../TESTING_TASKS.md).

## Definition of Done

A testing task is complete only when:

- The intended behavior and important branches are covered.
- Tests use public, user-observable behavior or a documented service contract.
- Success, failure, and relevant boundary states are included.
- No live service is contacted.
- Mocks, timers, storage, and globals are cleaned up.
- No unexpected console warnings or errors occur.
- The focused test passes.
- The full test suite passes.
- Type checking and the production build pass.
- Coverage does not regress below the current enforced threshold.
- The related checkbox in `TESTING_TASKS.md` is updated.

## Review Checklist

- Does the test protect behavior that matters?
- Would it survive a reasonable internal refactor?
- Is it deterministic and isolated?
- Does it use accessible queries and realistic interactions?
- Is the mock placed at the correct boundary?
- Are async updates awaited correctly?
- Are failure and boundary paths covered?
- Are global state and mocks restored?
- Is the test simpler than the behavior it verifies?
- Does the test name clearly state the contract?
