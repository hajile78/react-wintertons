# Testing Task List

This backlog is ordered by dependency: establish the test harness, test base code
in isolation, test presentational components, test stateful containers, and finish
with routes and application integration. Complete each section from top to bottom
unless a task explicitly says it can be done in parallel.

## 0. Test Harness and Decisions

- [x] **T0.1 - Reconcile runtime and package dependencies**
  - Confirm and document the supported Node version. The current local runtime
    cannot parse the installed Vitest build (`SyntaxError: Unexpected token '?'`).
  - Add the packages imported by production code but absent from `package.json`:
    `@tanstack/react-query`, `better-auth`, and `csstype`.
  - Add the browser-test dependencies: `@testing-library/react`,
    `@testing-library/user-event`, and `jsdom`.
  - Remove `@types/jest` unless Jest types are intentionally needed.
  - Acceptance: a clean install followed by `npm test -- --run` starts Vitest
    without module-resolution or JavaScript syntax errors.

- [x] **T0.2 - Configure Vitest for React DOM tests**
  - Add `test.environment: 'jsdom'` and `test.setupFiles` to
    `vite.config.ts` (or a dedicated Vitest config).
  - Update `src/setupTests.js` to use the current
    `@testing-library/jest-dom/vitest` entry point.
  - Add `vitest/globals` to TypeScript types if global `describe`, `it`, and
    `expect` are used.
  - Set coverage include/exclude rules for `src/**/*.{ts,tsx}`, excluding
    entrypoint/type-only files as agreed.
  - Acceptance: one DOM smoke test passes and coverage can be generated.

- [x] **T0.3 - Add reusable test render helpers**
  - Create `src/test/render.tsx` with fresh `QueryClientProvider`,
    `MemoryRouter`, and optional auth/modal context wrappers.
  - Disable React Query retries and automatic refetching in tests.
  - Create typed fixture builders for `Post`, `Quote`, auth users, and sessions.
  - Add helpers to mock `fetch`, `localStorage`, time, and `Math.random`.
  - Acceptance: component tests can opt into providers without repeating setup.

- [x] **T0.4 - Decide the legacy-code boundary**
  - Confirm whether `Header_Old.tsx`, `PostsOldContainer.tsx`,
    `PostsOldList.tsx`, `FamilyLinks.tsx`, and `LinkQuote.tsx` are still supported.
  - Delete/archive dead files or explicitly exclude them from initial coverage.
  - Do not duplicate tests for old and current implementations by accident.

### Legacy Coverage Decision

The current application import graph does not use `Header_Old.tsx`,
`PostsOldContainer.tsx`, `PostsOldList.tsx`, `FamilyLinks.tsx`, or
`LinkQuote.tsx`. They are excluded from initial coverage and will not receive
duplicate tests. The files remain in place until a separate cleanup change
confirms they can be deleted safely.

## 1. Base Code

These tests establish the contracts that hooks and components depend on.

- [x] **T1.1 - Class-name utility**
  - Target: `src/lib/utils.test.ts`
  - Test `cn` with conditional classes and conflicting Tailwind classes.
  - Verify later Tailwind utilities win.

- [x] **T1.2 - API service request contracts**
  - Target: `src/services/api.test.ts`
  - Mock `global.fetch`; do not call `api.wintertons.us`.
  - Test URLs and response mapping for `getQuotes`, `getPosts`, and `getPost`.
  - Test HTTP method, JSON header, and exact serialized entity for `addQuote`
    and `addPost`, including the default `Unknown` quote author.
  - Test rejected non-OK responses for both mutations.
  - Record the desired behavior for non-OK GETs and invalid JSON; the current
    implementation does not check `response.ok` for reads.

- [x] **T1.3 - Authentication service**
  - Target: `src/services/auth.test.ts`
  - Mock `better-auth/react` before importing the module.
  - Test that client creation uses `VITE_BETTER_AUTH_URL` and the fallback URL.
  - Test argument/result delegation for `login`, `logout`, and `getSession`.
  - Test `hasRole` for a matching role, missing role, empty roles, malformed
    roles, and null/undefined users.

- [x] **T1.4 - Quote cache and retrieval hook**
  - Target: `src/hooks/useGetQuotes.test.tsx`
  - With valid cached quotes: avoid the API, expose cached quotes, and select a
    deterministic random quote.
  - With no cache: fetch, cache with a 30-second expiry, and update both values.
  - With expired cache: remove it and fetch fresh data.
  - With empty cached data: fetch fresh data.
  - With malformed JSON: first decide whether the hook should recover or throw,
    then encode that contract.
  - On API rejection: verify the chosen error behavior and no corrupt cache write.
  - Use fake time and a mocked `Math.random`; restore both after every test.

