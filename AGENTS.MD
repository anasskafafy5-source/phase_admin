# PHASE Admin — Agent Instructions

## Project Overview

PHASE Admin is a standalone administration dashboard for the existing **PHASE Store** clothing e-commerce project.

The storefront and admin dashboard are separate applications but connect to the **same Supabase project, database, authentication, and storage**.

The admin dashboard should remain simple, fast, maintainable, and easy for a non-technical store owner to use.

Do not overengineer the project.

---

## Tech Stack

Use the existing stack:

* React
* Vite
* JavaScript
* React Router
* Tailwind CSS
* Supabase
* TanStack React Query
* React Hook Form
* React Hot Toast
* Inter font

Do not introduce new libraries unless there is a clear need.

---

# Project Architecture

Use the following high-level structure:

```text
src/
├── features/
│   ├── products/
│   ├── categories/
│   ├── settings/
│   ├── users/
│   └── auth/
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   ├── Categories.jsx
│   ├── Accounts.jsx
│   ├── Settings.jsx
│   └── Login.jsx
│
├── services/
│   ├── supabase.js
│   ├── productsApi.js
│   ├── categoriesApi.js
│   ├── settingsApi.js
│   ├── usersApi.js
│   └── authApi.js
│
├── ui/
├── App.jsx
└── main.jsx
```

Do not reorganize this architecture without a strong reason.

---

# Architecture Rules

The standard data flow is:

```text
Page
↓
Feature Component
↓
Custom Hook
↓
React Query
↓
Service API
↓
Supabase
```

Follow this pattern consistently.

### Pages

Files inside `pages/` represent routes.

Pages should mainly compose feature components.

Avoid putting Supabase queries or large business logic directly inside pages.

Example:

```text
pages/AddProduct.jsx
↓
features/products/AddProductForm.jsx
```

### Features

`features/` contains feature-specific UI, forms, hooks, and logic.

Example:

```text
features/products/
├── AddProductForm.jsx
├── EditProductForm.jsx
├── ProductsTable.jsx
├── ProductRow.jsx
├── Pagination.jsx
├── useGetProducts.js
├── useGetProduct.js
├── useAddProduct.js
├── useUpdateProduct.js
└── useDeleteProduct.js
```

Do not create unnecessary nested folders inside a feature.

Keep the structure simple until additional organization is genuinely needed.

### Services

`services/` owns communication with Supabase.

Examples:

```text
productsApi.js
categoriesApi.js
settingsApi.js
usersApi.js
authApi.js
```

A service function performs the actual database/storage operation.

For example:

```text
addProduct()
getProducts()
getProduct()
updateProduct()
```

UI components must NOT query Supabase directly.

### Custom Hooks

React Query should normally be wrapped in feature-specific custom hooks.

Example:

```text
services/productsApi.js
        ↓
features/products/useAddProduct.js
        ↓
features/products/AddProductForm.jsx
```

Components should consume simple APIs such as:

```js
const { addProduct, isAdding } = useAddProduct();
```

instead of implementing mutations themselves.

---

# Routing

Use these primary routes:

```text
/login
/dashboard
/products
/products/new
/products/:id/edit
/categories
/accounts
/settings
```

All admin routes except `/login` must be protected.

Unauthenticated users should be redirected to `/login`.

After successful login, redirect to `/dashboard`.

---

# React Query

Use React Query for server state.

Use `useQuery` for fetching and `useMutation` for modifications.

Examples:

```text
useGetProducts
useGetProduct
useAddProduct
useUpdateProduct
useGetCategories
```

After a mutation, invalidate only the queries affected by that mutation.

Do not invalidate or refetch unrelated application data.

Keep query keys predictable and consistent.

---

# React Hook Form

Use React Hook Form for forms.

Forms must handle:

* validation
* useful validation messages
* default values when editing
* disabled submit state while saving
* mutation errors
* successful submission

Do not create complex form abstractions unless multiple forms genuinely need them.

---

# Toast Notifications

Use React Hot Toast for user feedback.

Use toast notifications for important mutation results such as:

