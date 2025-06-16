This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## PageNavigator Component

This project includes a comprehensive PageNavigator component with the following features:

### Features
- **Drag & Drop Reordering**: Pages can be reordered by dragging and dropping using [Swapy](https://swapy.tahazsh.com/)
- **Interactive Page Management**: Add, rename, copy, duplicate, and delete pages
- **Visual States**: Active/inactive page states with hover effects
- **Inline Editing**: Click to rename pages with contenteditable functionality
- **Dropdown Actions**: Right-click menu with page management options
- **Smooth Animations**: Hover effects and transitions for better UX

### Usage
```tsx
import { PageNavigator } from "~/components/PageNavigator/PageNavigator";

// Basic usage
<PageNavigator />

// With initial pages
<PageNavigator 
  initialPages={[
    { title: "Welcome Page", id: "welcome" },
    { title: "Contact Form", id: "contact" },
    { title: "Thank You", id: "thanks" },
  ]}
/>
```

### Drag & Drop
- Hover over any page card to reveal the drag handle (grip icon)
- Click and drag the handle to reorder pages
- Pages will smoothly animate to their new positions
- The highlighted drop zone shows where the page will be placed

### Testing
Run the component stories with Ladle:
```bash
pnpm ladle serve
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
