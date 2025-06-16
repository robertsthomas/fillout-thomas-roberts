import { Store } from "@tanstack/react-store";

// Define the shape of your application state
interface AppState {
  pages: Array<{ title: string; id: string }>;
  currentPageId: string | null;
}

// Create the store with initial state
export const appStore = new Store<AppState>({
  pages: [],
  currentPageId: null,
});

// Helper functions to update the store
export const addPage = (title: string) => {
  appStore.setState((state) => {
    const newPage = {
      id: Date.now().toString(),
      title,
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
      .filter(Boolean) as Array<{ title: string; id: string }>;

    return {
      ...state,
      pages: reorderedPages,
    };
  });
};
