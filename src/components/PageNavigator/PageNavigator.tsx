import { useStore } from "@tanstack/react-store";
import { CirclePlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import {
  addPage,
  appStore,
  copyPage,
  duplicatePage,
  insertPageAt,
  removePage,
  renamePage,
  reorderPages,
  setAsFirstPage,
} from "~/lib/store";
import { cn } from "~/lib/utils";
import { PageCard } from "./PageCard";

export const PageNavigator = () => {
  const router = useRouter();
  const pages = useStore(appStore, (state) => state.pages);
  const currentPageId = useStore(appStore, (state) => state.currentPageId);
  const [hoveredSeparatorIndex, setHoveredSeparatorIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);

  // Initialize Swapy when pages change
  useEffect(() => {
    if (containerRef.current && pages.length > 0) {
      // Destroy existing Swapy instance
      if (swapyRef.current) {
        swapyRef.current.destroy?.();
      }

      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        if (containerRef.current) {
          // Create new Swapy instance
          swapyRef.current = createSwapy(containerRef.current, {
            animation: "dynamic",
            swapMode: "drop",
            dragOnHold: true,
            dragAxis: "x", // horizontal
            manualSwap: false,
          });

          // Listen for swap events
          swapyRef.current.onSwap(
            (event: { newSlotItemMap: { asArray: Array<{ slot: string; item: string }> } }) => {
              reorderPages(event.newSlotItemMap.asArray);

              // Force re-render by updating slots after a short delay
              setTimeout(() => {
                if (swapyRef.current) {
                  swapyRef.current.update();
                }
              }, 50);
            }
          );
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Cleanup on unmount
    return () => {
      if (swapyRef.current) {
        swapyRef.current.destroy?.();
      }
    };
  }, [pages]);

  const handleAddPage = () => {
    const newPageNumber = pages.length + 1;
    addPage(`Page ${newPageNumber}`);
  };

  const handleAddPageAtSeparator = (afterIndex: number) => {
    const newPageNumber = pages.length + 1;
    insertPageAt(`Page ${newPageNumber}`, afterIndex + 1);
  };

  const handlePageClick = (pageId: string) => {
    router.push(`?page=${pageId}`);
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

  const handleSwapyEnable = (enabled: boolean) => {
    if (swapyRef.current) {
      swapyRef.current.enable(enabled);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div ref={containerRef} className="flex gap-1 items-center">
        {pages.map((page, index) => (
          <React.Fragment key={`${page.id}-${index}`}>
            <div data-swapy-slot={`slot-${index}`} className="flex">
              <div data-swapy-item={page.id}>
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
                  onSwapyEnable={handleSwapyEnable}
                  className={cn(
                    "transition-transform duration-300 ease-out",
                    hoveredSeparatorIndex === index - 1 && "translate-x-[4px]",
                    hoveredSeparatorIndex === index && "translate-x-[-4px]"
                  )}
                />
              </div>
            </div>
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
      </div>
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
