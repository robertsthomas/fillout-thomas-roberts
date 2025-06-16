import { Store } from "@tanstack/react-store";

// Define the shape of form data for each page
interface PageFormData {
  [fieldName: string]: unknown;
}

// Define the shape of a page with form data
interface Page {
  title: string;
  id: string;
  formData: PageFormData;
}

// Define the shape of your application state
interface AppState {
  pages: Array<Page>;
  currentPageId: string | null;
}

// Helper function to load state from localStorage
const loadStateFromStorage = (): AppState => {
  if (typeof window === "undefined") {
    return { pages: [], currentPageId: null };
  }

  try {
    const stored = localStorage.getItem("fillout-app-state");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure form data exists for each page
      const pages =
        parsed.pages?.map((page: unknown) => {
          const p = page as { title?: string; id?: string; formData?: PageFormData };
          return {
            title: p.title || "",
            id: p.id || "",
            formData: p.formData || {},
          };
        }) || [];
      return {
        pages,
        currentPageId: parsed.currentPageId || null,
      };
    }
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error);
  }

  return { pages: [], currentPageId: null };
};

// Helper function to save state to localStorage
const saveStateToStorage = (state: AppState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("fillout-app-state", JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save state to localStorage:", error);
  }
};

// Create the store with initial state from localStorage
export const appStore = new Store<AppState>(loadStateFromStorage());

// Subscribe to store changes and save to localStorage
appStore.subscribe(() => {
  saveStateToStorage(appStore.state);
});

// Helper functions to update the store
export const addPage = (title: string) => {
  appStore.setState((state) => {
    const newPage = {
      id: Date.now().toString(),
      title,
      formData: {},
    };

    return {
      ...state,
      pages: [...state.pages, newPage],
      currentPageId: newPage.id, // Set the new page as active
    };
  });
};

export const insertPageAt = (title: string, position: number) => {
  appStore.setState((state) => {
    const newPage = {
      id: Date.now().toString(),
      title,
      formData: {},
    };

    const newPages = [...state.pages];
    newPages.splice(position, 0, newPage);

    return {
      ...state,
      pages: newPages,
      currentPageId: newPage.id, // Set the new page as active
    };
  });
};

export const setCurrentPage = (pageId: string) => {
  appStore.setState((state) => ({
    ...state,
    currentPageId: pageId,
  }));
};

export const removePage = (pageId: string) => {
  appStore.setState((state) => ({
    ...state,
    pages: state.pages.filter((page) => page.id !== pageId),
    currentPageId: state.currentPageId === pageId ? null : state.currentPageId,
  }));
};

export const renamePage = (pageId: string, newTitle: string) => {
  appStore.setState((state) => ({
    ...state,
    pages: state.pages.map((page) => (page.id === pageId ? { ...page, title: newTitle } : page)),
  }));
};

export const copyPage = (pageId: string) => {
  appStore.setState((state) => {
    const pageToCopy = state.pages.find((page) => page.id === pageId);
    if (!pageToCopy) return state;

    return {
      ...state,
      pages: [
        ...state.pages,
        {
          id: Date.now().toString(),
          title: `${pageToCopy.title} (Copy)`,
          formData: pageToCopy.formData,
        },
      ],
    };
  });
};

export const duplicatePage = (pageId: string) => {
  appStore.setState((state) => {
    const pageIndex = state.pages.findIndex((page) => page.id === pageId);
    const pageToDuplicate = state.pages[pageIndex];
    if (!pageToDuplicate || pageIndex === -1) return state;

    const newPage = {
      id: Date.now().toString(),
      title: `${pageToDuplicate.title} (Copy)`,
      formData: pageToDuplicate.formData,
    };

    // Insert the duplicate right after the original page
    const newPages = [...state.pages];
    newPages.splice(pageIndex + 1, 0, newPage);

    return {
      ...state,
      pages: newPages,
    };
  });
};

export const setAsFirstPage = (pageId: string) => {
  appStore.setState((state) => {
    const pageToMove = state.pages.find((page) => page.id === pageId);
    if (!pageToMove) return state;

    const otherPages = state.pages.filter((page) => page.id !== pageId);

    return {
      ...state,
      pages: [pageToMove, ...otherPages],
    };
  });
};

export const initializePages = (pages: Array<{ title: string; id?: string }>) => {
  const newPages = pages.map((page) => ({
    id: page.id || Date.now().toString() + Math.random().toString(),
    title: page.title,
    formData: {},
  }));

  appStore.setState((state) => ({
    ...state,
    pages: newPages,
    currentPageId: newPages.length > 0 ? newPages[0].id : null,
  }));
};

export const reorderPages = (newOrder: Array<{ slot: string; item: string }>) => {
  appStore.setState((state) => {
    const reorderedPages = newOrder
      .map((orderItem) => {
        const pageId = orderItem.item;
        return state.pages.find((page) => page.id === pageId);
      })
      .filter(Boolean) as Array<Page>;

    return {
      ...state,
      pages: reorderedPages,
    };
  });
};

// Update form data for a specific page
export const updatePageFormData = (pageId: string, formData: PageFormData) => {
  appStore.setState((state) => ({
    ...state,
    pages: state.pages.map((page) => (page.id === pageId ? { ...page, formData } : page)),
  }));
};

// Get form data for a specific page
export const getPageFormData = (pageId: string): PageFormData => {
  const page = appStore.state.pages.find((p) => p.id === pageId);
  return page?.formData || {};
};

// Export types for use in components
export type { Page, PageFormData };
