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
import { Info } from "lucide-react";

export type Column<T> = {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  onView,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<T>) {
  return (
    <ScrollArea className="bg-card rounded-lg border border-border overflow-x-auto">
      <Table className="min-w-[1000px] " data-testid="data-table">
        <TableHeader>
          <TableRow className="bg-muted/30">
            {columns.map((col, idx) => (
              <TableHead key={idx} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            <TableHead className="w-[50px] px-4 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-sm py-6 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rIdx) => (
              <TableRow
                key={rIdx}
                className="hover:bg-muted/20"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, cIdx) => (
                  <TableCell key={cIdx} className={col.className}>
                    {col.render
                      ? col.render(row)
                      : col.accessor
                        ? String(row[col.accessor as string])
                        : null}
                  </TableCell>
                ))}

                <TableCell className="ml-40 text-left">
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
                        <Info className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default DataTable;
