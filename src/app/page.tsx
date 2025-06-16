"use client";

import { useStore } from "@tanstack/react-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { PageForm } from "~/components/PageForm";
import { PageNavigator } from "~/components/PageNavigator/PageNavigator";
import { type PageFormData, appStore, initializePages, setCurrentPage } from "~/lib/store";

// Define the content for each page type
const getPageContent = (pageId: string, title: string) => {
  const baseContent = {
    Info: {
      title: "Information Page",
      description: "Collect basic user information",
      fields: ["Name", "Email", "Phone Number", "Date of Birth"],
    },
    Details: {
      title: "Details Page",
      description: "Gather detailed information",
      fields: ["Address", "Company", "Job Title", "Experience Level"],
    },
    Other: {
      title: "Other Information",
      description: "Additional optional information",
      fields: ["Preferences", "Comments", "Special Requirements", "Referral Source"],
    },
    Ending: {
      title: "Final Steps",
      description: "Review and submit",
      fields: ["Terms & Conditions", "Privacy Policy", "Submit Button"],
    },
  };

  // Try to match the title to a base content type, otherwise create generic content
  const matchedContent = baseContent[title as keyof typeof baseContent];

  if (matchedContent) {
    return matchedContent;
  }

  // Generic content for custom pages
  return {
    title: title,
    description: `This is the ${title} page`,
    fields: ["Field 1", "Field 2", "Field 3", "Field 4"],
  };
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = useStore(appStore, (state) => state.pages);
  const currentPageId = useStore(appStore, (state) => state.currentPageId);

  const urlPageId = searchParams.get("page");
  const currentPage = pages.find((p) => p.id === urlPageId) || pages[0];

  // Initialize default pages if none exist
  useEffect(() => {
    if (pages.length === 0) {
      initializePages([
        { title: "Info", id: "info" },
        { title: "Details", id: "details" },
        { title: "Other", id: "other" },
        { title: "Ending", id: "ending" },
      ]);
    }
  }, [pages.length]);

  // Memoize page content to prevent recalculation on every render
  const pageContent = useMemo(() => {
    if (!currentPage) return null;
    return getPageContent(currentPage.id, currentPage.title);
  }, [currentPage]);

  // Handle URL and store synchronization
  useEffect(() => {
    if (pages.length === 0) return;

    // If no URL page, redirect to first page
    if (!urlPageId) {
      const firstPageId = pages[0].id;
      router.replace(`?page=${firstPageId}`);
      if (currentPageId !== firstPageId) {
        setCurrentPage(firstPageId);
      }
      return;
    }

    // If URL page doesn't exist, redirect to first page
    const pageExists = pages.find((p) => p.id === urlPageId);
    if (!pageExists) {
      const firstPageId = pages[0].id;
      router.replace(`?page=${firstPageId}`);
      if (currentPageId !== firstPageId) {
        setCurrentPage(firstPageId);
      }
      return;
    }

    // Sync store with URL if they differ
    if (urlPageId !== currentPageId) {
      setCurrentPage(urlPageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, urlPageId, router]); // Removed currentPageId from dependencies to prevent loop

  // Don't render anything until we have pages and page content
  if (!pages.length || !currentPage || !pageContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
            <PageNavigator />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with PageNavigator */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
          <PageNavigator />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{pageContent.title}</h2>
            <p className="text-lg text-gray-600">{pageContent.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Page ID: <code className="bg-gray-100 px-2 py-1 rounded">{currentPage.id}</code>
            </div>
          </div>

          {/* Page Form */}
          <PageForm
            pageId={currentPage.id}
            fields={pageContent.fields}
            onFormChange={(formData: PageFormData) => {
              console.log("Form data updated for page:", currentPage.id, formData);
            }}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const currentIndex = pages.findIndex((p) => p.id === currentPage.id);
                if (currentIndex > 0) {
                  const prevPage = pages[currentIndex - 1];
                  setCurrentPage(prevPage.id);
                }
              }}
              disabled={pages.findIndex((p) => p.id === currentPage.id) === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => {
                const currentIndex = pages.findIndex((p) => p.id === currentPage.id);
                if (currentIndex < pages.length - 1) {
                  const nextPage = pages[currentIndex + 1];
                  setCurrentPage(nextPage.id);
                }
              }}
              disabled={pages.findIndex((p) => p.id === currentPage.id) === pages.length - 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pages.findIndex((p) => p.id === currentPage.id) === pages.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {/* <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
          <div className="text-sm space-y-1">
            <div>
              <strong>Current Page:</strong> {currentPage.title} (ID: {currentPage.id})
            </div>
            <div>
              <strong>URL Page Param:</strong> {urlPageId || "none"}
            </div>
            <div>
              <strong>Total Pages:</strong> {pages.length}
            </div>
            <div>
              <strong>All Pages:</strong> {pages.map((p) => `${p.title}(${p.id})`).join(", ")}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
