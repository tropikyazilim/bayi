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
  const navigate = useNavigate(); // Hook fonksiyon içine taşındı
  const [error, setError] = useState(null);
  const queryClient = useQueryClient(); // QueryClient'ı al
  const [filtering, setFiltering] = useState("");

  //tablo yapılandırması
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
    onGlobalFilterChange: setFiltering,  });  return (
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
      
      {/* Tablo ve Scroll Container - Tek bir scroll container */}
      <div className="rounded-md border overflow-x-auto" style={{ minWidth: "100%" }}>
        <div style={{ minWidth: "1200px" }}>
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=" cursor-pointer hover:bg-muted"
                  onClick={() => {
                    // BayiEkle sayfasına yönlendir
                    navigate(`/musteri/${row.original.id}`); // BayiEkle sayfasına git
                    console.log("Row clicked:", row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                </TableCell>              </TableRow>
            )}            </TableBody>
          </Table>
          
          {/* Pagination Footer - İçeride, tablo genişliğiyle uyumlu */}
          <div className="py-4 flex items-center justify-between gap-2 px-4">
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
