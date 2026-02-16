# Quality Kitchen Spices - Local Setup Guide

## Backend Language & Architecture

### Current Setup: **Frontend-Only (Static)**

This website is a **static frontend application** with NO backend server currently running. Here's what that means:

**Frontend Technology Stack:**
- **Language**: JavaScript/TypeScript (React 19)
- **Framework**: React with Vite (build tool)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (pre-built React components)
- **Routing**: Wouter (client-side routing)
- **Package Manager**: pnpm

**Backend Technology Stack (Placeholder Only):**
- **Language**: TypeScript (Node.js)
- **Framework**: Express.js (minimal setup)
- **Status**: Currently NOT ACTIVE - only placeholder files exist

The backend folder (`server/index.ts`) contains a basic Express server template but is **not used** in the current deployment. The website runs entirely in the browser.

---

## Project Structure

```
quality-kitchen-spices/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Main homepage component
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── ErrorBoundary.tsx   # Error handling
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Theme management
│   │   ├── App.tsx                 # Main app routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles & design tokens
│   ├── public/                      # Static assets
│   └── index.html                  # HTML template
├── server/                          # Backend (not active)
│   └── index.ts                    # Express server placeholder
├── shared/                          # Shared types
│   └── const.ts                    # Shared constants
├── package.json                     # Dependencies & scripts
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite build configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## How to Run Locally

### Prerequisites

Before starting, make sure you have installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **pnpm** (Package Manager)
   - Install globally: `npm install -g pnpm`
   - Verify: `pnpm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

---

## Step-by-Step Local Setup

### Step 1: Clone the Repository

```bash
# Clone your GitHub repository
git clone https://github.com/ankitpatidar9098/Ankit-masalee.git

# Navigate to the project directory
cd Ankit-masalee
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies using pnpm
pnpm install

# This will install:
# - React and React DOM
# - Tailwind CSS
# - Vite (development server)
# - TypeScript
# - All other dependencies listed in package.json
```

**Time**: Usually takes 2-5 minutes depending on your internet speed.

### Step 3: Start the Development Server

```bash
# Start the local development server
pnpm dev

# Output will show something like:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
```

### Step 4: Open in Browser

- Open your browser and go to: **http://localhost:5173/**
- The website will load with hot-reload enabled (changes save automatically)

---

## Available Commands

Here are all the commands you can run in your local project:

```bash
# Start development server (hot reload enabled)
pnpm dev

# Build for production
pnpm build

# Preview the production build locally
pnpm preview

# Check TypeScript for errors (without building)
pnpm check

# Format code with Prettier
pnpm format
```

---

## Understanding the Development Process

### How the Frontend Works

1. **React Components**: The website is built from reusable React components
   - `Home.tsx` - Main page with all sections
   - Components are written in TypeScript for type safety

2. **Styling**: Uses Tailwind CSS utility classes
   - No separate CSS files needed
   - Colors defined in `index.css` as CSS variables
   - Responsive design built-in

3. **Hot Module Replacement (HMR)**:
   - When you edit files, changes appear instantly in the browser
   - No manual refresh needed

4. **Build Process**:
   - Vite bundles all code into optimized files
   - Production build is much smaller and faster

### File You'll Most Likely Edit

**`client/src/pages/Home.tsx`** - Main website content
- Contains all sections: hero, products, inspiration, collections, footer
- Easy to modify text, images, colors
- Changes appear instantly when you save

**`client/src/index.css`** - Design tokens
- Color palette definitions
- Typography settings
- Global styles

---

## Common Tasks & Commands

### Add a New Page

1. Create a new file: `client/src/pages/YourPage.tsx`
2. Add route in `client/src/App.tsx`:
```tsx
<Route path="/your-page" component={YourPage} />
```
3. Access at: `http://localhost:5173/your-page`

### Change Colors

Edit `client/src/index.css` in the `:root` section:
```css
:root {
  --primary: oklch(0.65 0.15 45);  /* Change this */
  --background: oklch(0.95 0.002 50);
  /* ... other colors */
}
```

### Add New Dependencies

```bash
# Install a new package
pnpm add package-name

# Install a dev dependency
pnpm add -D package-name

# Restart the dev server after installing
pnpm dev
```

### Stop the Development Server

Press `Ctrl + C` in your terminal

---

## Troubleshooting

### Issue: Port 5173 already in use

```bash
# Use a different port
pnpm dev -- --port 3000
```

### Issue: Dependencies not installing

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Changes not appearing

```bash
# Clear browser cache and hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Issue: TypeScript errors

```bash
# Check for TypeScript errors
pnpm check

# This shows all type errors without building
```

---

## Future Backend Integration

If you want to add a backend later, here's what you'd do:

### Option 1: Use the Existing Express Setup

The `server/index.ts` file already has a basic Express server. To activate it:

1. Uncomment the build script in `package.json`
2. Run: `pnpm build` (builds frontend + backend)
3. Run: `pnpm start` (starts production server)

### Option 2: Separate Backend

Create a separate Node.js/Express project:

```bash
# Create a new backend project
mkdir backend
cd backend
npm init -y
npm install express cors dotenv

# Create server.js with your API routes
```

### Option 3: Use a Backend Service

- Firebase (Google's backend-as-a-service)
- Supabase (PostgreSQL + Auth)
- MongoDB Atlas (Database)
- AWS Lambda (Serverless functions)

---

## Project Dependencies Explained

| Package | Purpose |
|---------|---------|
| **react** | UI framework |
| **react-dom** | React rendering for web |
| **typescript** | Type-safe JavaScript |
| **vite** | Fast build tool & dev server |
| **tailwindcss** | Utility-first CSS framework |
| **@radix-ui/*** | Accessible UI components |
| **wouter** | Client-side routing |
| **lucide-react** | Icon library |
| **framer-motion** | Animation library |
| **zod** | Data validation |
| **react-hook-form** | Form handling |

---

## Performance Tips

1. **Images**: All images use CDN URLs (fast loading)
2. **Code Splitting**: Vite automatically splits code for faster loading
3. **Lazy Loading**: Components can be lazy-loaded if needed
4. **CSS**: Tailwind purges unused styles in production

---

## Next Steps

1. **Clone and run locally** using the commands above
2. **Explore the code** - Open `Home.tsx` to see how it's structured
3. **Make changes** - Edit colors, text, or add new sections
4. **Learn React** - Check out React documentation for more advanced features
5. **Deploy** - When ready, use Vercel, Netlify, or GitHub Pages

---

## Useful Resources

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev
- **TypeScript**: https://www.typescriptlang.org
- **shadcn/ui**: https://ui.shadcn.com

---

## Support

If you encounter any issues:

1. Check the error message in the terminal
2. Look at the browser console (F12 → Console tab)
3. Try clearing node_modules and reinstalling: `rm -rf node_modules && pnpm install`
4. Restart the dev server: `pnpm dev`

Happy coding! 🚀
