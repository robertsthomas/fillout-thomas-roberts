import {
  CircleCheckIcon,
  ClipboardIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
  FlagIcon,
  InfoIcon,
  PenLineIcon,
  PlusIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export const PageCard = ({
  title,
  isLast,
  isFirst,
  isActive = false,
  onClick,
  className,
  addPage,
  pageId,
  onSetAsFirst,
  onRename,
  onCopy,
  onDuplicate,
  onDelete,
}: {
  title: string;
  isLast: boolean;
  isFirst: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  addPage?: boolean;
  pageId?: string;
  onSetAsFirst?: (pageId: string) => void;
  onRename?: (pageId: string, newTitle: string) => void;
  onCopy?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const editableRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const getIcon = () => {
    if (isFirst) {
      return <InfoIcon className="w-5 h-5 text-[#F59D0E]" />;
    }
    if (isLast) {
      return <CircleCheckIcon className="w-5 h-5 text-green-500" />;
    }
    if (addPage) {
      return <PlusIcon className="w-5 h-5" />;
    }
    return <FileTextIcon className="w-5 h-5" />;
  };

  const handleDropdownAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageId) return;

    switch (action) {
      case "setAsFirst":
        onSetAsFirst?.(pageId);
        break;
      case "rename":
        setIsEditing(true);
        setEditValue(title);
        break;
      case "copy":
        onCopy?.(pageId);
        break;
      case "duplicate":
        onDuplicate?.(pageId);
        break;
      case "delete":
        onDelete?.(pageId);
        break;
    }
  };

  const handleEditSubmit = () => {
    const newValue = editableRef.current?.textContent?.trim() || "";
    if (newValue && newValue !== title && pageId) {
      onRename?.(pageId, newValue);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    if (editableRef.current) {
      editableRef.current.textContent = title;
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleEditCancel();
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      onClick?.();
    }
  };

  return (
    <Card
      className={cn(
        "group p-1 text-sm w-max rounded-md transition-all duration-200",
        // Cursor states - grab when draggable, pointer when not
        !addPage && !isEditing && "cursor-grab active:cursor-grabbing",
        addPage && "cursor-pointer",
        isEditing && "cursor-text",
        // Active state - white background
        isActive && "bg-white opacity-100",
        // Non-active state - gray background with hover
        !isActive && "bg-[#9DA4B226] hover:bg-[#9DA4B259] opacity-50",
        // Focused state
        "focus-within:border-[0.5px] focus-within:border-[#2F72E2] focus-within:shadow-xs",
        // Add page state
        addPage && "opacity-100 bg-white",
        // Editing state
        isEditing && "ring-2 ring-blue-500",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="flex p-1 gap-2 items-center">
        {getIcon()}
        <span
          ref={editableRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onKeyDown={handleKeyDown}
          onBlur={handleEditSubmit}
          onClick={(e) => isEditing && e.stopPropagation()}
          className={cn(
            "outline-none",
            isEditing && "bg-white px-1 py-0.5 rounded border border-blue-300"
          )}
        >
          {title}
        </span>
        {isActive && !addPage && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVerticalIcon
                className="w-4 h-4 animate-in slide-in-from-right-2 duration-200 hover:bg-gray-100 rounded p-0.5"
                onClick={(e) => e.stopPropagation()}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleDropdownAction("setAsFirst", e)}
              >
                <FlagIcon className="mr-2 h-4 w-4" fill="#2F72E2" />
                Set as first page
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleDropdownAction("rename", e)}
              >
                <PenLineIcon className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleDropdownAction("copy", e)}
              >
                <ClipboardIcon className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleDropdownAction("duplicate", e)}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={(e) => handleDropdownAction("delete", e)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
};
