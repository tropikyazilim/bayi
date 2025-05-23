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

export default function PaketListesiDataTable({ columns, data }) {  const { id } = useParams();
  const navigate = useNavigate(); // Hook fonksiyon içine taşındı
  const [error, setError] = useState(null);
  const queryClient = useQueryClient(); // QueryClient'ı al
  const [filtering, setFiltering] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPaketId, setSelectedPaketId] = useState(null);

  const handleDelete = async () => {
    try {
      console.log("Silinmeye çalışılan paket ID:", selectedPaketId);
      
      await axios.delete(`http://localhost:3002/api/paketler/${selectedPaketId}`);
      console.log("Silme işlemi başarılı");
      
      // Silme işlemi başarılıysa, paket listesini yeniden yükle
      queryClient.invalidateQueries(["paketler"]);
      
      // Başarı mesajları
      if (typeof toast !== 'undefined') {
        toast.success("Paket başarıyla silindi");
      } else {
        console.log("Paket başarıyla silindi");
      }
      
      // Liste sayfasında kalın - yenileme için
      
    } catch (error) {
      console.error("Silme hatası:", error);
      if (typeof toast !== 'undefined') {
        toast.error("Paket silinirken bir hata oluştu");
      } else {
        console.error("Paket silinirken bir hata oluştu:", error);
      }
    } finally {
      // Her durumda, diyalogu kapat
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
    onGlobalFilterChange: setFiltering,  });  return (
    <div className="h-full flex flex-col">
      {/* Dialog - Scroll alanının dışında */}
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
              size="lg"
            >
              İptal
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="lg"
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
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex w-full justify-between gap-5">
          <Input
            placeholder="Tüm alanlarda ara..."
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
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 active:bg-cyan-700 h-8 w-20 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg active:shadow-inner transition-all duration-200"
            onClick={() => queryClient.invalidateQueries(["paketler"])}
          >
            Yenile
          </Button>
        </div>
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
                  // className=" cursor-pointer hover:bg-muted"
                  // onClick={() => {
                  //   // BayiEkle sayfasına yönlendir
                  //   navigate(`/paket/${row.original.id}`); // BayiEkle sayfasına git
                  //   console.log("Row clicked:", row.original);

                  // }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex justify-end gap-2">                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        navigate(`/paketduzenle/${row.original.id}`);
                        console.log("Row clicked:", row.original);
                      }}
                    >
                      Düzenle
                    </Button>                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // Paket ID'sini sakla ve dialog'u aç
                        setSelectedPaketId(row.original.id);
                        setOpenDeleteDialog(true);
                        console.log(
                          "Silinmek üzere seçilen paket ID:",
                          row.original.id
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
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
              </TableRow>            )}
            </TableBody>
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
