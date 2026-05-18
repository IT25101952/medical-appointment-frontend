"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightText } from "@/lib/highlight-search";

export type Column<T> = {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchQuery?: string;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  pageable?: boolean;
  pageSize?: number;
  showActions?: boolean;
  minWidth?: string;
}

export function DataTable<T extends object>({
  columns,
  data,
  searchQuery = "",
  onRowClick,
  onView,
  emptyMessage = "No results found.",
  className,
  pageable = true,
  pageSize = 10,
  showActions = true,
  minWidth = "1000px",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [data.length, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = currentPage * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = data.slice(startIdx, endIdx);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const getCellValue = (row: T, accessor?: keyof T | string) => {
    if (!accessor) return "";

    const value = (row as Record<string, unknown>)[accessor as string];

    if (value === null || value === undefined) return "";

    return String(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <ScrollArea className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table className="w-full" style={{ minWidth }} data-testid="data-table">
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "px-4 py-2 text-left text-xs font-medium tracking-wide text-muted-foreground",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}

              {showActions && (
                <TableHead className="w-[130px] px-4 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center text-sm py-6 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rIdx) => (
                <TableRow
                  key={rIdx}
                  className={cn(
                    "hover:bg-muted/20",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, cIdx) => (
                    <TableCell
                      key={cIdx}
                      className={cn("px-4 py-2 align-middle", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : highlightText(
                            getCellValue(row, col.accessor),
                            searchQuery,
                          )}
                    </TableCell>
                  ))}

                  {showActions && (
                    <TableCell className="px-4 py-2 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {onView && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                          >
                            <Info className="h-4 w-4" />
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {pageable && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function tableBadgeClassName(
  type: "primary" | "success" | "danger" | "warning" | "muted",
) {
  const base = "rounded-md px-2.5 py-1 text-xs font-medium";

  const variants = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    muted: "bg-muted text-muted-foreground",
  };

  return cn(base, variants[type]);
}

export default DataTable;
