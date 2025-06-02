"use client";
import { useState } from "react";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { mustericolums } from "@/pages/Musteriler/MusteriListesi/mustericolumns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // React Query eklendi

export default function MusteriDataTable({ columns, data }) {

  
  const navigate = useNavigate();
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="h-full flex flex-col">
      {/* Arama kutusu */}
      <div className="flex items-center py-2 justify-between">
        <Input
          placeholder="Tüm alanlarda ara..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm h-8"
        />
      </div>
        {/* Ana tablo konteyneri - Responsive */}
      <div className="flex-1 border rounded-md">
        <div className="rounded-md border overflow-x-auto">
          <div style={{ minWidth: "1200px" }}>
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size,
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                        }}
                        className="px-3 py-3 whitespace-nowrap overflow-hidden text-white bg-cyan-700 text-[0.8rem] font-medium relative"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-[#edf7fa]"
                          : "bg-[#f3fafe] hover:bg-[#e5f5fa]"
                      }
                      onClick={() => {
                        navigate(`/musteri/${row.original.id}`);
                        console.log("Row clicked:", row.original);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.columnDef.size,
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className="px-3 py-2 text-[0.8rem] font-normal"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sayfalama - Responsive konteyner içinde sabit */}
        <div className="py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Toplam {table.getFilteredRowModel().rows.length} kayıt
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="font-medium"
              >
                Önceki
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  Sayfa {table.getState().pagination.pageIndex + 1} /{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="font-medium"
              >
                Sonraki
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
