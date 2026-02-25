# Local Development Setup Guide

## Prerequisites

Before you start, make sure you have the following installed on your computer:

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`
   - Should show: v18.x.x or higher

2. **pnpm** (Package Manager)
   - Install: `npm install -g pnpm`
   - Verify installation: `pnpm --version`
   - Should show: v10.x.x or higher

3. **Git** (Version Control)
   - Download: https://git-scm.com/
   - Verify installation: `git --version`
   - Should show: git version 2.x.x or higher

4. **MySQL** (Database)
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql:8.0`
   - Verify: `mysql --version`

### Optional but Recommended

- **Visual Studio Code** (Code Editor): https://code.visualstudio.com/
- **Docker** (for running MySQL in container): https://www.docker.com/
- **Postman** (for API testing): https://www.postman.com/

---

## Step 1: Clone the Repository

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/ankitpatidar9098/Ankit-masalee.git

# Navigate to project directory
cd Ankit-masalee
```

---

## Step 2: Install Dependencies

```bash
# Install all project dependencies
pnpm install

# This will install:
# - Frontend dependencies (React, Tailwind, etc.)
# - Backend dependencies (Express, tRPC, etc.)
# - Database tools (Drizzle ORM, etc.)
# - Development tools (TypeScript, Vitest, etc.)
```

**Expected output:**
```
Progress: resolved 200, reused 150, downloaded 50, added 200
Done in 2.5s
```

---

## Step 3: Configure Environment Variables

### Create `.env.local` file

In the project root directory, create a file named `.env.local`:

```bash
# Create the file
touch .env.local
```

### Add the following environment variables:

```env
# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/quality_kitchen_spices

# JWT Secret (for session management)
JWT_SECRET=your-secret-key-change-this-in-production

# OAuth Configuration (for authentication)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Information
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# API Configuration
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# App Configuration
VITE_APP_TITLE=Quality Kitchen Spices
VITE_APP_LOGO=/logo.png
```

**Note:** For local development, you can use placeholder values. The important ones are:
- `DATABASE_URL` - Must point to your local MySQL database
- `JWT_SECRET` - Any random string (change in production)

### Quick Setup for Local Testing

For quick local testing without external services:

```env
DATABASE_URL=mysql://root:password@localhost:3306/quality_kitchen_spices
JWT_SECRET=dev-secret-key-12345
VITE_APP_ID=dev-app-id
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000
OWNER_OPEN_ID=dev-owner
OWNER_NAME=Developer
BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=dev-key
VITE_FRONTEND_FORGE_API_KEY=dev-key
VITE_FRONTEND_FORGE_API_URL=http://localhost:3000
VITE_APP_TITLE=Quality Kitchen Spices
```

---

## Step 4: Set Up Database

### Option A: Using Local MySQL

```bash
# Start MySQL service (macOS with Homebrew)
brew services start mysql

# Or start MySQL on Windows (use MySQL Command Line Client)
# Or start MySQL on Linux
sudo systemctl start mysql

# Create database
mysql -u root -p -e "CREATE DATABASE quality_kitchen_spices;"

# Run migrations
pnpm db:push
```

### Option B: Using Docker

```bash
# Start MySQL in Docker
docker run --name mysql-spices \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=quality_kitchen_spices \
  -p 3306:3306 \
  -d mysql:8.0

# Run migrations
pnpm db:push
```

### Verify Database Setup

```bash
# Check if database exists
mysql -u root -p quality_kitchen_spices -e "SHOW TABLES;"

# Should show tables like: users, products, categories, pageContent
```

---

## Step 5: Start Development Server

```bash
# Start the development server
pnpm dev

# Expected output:
# [OAuth] Initialized with baseURL: https://api.manus.im
# Server running on http://localhost:3000/
# Vite dev server running at http://localhost:5173/
```

The development server will:
- Start Express backend on `http://localhost:3000`
- Start Vite frontend on `http://localhost:5173`
- Enable hot module reloading (HMR)
- Watch for file changes and auto-reload

---

## Step 6: Access the Website

### Frontend
Open your browser and go to:
```
http://localhost:5173
```

You should see the Quality Kitchen Spices homepage with:
- Hero banner
- Whole spices section
- Ground spices section
- Special collections
- Footer

### Admin Dashboard
To access the admin panel:
```
http://localhost:5173/admin
```

**Note:** You may need to authenticate first. For local development, you can:
1. Skip OAuth by modifying the auth check
2. Or set up a local OAuth provider
3. Or use the development user context

---

## Common Development Commands

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- upload.test.ts

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

### Code Quality

```bash
# Check TypeScript errors
pnpm check

# Format code
pnpm format

# Lint code (if configured)
pnpm lint
```

### Database Operations

```bash
# Generate migrations
pnpm db:generate

# Run pending migrations
pnpm db:migrate

# Push schema changes
pnpm db:push

# Open database studio (GUI)
pnpm db:studio
```

### Building for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

---

## Project Structure

