"use client";
import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner"; // Toast bildirimleri için
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { mustericolums } from "@/pages/Musteriler/MusteriListesi/mustericolumns";
import { useParams, useNavigate } from "react-router-dom";
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function ModulListesiDataTable({ columns, data }) {  
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const [filtering, setFiltering] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedModulId, setSelectedModulId] = useState(null);

  const handleDelete = async () => {
    try {
      console.log("Silinmeye çalışılan modül ID:", selectedModulId);
        await axios.delete(`http://localhost:3002/api/moduller/${selectedModulId}`);
      console.log("Silme işlemi başarılı");
      
      queryClient.invalidateQueries(["moduller"]);
      
      if (typeof toast !== 'undefined') {
        toast.success("Modül başarıyla silindi");
      } else {
        console.log("Modül başarıyla silindi");
      }
      
    } catch (error) {
      console.error("Silme hatası:", error);
      if (typeof toast !== 'undefined') {
        toast.error("Modül silinirken bir hata oluştu");
      } else {
        console.error("Modül silinirken bir hata oluştu:", error);
      }
    } finally {
      setOpenDeleteDialog(false);
    }
  };
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
    onGlobalFilterChange: setFiltering,  });  
    return (
    <div className="h-full flex flex-col">
      {/* Dialog - Scroll alanının dışında */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Modül Silme İşlemi
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Bu modülü silmek istediğinizden emin misiniz? Bu işlem geri
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
            <TableHeader className="bg-[#F2C078] text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="flex justify-end gap-2">                    
                      <Button
                      className={"bg-[#FE5D26] text-white hover:bg-[#F2C078] font-medium rounded-lg transition-all duration-200 px-5 py-2.5 flex items-center"}
                        variant="info"
                        size="sm"
                        onClick={() => {
                          navigate(`/modulduzenle/${row.original.id}`);
                          console.log("Row clicked:", row.original);
                        }}
                      >
                        Düzenle
                      </Button>                    
                      <Button
                        onClick={() => {
                          setSelectedModulId(row.original.id);
                          setOpenDeleteDialog(true);
                          console.log(
                            "Silinmek üzere seçilen modül ID:",
                            row.original.id
                          );
                        }}
                        variant="destructive"
                        size="sm"
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
                        Sil
                      </Button>
                    </TableCell>
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
          
          {/* Pagination Footer - İçeride, tablo genişliğiyle uyumlu */}
         
        </div>
        
      </div>
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
  );
}