* successful creation
* successful update
* successful removal
* failed database operations
* failed image uploads

Do not show unnecessary toasts for normal navigation or fetching.

---

# Database

The existing Supabase database is the source of truth.

Do NOT modify or redesign the database schema unless explicitly requested.

Do NOT invent columns that do not exist.

Inspect the existing schema or existing storefront implementation whenever exact column names are uncertain.

---

# Products

Products are the core feature of the dashboard.

The Products section must support:

* displaying products
* searching
* filtering
* pagination
* adding products
* editing products
* activating/deactivating products
* variants
* images

A product consists of its main `products` record plus related variants and images.

---

# Product Variants

Variants are stored in:

```text
product_variants
```

Important fields:

```text
id
product_id
size
is_sold_out
```

Relationship:

```text
product_variants.product_id → products.id
```

Sizes are **free text**.

Do NOT create a predefined size list.

Valid sizes may include values such as:

```text
S
XL
XXL
30
32
One Size
```

There is currently no color variant system.

Do NOT introduce color logic.

---

# Product Images

Product image records are stored in:

```text
product_images
```

Important fields:

```text
id
product_id
image_path
display_order
```

Product files are stored in the Supabase Storage bucket:

```text
products
```

Use a folder for each product:

```text
{product_id}/
```

The database stores the image path.

Do not unnecessarily store duplicated public URLs.

Image order is controlled using:

```text
display_order
```

The first image according to `display_order` acts as the primary/cover image.

Image management should support:

* upload
* preview
* remove
* ordering

When removing an image, keep the Storage file and database record synchronized.

Handle partial failures carefully.

---

# Creating Products

Product creation is a multi-step operation.

The expected flow is:

```text
Create product
↓
Get product ID
↓
Create variants
↓
Upload images into {product_id}/
↓
Create product_images records
↓
Invalidate relevant queries
↓
Show success feedback
```

Do not treat product creation as only an insert into `products`.

Avoid leaving inconsistent records when part of the operation fails.

---

# Editing Products

The edit workflow must allow management of:

* main product information
* category
* active status
* price
* discount price
* variants
* sold-out state
* images
* image ordering

Reuse sensible product form logic between Add and Edit where doing so keeps the code simpler.

Do not force reuse if it makes the implementation harder to understand.

---

# Product Availability and Deletion

Use:

```text
is_active = false
```

only to make a product unavailable in the storefront.

When the admin deletes a product, remove the product and its related variants,
image records, and Storage files deliberately and keep these resources synchronized.

---

# Products Search, Filters and Pagination

The Products page should include:

* search
* category filter
* active/inactive status filter
* pagination

These values must be represented in the URL query parameters.

Example:

```text
/products?search=hoodie&category=hoodies&status=active&page=2
```

The URL is the source of truth for product-list controls.

Refreshing the page or using browser Back/Forward should preserve the current list state.

When search or filters change, reset the page to `1`.

Product filtering and pagination should happen through the Supabase query rather than fetching the entire database and filtering it in the browser.

A typical flow is:

```text
URL Search Params
↓
useGetProducts(params)
↓
getProducts(params)
↓
Supabase query
```

Keep the implementation straightforward.

---

# Categories

Categories are stored in:

```text
categories
```

Products reference categories through their category relationship.

The Categories page should support the existing store requirements, including:

* displaying categories
* adding categories
* editing categories
* managing category images

Be careful when attempting to remove a category referenced by existing products.

Do not silently break relationships.

---

# Settings

The Settings page manages the existing storefront settings.

Do NOT invent settings fields.

Inspect the existing `settings` schema and storefront implementation before creating the settings form.

Only expose settings that actually exist and are useful to the store owner.

---

# Accounts

Accounts are based on Supabase Authentication.

Never manually store passwords.

Never expose the Supabase `service_role` key in the React application.

Do not implement browser-side admin operations that require privileged Supabase credentials.

If account creation/deletion requires trusted server-side privileges, clearly identify that requirement rather than implementing an insecure workaround.

---

# Authentication

Use Supabase Auth.

The dashboard is private.

All dashboard routes must require an authenticated session.