- [x] **T1.5 - Auth context**
  - Target: `src/context/AuthContext.test.tsx`
  - Mock `authClient.useSession` and auth service functions.
  - Test anonymous and authenticated context values.
  - Test `login`, `logout`, and `hasRole` delegation.
  - Test that `useAuth` outside `AuthProvider` throws its documented error.

## 2. Shared and Presentational Components

These should be fast DOM tests with dependencies passed as props or context.

- [x] **T2.1 - UI primitives**
  - Targets: `src/components/ui/button.test.tsx`,
    `src/components/ui/card.test.tsx`
  - Test ref/attribute forwarding, variant/size classes, custom class merging,
    disabled behavior, and `Button`'s `asChild` rendering.
  - Keep these tests small; third-party library behavior is out of scope.

- [x] **T2.2 - Alert and shared Form**
  - Targets: `src/partials/Alert.test.tsx`,
    `src/components/common/Form.test.tsx`
  - Alert: render message/type class, dismiss after 2.5 seconds, cancel timer on
    unmount, and use the latest dismissal callback.
  - Form: render title/children, invoke submit handler, conditionally render the
    alert, dismiss it, and tolerate no dismissal callback.

- [x] **T2.3 - Error UI**
  - Targets: `src/components/common/ErrorFallback.test.tsx`,
    `src/components/common/ErrorBoundary.test.tsx`
  - Fallback: explicit/default messages and optional reset button behavior.
  - Boundary: normal children, thrown-child fallback, and logged error.

- [x] **T2.4 - Login view**
  - Target: `src/components/LoginView.test.tsx`
  - Test accessible email/password fields, required attributes, submitted values,
    prevented browser submission, form reset, and alert dismissal.

- [x] **T2.5 - Quote form view**
  - Target: `src/partials/quoteForm/QuoteFormView.test.tsx`
  - Test loading state, quote list, empty list, submitted values, optional author,
    form reset, and alert rendering/dismissal.

- [x] **T2.6 - Post list**
  - Target: `src/partials/PostsList.test.tsx`
  - Test loading, error, empty, and populated states.
  - Test titles/link destinations, body rendering, author/date display rules,
    and the optional More button.
  - Include a security decision for `dangerouslySetInnerHTML`: assert that API
    HTML is sanitized before rendering, or document that the API is a trusted
    source. Add a regression test after that decision.

  Security decision: post bodies are trusted, administrator-authored HTML from
  the Wintertons API. `PostsList` intentionally preserves that markup. If post
  authoring is opened to untrusted users, sanitize at the API boundary before
  retaining this rendering contract.

- [x] **T2.7 - Header, footer, and random quote**
  - Targets: `src/partials/Header.test.tsx`,
    `src/partials/Footer.test.tsx`, `src/partials/RandomQuotes.test.tsx`
  - Header: navigation destinations and mobile menu open/close behavior; add an
    accessible label to the icon-only toggle before selecting it by role/name.
  - Footer: visible copyright/product text.
  - Random quote: quote and author content plus the intended empty/loading state.
    Note that `{}` is currently truthy and renders blank quote markup.

- [x] **T2.8 - Modal and links**
  - Targets: `src/partials/Modal.test.tsx`, `src/partials/Links.test.tsx`
  - Modal: hidden/visible states, supplied content, close button, backdrop close,
    and whether clicks inside the dialog should propagate and close it.
  - Add dialog semantics and an accessible close-button name before relying on
    role-based tests.
  - Links: prayer modal context updates and both external `window.open` calls.
  - Test missing context only if logging is intended public behavior.

## 3. Stateful Component Code

Use real child views where practical and mock only network/auth boundaries.

- [ ] **T3.1 - Login container**
  - Target: `src/components/LoginContainer.test.tsx`
  - Successful login: correct credentials, success state, and navigation to the
    saved pathname or `/`.
  - Failed login: danger alert and no navigation.
  - Test dismissing the result alert.

- [ ] **T3.2 - Protected route**
  - Target: `src/components/ProtectedRoute.test.tsx`
  - Anonymous users go to `/login` with the attempted location in route state.
  - Authenticated users render children.
  - Users lacking a required role go home; users with it render children.

