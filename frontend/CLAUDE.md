# CLAUDE.md

This file provides guidance to Claude Code when working on this repository.

## Project Overview

Production-grade eCommerce frontend built with:

- React 19, Vite, React Router DOM
- Redux Toolkit (client state) + TanStack React Query (server state)
- Axios, Laravel API (Sanctum Authentication)
- Stripe Checkout
- **Tailwind CSS** (utility-first styling, no custom CSS files unless unavoidable)

The backend is a separate Laravel project exposing REST endpoints.

Follow modern React best practices: clean architecture, high maintainability, scalable folder organization.

---

## Development Philosophy

Always prioritize: readability, scalability, reusability, type safety via JSDoc, separation of concerns, SOLID, DRY, KISS, composition over inheritance.

Never: write quick hacks, duplicate business logic, put API logic inside UI components, mix UI state with server state.

---

## Technology Responsibilities

### React Query — server state ONLY

Fetching, caching, background refetching, pagination, infinite scroll, mutations, optimistic updates, query invalidation.
Examples: products, orders, cart API response, search results, categories, user profile from API.
Never store API collections in Redux.

### Redux Toolkit — client state ONLY

Examples: authenticated user, auth status, theme, language, sidebar state, cart drawer visibility, filters before submit, wishlist IDs, notifications, temporary UI selections.
Never duplicate React Query cache inside Redux.

### Tailwind CSS — styling ONLY

- Use Tailwind utility classes directly in JSX; avoid separate `.css`/`.scss` files except for rare global resets (`index.css` with `@tailwind base/components/utilities`).
- Never write inline `style={{}}` objects — use utilities instead.
- Extract repeated utility combinations into reusable components, not `@apply` chains (prefer component extraction over CSS abstraction).
- If a class string is reused 2+ times, extract it into a component or a `cva`/`clsx`-based variant, not a copy-pasted string.
- Use `clsx` or `tailwind-merge` (`twMerge`) for conditional/merged class names — never string-concatenate classes manually.
- Define design tokens (colors, spacing, radii, fonts) in `tailwind.config.js` `theme.extend`, not as magic values in classNames.
- Keep responsive design mobile-first: base classes for mobile, `sm:` `md:` `lg:` `xl:` for breakpoints up.
- Use `dark:` variants if dark mode is required; centralize the toggle in Redux (`themeSlice`), not local state per component.
- Co-locate variant logic (e.g. button sizes/colors) using a `cva` (class-variance-authority) definition inside `components/ui/`.

---

## Folder Structure

```
src/
  app/            store.js, providers.jsx
  api/            axios.js, endpoints.js
  services/       auth.service.js, cart.service.js, checkout.service.js, product.service.js, order.service.js
  hooks/          useAuth.js, useCart.js, useProducts.js, useCheckout.js
  features/
    auth/         api/ hooks/ pages/ components/ authSlice.js
    products/     api/ hooks/ pages/ components/
    cart/         api/ hooks/ pages/ components/ cartSlice.js
    orders/
    checkout/
  layouts/
  pages/
  routes/
  components/
    ui/           reusable Tailwind-based primitives (Button, Input, Modal, Card...)
    shared/
  constants/
  utils/
  lib/            cn.js (clsx + twMerge helper), cva variants
  assets/
  styles/         index.css (Tailwind directives + rare global rules only)
```

---

## Components

- Prefer functional components. One component = one responsibility.
- Avoid components larger than ~200 lines.
- Extract repeated UI into `components/ui/` (Tailwind-styled primitives).
- Extract repeated logic into hooks; repeated calculations into utils.
- Never place business logic directly inside JSX.
- Build UI primitives (Button, Input, Card, Badge, Modal) once in `components/ui/` with Tailwind + `cva`, then reuse everywhere — never re-style the same element ad hoc across pages.

---

## Custom Hooks

Move reusable logic into hooks: `useCart()`, `useCheckout()`, `useDebounce()`, `usePagination()`, `useSearch()`, `useAuth()`.
Components should remain mostly declarative.

---

## API Layer

Never call axios directly inside components — always use service files.

Example (`services/product.service.js`): `getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`.

Flow: **Component → Hook → Service → Axios → Laravel API**

---

## Axios

One axios instance only. Configure base URL, timeout, headers, credentials, interceptors.