Handle:

* initial session loading
* login
* logout
* expired/invalid sessions
* protected routes

Do not rely only on hidden UI for security.

Database RLS and Storage policies remain important.

---

# Dashboard

Keep the Dashboard useful but simple.

It may display useful store statistics such as:

* total products
* active products
* categories
* variants
* sold-out variants

Do not create complex analytics or charts without a real requirement.

---

# UI Direction

PHASE Admin should feel:

* clean
* minimal
* modern
* fast
* practical
* easy to understand

This is an operational dashboard, not a marketing website.

Prioritize usability over decoration.

Avoid unnecessary animations and visual effects.

Actions should be easy to discover.

Forms should be easy to scan.

Tables should remain readable.

---

# Typography

Use **Inter** as the application font.

It is already loaded globally.

Do not introduce additional fonts unless explicitly requested.

---

# Colors

Use the project's global CSS color variables.

Do not introduce random hardcoded HEX colors throughout components.

Reuse the established variables for:

* backgrounds
* surfaces
* text
* muted text
* borders
* primary actions
* success
* warning
* danger states

Maintain visual consistency across the entire dashboard.

---

# Shared UI

Reusable generic components belong in:

```text
src/ui/
```

Examples may include:

```text
Button
Input
Spinner
Modal
ConfirmDialog
```

Only extract a component into `ui/` when it is genuinely generic.

Feature-specific components should remain inside their feature.

Do not build a large design system unnecessarily.

---

# Responsive Behavior

The dashboard must remain usable on smaller screens.

The sidebar should adapt appropriately on mobile.

Wide tables may use horizontal scrolling instead of being completely redesigned as cards.

Forms should stack naturally on smaller screens.

Do not sacrifice desktop usability solely to avoid horizontal table scrolling.

---

# Naming Conventions

Components and pages:

```text
PascalCase.jsx
```

Examples:

```text
ProductsTable.jsx
AddProductForm.jsx
Products.jsx
```

Hooks:

```text
useSomething.js
```

Examples:

```text
useGetProducts.js
useAddProduct.js
useUpdateProduct.js
```

Services:

```text
somethingApi.js
```

Examples:

```text
productsApi.js
categoriesApi.js
```

Use clear names over clever abstractions.

---

# Loading, Error and Empty States

Every data-driven feature should consider:

* loading
* error
* empty
* success

Do not leave blank screens while data is loading.

Do not silently swallow errors.

Empty search results should be distinguishable from having no products at all when useful.

Mutation buttons should prevent accidental repeated submissions while pending.

---

# Security

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

inside the Vite frontend.

Only browser-safe environment variables may be used client-side.

Respect Supabase:

* authentication
* RLS
* Storage policies

Do not assume that protecting React routes makes database operations secure.

---

# Code Quality

Prefer simple, readable JavaScript.

Avoid:

* premature abstraction
* giant components
* duplicated business logic
* unnecessary Context providers
* unnecessary global state
* direct Supabase calls from UI components
* unnecessary dependencies
* unnecessary refactors

Use local state for local UI state.

Use URL state for product search/filter/pagination.

Use React Query for server state.

Use React Hook Form for form state.

---

# Working Rules for Codex

Before changing code:

1. Inspect the relevant existing files.
2. Understand the current implementation.
3. Follow the established project architecture.
4. Check the actual database structure when necessary.
5. Avoid assumptions when the existing code can provide the answer.

When implementing:

1. Make the smallest coherent change needed.
2. Do not modify unrelated functionality.
3. Follow existing naming and styling conventions.
4. Reuse existing utilities/components when appropriate.
5. Do not add complexity without a concrete benefit.

After implementing:

1. Review the changed code.
2. Check imports and runtime issues.
3. Run lint when appropriate.
4. Check loading/error/empty states.
5. Check important edge cases.
6. Check responsive behavior for UI changes.
7. Fix significant problems discovered during the review.

If a requirement is unclear or conflicts with the existing database/application architecture, identify the conflict instead of silently inventing behavior.

The goal is a **production-quality but deliberately simple PHASE Admin dashboard**.