```
quality-kitchen-spices/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/            # Page components (Home, Admin, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities and helpers
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   └── index.html            # HTML template
│
├── server/                    # Backend (Express + tRPC)
│   ├── routers/              # API endpoints
│   │   ├── admin.ts          # Admin API
│   │   └── upload.ts         # Image upload API
│   ├── db.ts                 # Database queries
│   ├── routers.ts            # Main router
│   ├── storage.ts            # S3 storage
│   └── _core/                # Core server logic
│
├── drizzle/                   # Database
│   ├── schema.ts             # Database schema
│   └── migrations/           # Migration files
│
├── shared/                    # Shared code
│   ├── const.ts              # Constants
│   └── types.ts              # Shared types
│
├── .env.local                # Environment variables (create this)
├── package.json              # Dependencies
├── pnpm-lock.yaml            # Dependency lock file
└── tsconfig.json             # TypeScript config
```

---

## Development Workflow

### 1. Making Changes to Frontend

```bash
# Edit files in client/src/
# Changes auto-reload in browser (HMR)
# No restart needed!

# Example: Edit client/src/pages/Home.tsx
# Browser updates automatically
```

### 2. Making Changes to Backend

```bash
# Edit files in server/
# Dev server auto-restarts
# May take 2-3 seconds

# Example: Edit server/routers/admin.ts
# Server restarts and reloads
```

### 3. Making Database Changes

```bash
# Edit drizzle/schema.ts
pnpm db:push
# Creates new tables/columns
# Runs migrations
```

### 4. Testing Changes

```bash
# Run tests before committing
pnpm test

# All tests should pass
# If tests fail, fix the code
```

---

## Troubleshooting

### Issue: Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Issue: Database connection failed

```bash
# Check if MySQL is running
mysql -u root -p

# If connection fails:
# 1. Start MySQL service
# 2. Check DATABASE_URL in .env.local
# 3. Verify credentials (username/password)
# 4. Check if database exists
```

### Issue: Dependencies not installing

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: TypeScript errors

```bash
# Check for errors
pnpm check

# Fix common issues:
# 1. Restart dev server
# 2. Clear .next or dist folder
# 3. Reinstall dependencies
```

### Issue: Hot reload not working

```bash
# Restart dev server
# Press Ctrl+C to stop
pnpm dev

# Or hard refresh browser (Ctrl+Shift+R)
```

---

## IDE Setup

### Visual Studio Code

**Recommended Extensions:**
1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **TypeScript Vue Plugin** - Vue.volar
4. **Prettier - Code formatter** - esbenp.prettier-vscode
5. **ESLint** - dbaeumer.vscode-eslint

**Settings (.vscode/settings.json):**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## API Testing

### Using cURL

```bash
# Get all products
curl http://localhost:3000/api/trpc/admin.listProducts

# Create a product
curl -X POST http://localhost:3000/api/trpc/admin.createProduct \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Turmeric Powder",
    "price": 299,
    "categoryId": 1,
    "description": "Premium turmeric"
  }'
```

### Using Postman

1. Open Postman
2. Create new request
3. Set method to POST
4. URL: `http://localhost:3000/api/trpc/admin.createProduct`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON):
```json
{
  "name": "Turmeric Powder",
  "price": 299,
  "categoryId": 1,
  "description": "Premium turmeric"
}
```

---

## Performance Tips

1. **Use pnpm instead of npm**
   - Faster installation
   - Better disk usage
   - Stricter dependency management

2. **Enable TypeScript strict mode**
   - Catch errors early
   - Better IDE support

3. **Use React DevTools**
   - Debug component renders
   - Check props and state

4. **Monitor bundle size**
   ```bash
   pnpm build
   # Check dist/ folder size
   ```

---

## Next Steps

1. **Explore the codebase**
   - Read through server/routers.ts
   - Check client/src/pages/Admin.tsx
   - Review drizzle/schema.ts

2. **Make your first change**
   - Edit a product name
   - Add a new category
   - Upload a product image

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

---

## Getting Help

- **TypeScript errors**: Check tsconfig.json and type definitions
- **Build errors**: Clear node_modules and reinstall
- **Runtime errors**: Check browser console and server logs
- **Database issues**: Verify DATABASE_URL and run migrations

---

## Additional Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/
- **tRPC Docs**: https://trpc.io/
- **Tailwind CSS**: https://tailwindcss.com/
- **Drizzle ORM**: https://orm.drizzle.team/
- **TypeScript**: https://www.typescriptlang.org/

---

## Quick Reference

```bash
# Clone and setup
git clone https://github.com/ankitpatidar9098/Ankit-masalee.git
cd Ankit-masalee
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
pnpm db:push

# Start development
pnpm dev

# Open in browser
# Frontend: http://localhost:5173
# Admin: http://localhost:5173/admin
# Backend API: http://localhost:3000/api/trpc

# Run tests
pnpm test

# Build for production
pnpm build
pnpm start
```

Happy coding! 🚀