- Request interceptor: Sanctum authentication if needed.
- Response interceptor: 401 handling, global errors, token expiration.
  Never repeat axios configuration.

---

## Authentication

Laravel uses Sanctum. Always send credentials when required. Persist authentication correctly.
Handle: login, logout, register, unauthorized, forbidden, expired session.
Never expose sensitive information.

---

## React Query Keys

Centralize keys in `queryKeys.js`: `auth`, `products`, `product(id)`, `cart`, `orders`, `checkout`.
Never hardcode query keys repeatedly.

---

## Routing

Use React Router. Group routes: public, protected, guest. Lazy load pages.
Pages: Home, Product Details, Cart, Checkout, Orders, Login, Register, Profile, 404.

---

## State Management

- Global state → Redux
- Server state → React Query
- Component state → useState
- Derived state → useMemo
- Styling state (e.g. active tab classes) → still React state, but class output → Tailwind + `cva`

Computed values should never be duplicated.

---

## Forms

Use React Hook Form + Zod (if installed) for validation. Style inputs with Tailwind via shared `Input`/`Select`/`Textarea` primitives. Avoid uncontrolled or manual large-form validation.

---

## Performance

Use `memo()`, `useMemo()`, `useCallback()`, `React.lazy()`, `Suspense()`, code splitting, virtualization for large lists, debounced search. Avoid unnecessary re-renders.

---

## Error Handling

Always handle: loading, empty state, error state, retry state, network failure, unauthorized, forbidden, 404, 500.
Never leave API calls without error handling.

---

## Loading States

Prefer Tailwind-based skeletons (`animate-pulse` + gray blocks) over spinners.
Every API request should cover: loading, success, empty, failure.

---

## Styling Rules (Tailwind)

- No inline styles, no ad hoc CSS files per component.
- No duplicated spacing/color values — use `theme.extend` tokens and Tailwind's scale.
- Keep className strings readable; if a className string exceeds ~8-10 utilities, extract to a component or `cva` variant.
- Use `cn()` helper (`clsx` + `twMerge`) everywhere classes are conditional.
- Consistent spacing scale, consistent color palette defined once in `tailwind.config.js`.

---

## Naming Conventions

- Components: PascalCase — `ProductCard.jsx`
- Hooks: camelCase — `useProducts.js`
- Slices: `authSlice.js`
- Services: `product.service.js`
- Utilities: `formatPrice.js`
- Constants: `UPPER_SNAKE_CASE`
- Tailwind variant files: `button.variants.js` (cva)

---

## Imports

Use absolute imports (aliases). Order: React → Libraries → Redux → React Query → Services → Hooks → Components → Utilities → Styles.

---

## Clean Code Rules

Early returns. Avoid nested conditionals. Keep functions small. Avoid magic numbers — extract constants. Self-explanatory code, descriptive names.

---

## Reusability

- Logic duplicated twice → extract it.
- UI duplicated twice → create a reusable component.
- API duplicated → create a service.
- Tailwind class combo duplicated twice → extract a component/variant.

---

## Security

Never trust frontend validation. Never expose secrets. Never hardcode API URLs. Use environment variables. Sanitize user-generated HTML.

---

## Environment Variables

Use `VITE_API_URL`, `VITE_APP_NAME`, `VITE_STRIPE_KEY`. Never hardcode URLs.

---

## Code Generation Rules

- Follow existing architecture; reuse services, hooks, UI components.
- Never duplicate logic; never bypass the service layer; never call axios directly in components.
- Prefer React Query for server data, Redux only for client state.
- Style exclusively with Tailwind utilities + shared `components/ui/` primitives.
- Write production-quality, maintainable code — not the shortest code.

---

## Backend Endpoints (Laravel)

```
POST   /register
POST   /login
POST   /logout
GET    /products
POST   /products
PUT    /products/{id}
DELETE /products/{id}
GET    /cart
POST   /cart
PUT    /cart/{id}
DELETE /cart/{id}
GET    /orders
POST   /checkout
GET    /checkout/success
GET    /checkout/cancel
POST   /webhooks/stripe
```

Always keep API calls isolated inside services.

---

## Final Rule

First understand the architecture, then extend it. Never replace existing architecture unless explicitly requested. Consistency is more important than cleverness.
