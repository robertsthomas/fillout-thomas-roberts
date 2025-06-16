# Fillout Form Builder

A modern, interactive form builder application built with Next.js, featuring dynamic page navigation, persistent form state management, and drag-and-drop functionality.

This project demonstrates how AI tools like Cursor can accelerate development while maintaining deep understanding of the codebase. While the core design decisions and architecture were carefully planned, AI assistance was leveraged to streamline the implementation of Next.js page logic. This approach showcases how we can build applications fast by with AI while still understanding the context of whats being built.


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone git@github.com:robertsthomas/fillout-thomas-roberts.git
cd fillout-thomas-roberts

# Install dependencies
pnpm install
# or
npm install
```

### Running the Application

#### Development Server
```bash
pnpm dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

#### Component Library (Ladle)
```bash
pnpm ladle serve
# or
npm run ladle serve
```
Open [http://localhost:61000](http://localhost:61000) to view the component stories.

## 🏗️ Architecture & Technologies

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

### State Management & Forms
- **[TanStack Store](https://tanstack.com/store/latest)** - Lightweight state management
- **[TanStack Form](https://tanstack.com/form/latest)** - Headless form state management
- **localStorage** - Persistent data storage

### UI Components & Interactions
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Swapy](https://swapy.tahazsh.com/)** - Drag & drop functionality
- **[Ladle](https://ladle.dev/)** - Component development environment

## 🎯 Application Features

### Multi-Page Form Builder
- **Dynamic Page Creation** - Add, rename, copy, duplicate, and delete form pages
- **Drag & Drop Reordering** - Intuitive page organization with Swapy
- **Real-time Navigation** - URL-based routing with instant page switching
- **Form State Persistence** - Each page maintains its own form data

### Interactive Page Navigator
- **Visual Page States** - Active/inactive indicators with custom icons
- **Inline Editing** - Click to rename pages with contenteditable
- **Dropdown Actions** - Comprehensive page management menu
- **Smart Drag Handling** - Automatic drag disable/enable during dropdown interactions

### Form Management
- **Auto-save Functionality** - Form data saves automatically as you type
- **Field Generation** - Dynamic form fields based on page configuration
- **Type-safe Forms** - Full TypeScript support with TanStack Form
- **Validation Ready** - Built-in error handling and validation support

## 🗄️ State Management Architecture

### TanStack Store Implementation
The application uses a centralized store pattern with the following structure:

```typescript
interface AppState {
  pages: Array<Page>;           // All form pages
  currentPageId: string | null; // Active page identifier
}

interface Page {
  title: string;        // Page display name
  id: string;          // Unique identifier
  formData: PageFormData; // Form field values
}
```

### Key Store Functions
- `initializePages()` - Set up initial page structure
- `addPage()` - Create new pages with empty form data
- `updatePageFormData()` - Save form field values
- `setCurrentPage()` - Handle page navigation
- `reorderPages()` - Update page order from drag & drop

### localStorage Persistence
- **Automatic Saving** - All state changes are automatically persisted
- **Restoration** - Application state is restored on page load/refresh
- **Error Handling** - Graceful fallback if localStorage is unavailable
- **Type Safety** - Proper type checking during serialization/deserialization

```typescript
// Auto-save subscription
appStore.subscribe(() => {
  saveStateToStorage(appStore.state);
});

// Load on initialization
const loadStateFromStorage = (): AppState => {
  // Safe localStorage access with fallbacks
};
```

## 🎨 Component Architecture

### PageNavigator
The main navigation component featuring:
- **Swapy Integration** - Drag & drop with `createSwapy()`
- **Dynamic Rendering** - Maps over pages array from store
- **Event Handling** - Page clicks, additions, and reordering
- **State Synchronization** - Connects UI actions to store updates

### PageCard
Individual page representation with:
- **Visual States** - Icons for first/last/regular pages
- **Dropdown Menu** - Page management actions
- **Inline Editing** - Contenteditable title editing
- **Drag Compatibility** - Smart interaction with Swapy

### PageForm
Dynamic form component using TanStack Form:
- **Field Generation** - Creates inputs based on page configuration
- **Auto-save** - Real-time form data persistence
- **Type Safety** - Fully typed form values and validation
- **Store Integration** - Seamless connection to global state

## 🔄 Data Flow

1. **User Interaction** → Component event handlers
2. **Store Actions** → Update centralized state
3. **localStorage** → Automatic persistence
4. **Re-render** → Components reflect new state
5. **URL Sync** → Browser history updates

### Example: Adding a New Page
```typescript
// User clicks "Add Page" button
handleAddPage() → 
addPage("New Page") → 
Store updates with new page → 
localStorage saves state → 
Components re-render → 
URL updates to new page
```

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   └── page.tsx        # Main application page
├── components/
│   ├── PageNavigator/  # Navigation components
│   ├── PageForm.tsx    # Form management
│   └── ui/            # Reusable UI components
├── lib/
│   ├── store.ts       # TanStack Store setup
│   └── utils.ts       # Utility functions
└── stories/           # Ladle component stories
```

### Key Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm ladle serve  # Component development
pnpm lint         # ESLint checking
pnpm type-check   # TypeScript validation
```

## 🎯 Usage Examples

### Basic Form Builder
1. Start with default pages (Info, Details, Other, Ending)
2. Fill out form fields on each page
3. Navigate between pages - data persists automatically
4. Add new pages using the "+" button or separators
5. Reorder pages by dragging and dropping
6. Use dropdown menu for advanced page management

### Customization
The application is designed to be easily extensible:
- Add new field types in `PageForm.tsx`
- Customize page templates in `getPageContent()`
- Extend store actions for new functionality
- Add validation rules with TanStack Form

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Other Platforms
The application is a standard Next.js app and can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
