"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

export function PaketListesiDataTable({ columns, data }) {
  const [filtering, setFiltering] = useState("");

  // Table yapılandırması
  const table = useReactTable({
    data: data || [], // NULL güvenliği eklendi
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
    <div className="h-full flex flex-col w-full max-w-full">
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex w-full justify-between gap-5">
          <Input
            placeholder="Paket ara..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="max-w-sm h-8 bg-white border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 shadow-sm"
            startdecorator={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400 ml-2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            }
          />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <div className="h-full rounded-md border border-gray-300 overflow-auto">
          <Table className="w-full">
            <TableHeader className="w-full">
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
                      className="px-3 py-2 whitespace-nowrap overflow-hidden text-white bg-cyan-700 text-[0.8rem] font-medium relative"
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
                        ? "bg-white hover:bg-[#e1f0f5] h-12"
                        : "bg-[#eaf5fa] hover:bg-[#d0e8f0] h-12"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.columnDef.size,
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                          overflow: "hidden",
                          textOverflow: "ellipsis"
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
                    <span>Kayıt bulunamadı.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="py-4 flex items-center justify-between gap-2 border-t border-gray-100 mt-2 pt-3">
        <div className="text-sm text-[#5F99AE] font-medium flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h10" />
            <path d="M7 12h10" />
            <path d="M7 17h10" />
          </svg>
          Toplam {table.getFilteredRowModel().rows.length} kayıt
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="font-medium h-8 px-3 border border-[#aad0de] hover:bg-[#eef6fa] hover:text-[#5F99AE] transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Önceki
          </Button>
          <div className="flex items-center gap-1 bg-[#eef6fa] px-4 py-1.5 rounded-md">
            <span className="text-sm font-medium text-[#5F99AE]">
              Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="font-medium h-8 px-3 border border-[#aad0de] hover:bg-[#eef6fa] hover:text-[#5F99AE] transition-colors flex items-center"
          >
            Sonraki
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaketListesiDataTable;