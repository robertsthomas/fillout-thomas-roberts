import { useStore } from "@tanstack/react-store";
import { CirclePlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  addPage,
  appStore,
  copyPage,
  duplicatePage,
  initializePages,
  insertPageAt,
  removePage,
  renamePage,
  setAsFirstPage,
  setCurrentPage,
} from "~/lib/store";
import { cn } from "~/lib/utils";
import { PageCard } from "./PageCard";

interface PageNavigatorProps {
  initialPages?: Array<{ title: string; id?: string }>;
}

export const PageNavigator = ({ initialPages }: PageNavigatorProps) => {
  const pages = useStore(appStore, (state) => state.pages);
  const currentPageId = useStore(appStore, (state) => state.currentPageId);
  const [hoveredSeparatorIndex, setHoveredSeparatorIndex] = useState<number | null>(null);

  // Initialize pages when component mounts or initialPages changes
  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      initializePages(initialPages);
    } else if (pages.length === 0) {
      // Provide default pages if none exist and no initialPages provided
      initializePages([
        { id: "1", title: "Page 1" },
        { id: "2", title: "Page 2" },
        { id: "3", title: "Page 3" },
      ]);
    }
  }, [initialPages, pages.length]);

  const handleAddPage = () => {
    const newPageNumber = pages.length + 1;
    addPage(`Page ${newPageNumber}`);
  };

  const handleAddPageAtSeparator = (afterIndex: number) => {
    const newPageNumber = pages.length + 1;
    insertPageAt(`Page ${newPageNumber}`, afterIndex + 1);
  };

  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const handleSetAsFirst = (pageId: string) => {
    setAsFirstPage(pageId);
  };

  const handleRename = (pageId: string, newTitle: string) => {
    renamePage(pageId, newTitle);
  };

  const handleCopy = (pageId: string) => {
    copyPage(pageId);
  };

  const handleDuplicate = (pageId: string) => {
    duplicatePage(pageId);
  };

  const handleDelete = (pageId: string) => {
    if (pages.length <= 1) {
      alert("Cannot delete the last page");
      return;
    }

    if (confirm("Are you sure you want to delete this page?")) {
      removePage(pageId);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      {pages.map((page, index) => (
        <React.Fragment key={page.id}>
          <PageCard
            title={page.title}
            isLast={index === pages.length - 1}
            isFirst={index === 0}
            isActive={currentPageId === page.id}
            onClick={() => handlePageClick(page.id)}
            pageId={page.id}
            onSetAsFirst={handleSetAsFirst}
            onRename={handleRename}
            onCopy={handleCopy}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            className={cn(
              "transition-transform duration-300 ease-out",
              hoveredSeparatorIndex === index - 1 && "translate-x-[4px]",
              hoveredSeparatorIndex === index && "translate-x-[-4px]"
            )}
          />
          {index < pages.length - 1 && (
            <div
              className="group/separator flex items-center justify-center w-8 transition-all duration-300 ease-out"
              onMouseEnter={() => setHoveredSeparatorIndex(index)}
              onMouseLeave={() => setHoveredSeparatorIndex(null)}
            >
              <span className="m-0 text-gray-400 group-hover/separator:opacity-0 transition-opacity duration-200">
                ----
              </span>
              <div className="absolute opacity-0 group-hover/separator:opacity-100 flex items-center transition-opacity duration-200">
                <span>--</span>
                <CirclePlusIcon
                  strokeWidth={1}
                  className="w-4 h-4 cursor-pointer"
                  fill="#ffffff"
                  onClick={() => handleAddPageAtSeparator(index)}
                />
                <span>--</span>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="flex items-center justify-center w-8">
        <span className="m-0 text-gray-400">----</span>
        <div className="absolute opacity-0 group-hover/separator:opacity-100 flex items-center text-blue-500 transition-opacity duration-200">
          <span>--</span>
          <CirclePlusIcon className="w-4 h-4 cursor-pointer" onClick={handleAddPage} />
          <span>--</span>
        </div>
      </div>
      <PageCard addPage title="Add Page" isLast={false} isFirst={false} onClick={handleAddPage} />
    </div>
  );
};
