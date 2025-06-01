"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPaketId, setSelectedPaketId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  console.log("Kullanılan API URL:", apiUrl);

  const handleDelete = async () => {
    try {
      console.log("Silinmeye çalışılan paket ID:", selectedPaketId);
      await axios.delete(`${apiUrl}/api/paketler/${selectedPaketId}`);
      console.log("Silme işlemi başarılı");
      
      queryClient.invalidateQueries(["paketler"]);
      
      if (typeof toast !== 'undefined') {
        toast.success("Paket başarıyla silindi");
      } else {
        console.log("Paket başarıyla silindi");
      }
      
    } catch (error) {
      console.error("Silme hatası:", error);
      if (typeof toast !== 'undefined') {
        toast.error("Paket silinirken bir hata oluştu");
      } else {
        console.error("Paket silinirken bir hata oluştu:", error);
      }
    } finally {
      setOpenDeleteDialog(false);
    }
  };

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
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Paket Silme İşlemi
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Bu paketi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t border-gray-100 my-4"></div>
          <DialogFooter className="flex sm:justify-end gap-3 mt-6">
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outline"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg px-5 py-2.5"
            >
              İptal
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 px-5 py-2.5 flex items-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Evet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <Table className="w-full">            <TableHeader className="w-full">
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
                  <TableHead className="text-white bg-cyan-700 text-left px-3 py-2 whitespace-nowrap">İşlemler</TableHead>
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
                  >                    {row.getVisibleCells().map((cell) => (
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
                    <TableCell className="px-3 py-2 flex justify-end gap-2">
                      <Button
                        className="bg-fuchsia-600 text-white border border-gray-300 hover:bg-cyan-600 h-8 text-sm rounded-lg px-4 font-medium transition-all shadow-sm flex items-center group"
                        onClick={() => {
                          navigate(`/paketduzenle/${row.original.id}`);
                          console.log("Row clicked:", row.original);
                        }}
                      >
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedPaketId(row.original.id);
                          setOpenDeleteDialog(true);
                          console.log(
                            "Silinmek üzere seçilen paket ID:",
                            row.original.id
                          );
                        }}
                        className="bg-red-400 text-white border border-gray-300 hover:bg-red-600 h-8 text-sm rounded-lg px-4 font-medium transition-all shadow-sm flex items-center group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-white group-hover:text-white transition-colors"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
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