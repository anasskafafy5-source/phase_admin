# PHASE Admin — Database Reference

This file documents the Supabase database structure used by PHASE Store and PHASE Admin.

The existing database is the source of truth.

Do not rename, remove, or invent columns unless explicitly requested.

---

# Tables

## products

Main product table.

Expected fields:

```text
id
name
description
price
discount_price
category_id
is_active
created_at
```

### Notes

* `id` is the product identifier.
* `name` is required.
* `price` is required.
* `discount_price` is optional.
* `category_id` links the product to a category.
* `is_active` controls whether the product should be visible/available in the storefront.
* It is not a replacement for deletion. A deleted product must be removed deliberately.

Relationship:

```text
products.category_id → categories.id
```

---

## product_variants

Stores product size variants.

Fields:

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

### Rules

* `size` is free text.
* Examples:

```text
S
M
XL
32
One Size
```

* There is currently no color variant system.
* Do not add color fields or color-related logic.

Example:

```json
{
  "product_id": "PRODUCT_ID",
  "size": "XL",
  "is_sold_out": false
}
```

---

## product_images

Stores image metadata.

Fields:

```text
id
product_id
image_path
display_order
```

Relationship:

```text
product_images.product_id → products.id
```

Images are stored in the Supabase Storage bucket:

```text
products
```

Folder structure:

```text
{product_id}/filename.webp
```

Example database value:

```text
abc123/front.webp
```

Do not store the full public URL unless the existing database already requires it.

The first image according to `display_order` is treated as the main image.

Example:

```json
{
  "product_id": "PRODUCT_ID",
  "image_path": "PRODUCT_ID/front.webp",
  "display_order": 0
}
```

---

## categories

Stores store categories.

Fields:

```text
id
name
image_path
```

Relationship:

```text
categories.id ← products.category_id
```

Category images are stored in the Supabase Storage bucket:

```text
categories
```

Do not delete a category without checking whether existing products reference it.

---

## settings

Stores storefront settings.

The exact existing schema must be inspected before implementing the Settings page.

Do not invent settings columns.

Only expose real existing fields.

---

# Product Shape Used by the Admin

A product in the admin UI should be treated as one logical object containing:

```json
{
  "name": "PHASE Logo Tee",
  "description": "Oversized cotton t-shirt",
  "price": 850,
  "discount_price": 750,
  "category_id": "CATEGORY_ID",
  "is_active": true,
  "variants": [
    {
      "size": "M",
      "is_sold_out": false
    },
    {
      "size": "L",
      "is_sold_out": false
    }
  ],
  "images": []
}
```

Important:

`variants` and `images` are not stored directly inside the `products` row.

They belong to related tables/storage.

---

# Creating a New Product

Creating a product is a multi-step process.

## Step 1 — Validate Form Data

Required core data should be validated before sending requests.

Example:

```text
name
price
category_id
```

Optional data:

```text
description
discount_price
is_active
```

Variants should also be validated.

Do not create duplicate empty variants.

---

## Step 2 — Insert Product

Insert the main product record first.

Example logical payload:

```json
{
  "name": "PHASE Logo Tee",
  "description": "Oversized cotton t-shirt",
  "price": 850,
  "discount_price": 750,
  "category_id": "CATEGORY_ID",
  "is_active": true
}
```

The insert must return the newly created product ID.

Conceptually:

```js
const product = await createProduct(productData);
```

The returned ID is then used for variants and images.

---

# Step 3 — Insert Variants

Convert the form variants into rows containing the new product ID.

Example:

```json
[
  {
    "product_id": "PRODUCT_ID",
    "size": "M",
    "is_sold_out": false
  },
  {
    "product_id": "PRODUCT_ID",
    "size": "L",
    "is_sold_out": false
  }
]
```

Insert them into:

```text
product_variants
```

---

# Step 4 — Upload Images

Each selected image should be uploaded into:

```text
products/{product_id}/
```

Example:

```text
products/abc123/front.webp
products/abc123/back.webp
```

Use unique file names where necessary to prevent accidental overwrite.

---

# Step 5 — Insert Image Records

After successful uploads, create rows inside:

```text
product_images
```

Example:

```json
[
  {
    "product_id": "abc123",
    "image_path": "abc123/front.webp",
    "display_order": 0
  },
  {
    "product_id": "abc123",
    "image_path": "abc123/back.webp",
    "display_order": 1
  }
]
```

---

# Step 6 — Finish the Mutation

After successful creation:

* invalidate the Products query
* show a success toast
* redirect to the appropriate page if needed

Do not refetch unrelated queries.

---

# Product Creation Failure Handling

Product creation has multiple operations.

Possible failure points include:

```text
product insert
variant insert
image upload
image record insert
```

Do not ignore partial failures.

If an operation fails after the main product was created, handle the situation deliberately.

Avoid leaving:

* unused uploaded images
* image rows pointing to missing files
* variants without an intended product state
* unexpected half-created products

Keep the implementation simple but safe.

---

# Getting Products

The Products page uses server-side Supabase filtering and pagination.

Expected parameters include:

```text
search
category
status
page
```

Example URL:

```text
/products?search=tee&category=shirts&status=active&page=2
```

The service should translate these parameters into a Supabase query.

Do not fetch all products and perform the main filtering in the browser.

---

# Getting a Single Product

When editing a product, retrieve:

```text
product
category
product_variants
product_images
```

The edit form should receive one normalized object.

Example:

```json
{
  "id": "abc123",
  "name": "PHASE Logo Tee",
  "price": 850,
  "discount_price": 750,
  "category_id": "CATEGORY_ID",
  "is_active": true,
  "variants": [
    {
      "id": "VARIANT_ID",
      "size": "M",
      "is_sold_out": false
    }
  ],
  "images": [
    {
      "id": "IMAGE_ID",
      "image_path": "abc123/front.webp",
      "display_order": 0
    }
  ]
}
```

---

# Updating a Product

Updating a product may involve three different resources:

```text
products
product_variants
product_images / Storage
```

Do not assume one database update handles the entire edit operation.

## Main Product

Update changed fields in:

```text
products
```

## Variants

Support:

```text
add
update
remove
change is_sold_out
```

Keep all variants linked to the correct `product_id`.

## Images

Support:

```text
upload
delete
reorder
```

If an image is removed:

1. remove it from Supabase Storage
2. remove its `product_images` record

If display order changes, update `display_order`.

---

# Product Price Rules

Normal selling price:

```text
price
```

Optional discounted price:

```text
discount_price
```

If `discount_price` exists, the storefront treats it as the effective selling price.

Do not calculate or persist a separate effective price column unless explicitly requested.

---

# Product Availability State

Use:

```text
is_active
```

to control whether a product is available in the storefront.

When deleting a product, remove its product record, related variants and image
records, and associated files in Supabase Storage. Keep the database and Storage synchronized.

---

# Data Access Rule

All direct Supabase operations belong inside:

```text
src/services/
```

Example:

```text
src/services/productsApi.js
```

React components must not call Supabase directly.

Feature hooks call service functions through React Query.

Expected flow:

```text
Form
↓
useAddProduct
↓
addProduct
↓
productsApi.js
↓
Supabase
```

---

# Important Rule

If the real Supabase schema differs from this document, inspect the actual schema and existing storefront code before modifying the application.

The real database structure always wins over assumptions in this file.
