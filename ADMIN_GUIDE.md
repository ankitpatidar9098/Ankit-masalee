# Admin Dashboard Guide - Quality Kitchen Spices

## Overview

The Quality Kitchen Spices website now includes a full-featured admin dashboard for managing all content, products, and categories. The backend is fully activated with database integration.

## Accessing the Admin Dashboard

1. **Login**: Visit the website and log in with your Manus account (you must be the project owner or have admin role)
2. **Navigate to Admin**: Go to `/admin` route or look for the admin link in the navigation
3. **Manage Content**: Use the three tabs to manage Products, Categories, and Page Content

## Features

### 1. Products Management

**View All Products**
- See all spices in your inventory
- View pricing, stock levels, and descriptions
- Check product status (active/inactive)

**Add New Product**
- Click "Add Product" button
- Fill in:
  - Product Name (required)
  - Category (select from existing categories)
  - Price in paise (e.g., 50000 = ₹500)
  - Stock quantity
  - Description
  - Available sizes (comma-separated, default: "1kg,500g,250g")
  - SKU (optional)

**Edit Product**
- Click the edit icon on any product card
- Update any field and save

**Delete Product**
- Click the trash icon to remove a product
- Confirmation required

### 2. Categories Management

**View All Categories**
- See all product categories
- View category icons and descriptions
- Check display order

**Add New Category**
- Click "Add Category" button
- Fill in:
  - Category Name (required)
  - Slug (URL-friendly name, required)
  - Icon (emoji, e.g., 🌿)
  - Description

**Edit Category**
- Click the edit icon on any category card
- Update fields and save

**Delete Category**
- Click the trash icon to remove a category
- Note: Products in this category should be reassigned first

### 3. Page Content Management

**View All Sections**
- See all editable page content sections
- View titles, descriptions, and button text
- Check which sections are active

**Add New Section**
- Click "Add Section" button
- Fill in:
  - Section Key (unique identifier, e.g., "hero", "spice-up-bite")
  - Title
  - Subtitle
  - Description
  - Button Text (optional)
  - Button Link (optional)

**Edit Section**
- Click the edit icon on any section
- Update content and save

**Delete Section**
- Click the trash icon to remove a section

## Database Schema

### Products Table
```
- id: Unique identifier
- categoryId: Link to category
- name: Product name
- description: Detailed description
- price: Price in paise (cents)
- originalPrice: For discount calculations
- sku: Stock keeping unit
- image: CDN URL to product image
- sizes: Available sizes (comma-separated)
- stock: Quantity in inventory
- isActive: 1 (active) or 0 (inactive)
- displayOrder: Sort order
- createdAt, updatedAt: Timestamps
```

### Categories Table
```
- id: Unique identifier
- name: Category name
- description: Category description
- icon: Emoji or icon name
- slug: URL-friendly identifier
- displayOrder: Sort order
- createdAt, updatedAt: Timestamps
```

### PageContent Table
```
- id: Unique identifier
- sectionKey: Unique section identifier
- title: Section title
- subtitle: Section subtitle
- description: Section content
- image: CDN URL to section image
- buttonText: CTA button text
- buttonLink: Button link destination
- displayOrder: Sort order
- isActive: 1 (active) or 0 (inactive)
- createdAt, updatedAt: Timestamps
```

## API Endpoints

All admin endpoints are protected and require authentication. Only admin users can create, update, or delete items.

### Categories API
```
GET  /api/trpc/admin.categories.list     - List all categories
GET  /api/trpc/admin.categories.get      - Get single category
POST /api/trpc/admin.categories.create   - Create category (admin only)
POST /api/trpc/admin.categories.update   - Update category (admin only)
POST /api/trpc/admin.categories.delete   - Delete category (admin only)
```

### Products API
```
GET  /api/trpc/admin.products.list       - List all products
GET  /api/trpc/admin.products.get        - Get single product
POST /api/trpc/admin.products.create     - Create product (admin only)
POST /api/trpc/admin.products.update     - Update product (admin only)
POST /api/trpc/admin.products.delete     - Delete product (admin only)
```

### Page Content API
```
GET  /api/trpc/admin.pageContent.list    - List all page content
GET  /api/trpc/admin.pageContent.get     - Get single content
POST /api/trpc/admin.pageContent.create  - Create content (admin only)
POST /api/trpc/admin.pageContent.update  - Update content (admin only)
POST /api/trpc/admin.pageContent.delete  - Delete content (admin only)
```

## Local Development

### Running the Dev Server
```bash
cd /home/ubuntu/quality-kitchen-spices
pnpm install
pnpm dev
```

The server will start on `http://localhost:3000`

### Database Migrations
```bash
# Apply schema changes to database
pnpm db:push

# Generate migrations
drizzle-kit generate

# Run migrations
drizzle-kit migrate
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- admin.test.ts
```

## Permissions & Security

- **Public Users**: Can view products and page content
- **Authenticated Users**: Can view all content
- **Admin Users**: Can create, read, update, and delete all content

Admin access is controlled by the `role` field in the users table:
- `role: "user"` - Regular user
- `role: "admin"` - Administrator

To promote a user to admin, update their role in the database directly.

## Troubleshooting

### Products not showing
1. Ensure products have `isActive = 1`
2. Check that category exists and is linked correctly
3. Verify database connection

### Admin dashboard not accessible
1. Ensure you're logged in
2. Check that your user has `role = "admin"`
3. Clear browser cache and try again

### Changes not reflecting
1. The frontend caches data - refresh the page
2. Check browser console for API errors
3. Verify database changes with SQL query

## Future Enhancements

- [ ] Bulk product import/export
- [ ] Image upload directly from admin
- [ ] Product variants and options
- [ ] Inventory alerts
- [ ] Order management
- [ ] Customer management
- [ ] Analytics dashboard
- [ ] SEO management
- [ ] Email notifications
- [ ] Multi-language support

## Support

For issues or questions about the admin system, check the logs:
- Server logs: Check terminal output
- Browser console: F12 → Console tab
- Network requests: F12 → Network tab

Contact the development team for additional support.