- [ ] **T3.3 - Posts form**
  - Target: `src/partials/PostsForm.test.tsx`
  - Test required/empty-field behavior at the component boundary.
  - Test exact `api.addPost` arguments with controlled system time.
  - Test success clearing fields and displaying an alert.
  - Test API failure preserving useful input and displaying the error alert.

- [ ] **T3.4 - Quote form container**
  - Target: `src/partials/quoteForm/QuoteFormContainer.test.tsx`
  - Test initial query loading/success/error behavior.
  - Test mutation arguments, success alert, error alert, and `quotes` query
    invalidation after success.
  - Decide and test how query errors are presented; the current view has no
    query-error prop.
  - Verify the `api.getQuotes` response shape. The cache hook expects
    `{ quotes: Quote[] }`, while this container currently passes the whole result
    to a prop typed as `Quote[]`.

- [ ] **T3.5 - Posts container**
  - Target: `src/partials/PostsContainer.test.tsx`
  - Test default route fetching `Main`, slug route fetching by slug, and ID route
    fetching one post.
  - Test loading/error propagation.
  - Test pagination in groups of three and removal of More at the end.
  - Test deterministic quote selection when quotes arrive.
  - Test query-key changes when route params change; decide whether page should
    reset to 1 on navigation and add a regression test.

## 4. Other Code: Routes and Integration

These tests confirm wiring after the lower layers are stable.

- [ ] **T4.1 - Route map**
  - Target: `src/routes/index.test.tsx`
  - Assert the six expected paths and their rendered screens.
  - Test that `/addPost` is role-protected and the other current routes have the
    intended access policy.
  - Verify quote/setter props reach post routes.

- [ ] **T4.2 - Layout integration**
  - Target: `src/partials/layout.test.tsx`
  - With providers and a memory router, test the header/main/sidebar/footer shell.
  - Test representative paths: `/`, `/nav/:slug`, `/post/:id`, `/addQuote`,
    `/addPost`, and `/login`.
  - Mock network boundaries, not the entire route tree.

- [ ] **T4.3 - App integration**
  - Target: `src/App.test.tsx`
  - Render under router/query providers.
  - Verify auth, error boundary, and modal context are composed correctly.
  - Exercise opening and closing the prayer modal through the real `Links` UI.
  - Throw from a controlled child to confirm the application fallback.

- [ ] **T4.4 - Entrypoint smoke test or manual contract**
  - Target: `src/index.test.tsx` only if the entrypoint logic remains nontrivial.
  - Verify mounting into `#root`; decide whether a missing root should be a hard
    error rather than only a console message.
  - It is acceptable to cover this with the production build plus an end-to-end
    smoke test instead of a unit test.

- [ ] **T4.5 - Browser smoke tests**
  - Add a small Playwright suite after component/integration tests are green.
  - Cover home loading, family navigation, login redirect, failed login, and a
    successful add-post/add-quote flow against a mocked or dedicated test API.
  - Keep browser tests focused on critical journeys; leave permutations in Vitest.

## 5. Quality Gates and Ongoing Practice

- [ ] **T5.1 - Add deterministic CI commands**
  - Add `test:run`, `test:coverage`, and optional `test:ui` scripts.
  - Run typecheck/build, unit/integration tests, and coverage in CI.

- [ ] **T5.2 - Introduce coverage thresholds gradually**
  - First baseline actual coverage after sections 1 and 2.
  - Raise thresholds as sections 3 and 4 land; prefer meaningful branch coverage
    over chasing 100% line coverage.
  - Suggested eventual floor: 80% statements/lines/functions and 75% branches,
    with higher expectations for `services`, `hooks`, and `context`.

- [ ] **T5.3 - Keep tests behavior-focused**
  - Query by role, accessible name, label, and visible text.
  - Avoid snapshots for large component trees and avoid assertions on incidental
    Tailwind classes except in the UI primitive tests.
  - Mock at external boundaries (`fetch`, auth SDK, time, browser APIs).
  - Add a regression test with every bug fix.

## Recommended Milestones

1. **Foundation:** T0.1-T0.4 and T1.1-T1.5.
2. **Fast component coverage:** T2.1-T2.8.
3. **Behavioral workflows:** T3.1-T3.5.
4. **Wiring confidence:** T4.1-T4.5.
5. **Enforcement:** T5.1-T5.3.
