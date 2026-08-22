<div align="center">

# ⚡ PHASE Admin

### The calm, capable back office for **PHASE Store**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20PHASE%20Admin-111827?style=for-the-badge&logo=cloudflare&logoColor=white)](https://phase-admin.anasskafafy5.workers.dev/)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

### [🚀 Explore the live demo](https://phase-admin.anasskafafy5.workers.dev/)

</div>

## 🧭 What is PHASE Admin?

**PHASE Admin** is the private operations dashboard that powers **PHASE Store**. While PHASE Store is the customer-facing clothing storefront, this app gives the store owner one focused place to manage the catalogue and the operational details behind it.

Both applications connect to the same Supabase project, so changes made here—such as publishing a product, updating its price, or changing its available sizes—are reflected in the store’s real data. ✨

## 🎯 The problem it solves

Running a small fashion store should not require editing database rows, juggling image links, or remembering which sizes are sold out. PHASE Admin turns those everyday jobs into a clear workflow:

- 🛍️ Create, update, search, filter, and manage products from one screen.
- 📦 Add flexible size variants and mark individual sizes as sold out.
- 🖼️ Upload, preview, remove, and order product images safely.
- 🗂️ Organize the catalogue with categories and category images.
- 📊 See a useful store snapshot: products, active items, categories, and sold-out variants.
- 🔐 Keep the dashboard private with Supabase Authentication and protected routes.
- ⚙️ Maintain storefront contact details without touching code.

The result is a fast, practical control room built for day-to-day store management—not a complicated enterprise system.

## ✨ Highlights

| Area | What you can do |
| --- | --- |
| **Dashboard** | View essential catalogue and availability statistics at a glance. |
| **Products** | Manage product details, prices, discounts, activity status, variants, and images. |
| **Catalogue controls** | Search, category/status filter, sort, and paginate products—with state preserved in the URL. |
| **Categories** | Create, edit, and maintain the categories that organize the storefront. |
| **Settings** | Update Instagram and WhatsApp contact details used by PHASE Store. |
| **Accounts** | Sign in securely and manage the current admin account. |

## 🛠️ Tech stack

- ⚛️ **React 19** — component-based user interface
- ⚡ **Vite** — fast development server and production builds
- 🧭 **React Router** — client-side routing and protected admin pages
- 🎨 **Tailwind CSS** — responsive, consistent styling
- 🗃️ **Supabase** — authentication, PostgreSQL data, and product/category image storage
- 🔄 **TanStack React Query** — server-state caching, mutations, and focused invalidation
- 📝 **React Hook Form** — lightweight, validated product and settings forms
- 🔔 **React Hot Toast** — clear feedback for important actions
- 🔤 **Inter** — clean, highly legible interface typography

## 🗂️ Project structure

```text
src/
├── features/                   # Feature UI, React Query hooks, and form logic
│   ├── auth/                   # Login and account management
│   ├── categories/             # Category list, forms, and mutations
│   ├── dashboard/              # Store statistics
│   ├── products/               # Product forms, table, filters, variants, images
│   └── settings/               # Store contact settings
├── pages/                      # Route-level page composition
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   ├── ProductPage.jsx
│   ├── Categories.jsx
│   ├── Accounts.jsx
│   ├── Settings.jsx
│   └── Login.jsx
├── services/                   # Supabase data-access layer
│   ├── authApi.js
│   ├── categoryApi.js
│   ├── dashboardApi.js
│   ├── productsApi.js
│   ├── settingsApi.js
│   └── supabase.js
├── ui/                         # Reusable interface components
├── App.jsx                     # Routes and protected application shell
├── index.css                   # Global styles and design tokens
└── main.jsx                    # Application entry point
```

The code follows a deliberately simple flow:

```text
Page → Feature component → Custom hook → React Query → Service API → Supabase
```

## 🚀 Run locally

### 1. Clone and install

```bash
git clone <your-repository-url>
cd phase-admin
npm install
```

### 2. Configure Supabase

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

> 🔒 Use only the browser-safe Supabase anonymous key here. Never expose a `service_role` key in the frontend.

### 3. Start the dashboard

```bash
npm run dev
```

To create a production build:

```bash
npm run build
```

## 🔒 Data & access

PHASE Admin is designed as a private companion to PHASE Store. Authentication is handled with Supabase Auth, and the application’s protected routes keep unauthenticated visitors at the login screen. Database row-level security and Storage policies remain the authority for safeguarding the shared store data.

---

<div align="center">

Built for the people behind **PHASE Store** 🖤

</div>
