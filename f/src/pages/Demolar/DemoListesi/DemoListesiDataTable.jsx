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
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export function StatusCell({ row, value, table }) {
  const [durum, setDurum] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const demoId = row.original.id;
  const queryClient = useQueryClient();

  const durumOptions = ["Bekliyor", "Görüşüldü", "Reddedildi", "Onaylandı"];

  const updateDurum = async (newDurum) => {
    if (newDurum === durum) return;

    setIsUpdating(true);
    try {
      // Update the database
      await axios.patch(`${API_URL}/api/demolar/${demoId}/durum`, {
        durum: newDurum,
      });

      setDurum(newDurum);
      toast.success("Durum güncellendi");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["demolar"]);
    } catch (error) {
      console.error("Durum güncellenirken hata oluştu:", error);
      toast.error("Durum güncellenirken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  // Set color based on durum
  const durumStyles = {
    Bekliyor: "bg-blue-50 text-blue-600 border border-blue-200 rounded-md",
    Görüşüldü:
      "bg-purple-50 text-purple-600 border border-purple-200 rounded-md",
    Reddedildi: "bg-red-50 text-red-400 border border-red-200 rounded-md",
    Onaylandı: "bg-green-50 text-green-600 border border-green-200 rounded-md",
    default: "bg-gray-50 text-gray-600 border border-gray-200 rounded-md",
  };
  // Stil direkt erişiliyor
  const statusStyle = durumStyles[durum] || durumStyles.default;
  return (
    <div className="px-0 py-0.5 relative w-full h-full">
      <select 
        className={`w-full text-center px-3 py-1.5 appearance-none ${statusStyle} ${
          isUpdating ? "opacity-50" : ""
        }`}
        value={durum}
        onChange={(e) => updateDurum(e.target.value)}
        disabled={isUpdating}
      >
        {durumOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-b-transparent border-t-current"></div>
        </div>
      )}
    </div>
  );
}

export default function DemoListesiDataTable({ columns, data, refetch }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const [filtering, setFiltering] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  // Store pagination information in state instead of refs
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isManualPageChange, setIsManualPageChange] = useState(false);

  // Add useEffect to log data when component mounts or data changes
  useEffect(() => {
    console.log("Demo Listesi Data:", data);
  }, [data]);

  // State to force re-render when needed
  const [paginationKey, setPaginationKey] = useState(0);
  // Track if a resize operation was recently performed
  const [isResizingOrJustResized, setIsResizingOrJustResized] = useState(false);
  const resizeTimeoutRef = React.useRef(null);
  // ColumnResizeMode tipi yerine doğrudan string değeri kullanıyoruz
  const [columnResizeMode, setColumnResizeMode] = useState("onChange"); // Changed back to onChange for live resizing preview
  const [columnSizing, setColumnSizing] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState(null);

  // Clean up the timeout when the component unmounts
  React.useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Effect to handle data changes and maintain pagination state
  React.useEffect(() => {
    // If this is not a manual page change and data has changed,
    // make sure we preserve the current page if possible
    if (!isManualPageChange && data) {
      const totalPages = Math.ceil(data.length / 10);
      // Make sure the current page index is still valid with the new data
      if (currentPageIndex >= totalPages) {
        setCurrentPageIndex(Math.max(0, totalPages - 1));
      }
      // Reset the flag
      setIsManualPageChange(false);
    }
  }, [data, currentPageIndex, isManualPageChange]);

  const handleDelete = async () => {
    try {
      console.log("Silinmeye çalışılan demo ID:", selectedDemoId);
      await axios.delete(`http://localhost:3002/api/demolar/${selectedDemoId}`);
      console.log("Silme işlemi başarılı");

      // Use refetch if provided, otherwise invalidate query
      if (refetch) {
        refetch();
      } else {
        queryClient.invalidateQueries(["demolar"]);
      }

      if (typeof toast !== "undefined") {
        toast.success("Demo başarıyla silindi");
      } else {
        console.log("Demo başarıyla silindi");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      if (typeof toast !== "undefined") {
        toast.error("Demo silinirken bir hata oluştu");
      } else {
        console.error("Demo silinirken bir hata oluştu:", error);
      }
    } finally {
      setOpenDeleteDialog(false);
    }
  };
  //tablo yapılandırması

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filtering,
      columnFilters,
      columnSizing,
      columnResizeMode,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: 10,
      },
    },
    enableSorting: true,
    enableMultiSort: true,
    enableColumnFilters: true,
    onColumnFiltersChange: setColumnFilters,
    enableColumnResizing: true,
    columnResizeMode,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false, // Veri değişikliklerinde sayfa numarasını otomatik sıfırlama
    manualPagination: false,
    onPaginationChange: (updater) => {
      // When pagination changes, update our state
      if (typeof updater === "function") {
        const newState = updater(table.getState().pagination);
        setCurrentPageIndex(newState.pageIndex);
        setIsManualPageChange(true);
        console.log("Pagination changed (function):", newState.pageIndex + 1);
      } else {
        setCurrentPageIndex(updater.pageIndex);
        setIsManualPageChange(true);
        console.log("Pagination changed (direct):", updater.pageIndex + 1);
      }
    },
    onGlobalFilterChange: setFiltering,
  });
  // Effect to synchronize the current page index with table state
  React.useEffect(() => {
    const tablePageIndex = table.getState().pagination.pageIndex;

    // If the table's page index doesn't match our state,
    // and we're not handling a manual page change, update our state
    if (tablePageIndex !== currentPageIndex && !isManualPageChange) {
      setCurrentPageIndex(tablePageIndex);
      setPaginationKey((prev) => prev + 1);
    }

    // Always reset the manual page change flag after processing
    setIsManualPageChange(false);
  }, [
    table.getState().pagination.pageIndex,
    currentPageIndex,
    isManualPageChange,
  ]);
  // This function helps manage pagination when data changes to avoid returning to page 1
  React.useEffect(() => {
    if (data && data.length > 0) {
      // Calculate the total number of pages based on current page size
      const pageSize = table.getState().pagination.pageSize;
      const totalPages = Math.ceil(data.length / pageSize);

      // If current page index is out of bounds with the new data, adjust it
      if (currentPageIndex >= totalPages) {
        setCurrentPageIndex(Math.max(0, totalPages - 1));
        console.log(
          "Adjusted page index to stay within bounds:",
          Math.max(0, totalPages - 1) + 1
        );
        setPaginationKey((prev) => prev + 1);
      }
    }
  }, [data, table, currentPageIndex]);

  return (
    //tüm alanlarda arama
    <div className="w-full">
      <div className="flex items-center justify-between py-2 mb-2">        <div 
        className="flex w-full justify-between gap-5">
          {" "}
          <Input
            placeholder="Tüm alanlarda arama yapın..."
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
          className={"bg-emerald-500 hover:bg-emerald-600 active:bg-cyan-700 h-8 w-20 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg active:shadow-inner transition-all duration-200"}
          onClick={() => refetch()}
          >Yenile</Button>
        </div>
        <div className="text-xs flex items-center">
          {" "}
          
          
        </div>
      </div>      <div className="rounded-md border border-gray-300">
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
              <Button                onClick={handleDelete}
                className="bg-[#5F99AE] hover:bg-[#4b7a8c] text-white font-medium rounded-lg transition-all duration-200 px-5 py-2.5 flex items-center "
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
        </Dialog>{" "}
        {filtering && table.getState().globalFilter !== filtering ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600 mb-3"></div>
              <p className="text-slate-600 font-medium text-sm">
                Filtreleniyor...
              </p>
            </div>
          </div>        ) : (          <Table
            key={`table-${paginationKey}`}
            className="w-full"
          >
            <TableHeader className="w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.getSize(),
                        }}
                        className={`px-3 py-2 whitespace-nowrap overflow-hidden text-white bg-cyan-700 text-[0.8rem] font-medium relative ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        title={(() => {
                          // Get header text
                          const headerText =
                            header.column.columnDef.header || header.id;
                          // Only add tooltip if header might be truncated
                          const headerWidth = header.getSize();
                          const approxCharsPerHeader = Math.floor(
                            (headerWidth - 24) / 8
                          ); // Average char width ~8px
                          return headerText.length > approxCharsPerHeader
                            ? headerText
                            : "";
                        })()}
                      >
                        <div>
                          {" "}
                          <div
                            className="flex items-center justify-between"
                            onClick={(e) => {
                              // Prevent sorting when releasing after a resize
                              if (
                                header.column.getIsResizing() ||
                                isResizingOrJustResized ||
                                e.target.closest(".cursor-col-resize")
                              ) {
                                return;
                              }
                              header.column.getToggleSortingHandler()(e);
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            {header.column.getCanSort() && (
                              <div className="ml-1">
                                {{
                                  asc: (
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
                                      className="text-white"
                                    >
                                      <path d="m18 15-6-6-6 6" />
                                    </svg>
                                  ),
                                  desc: (
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
                                      className="text-white"
                                    >
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                  ),
                                }[header.column.getIsSorted()] || (
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
                                    className="text-white opacity-80"
                                  >
                                    <path d="m21 16-4 4-4-4" />
                                    <path d="M17 20V4" />
                                    <path d="m3 8 4-4 4 4" />
                                    <path d="M7 4v16" />
                                  </svg>
                                )}
                              </div>
                            )}
                            {/* Column Resize Handle */}{" "}
                            {header.column.getCanResize() && (
                              <div
                                onMouseDown={(e) => {
                                  e.stopPropagation(); // Prevent click event from bubbling

                                  // Set resize state to true
                                  setIsResizingOrJustResized(true);

                                  // Clear any existing timeout
                                  if (resizeTimeoutRef.current) {
                                    clearTimeout(resizeTimeoutRef.current);
                                  }

                                  // Call the original resize handler
                                  header.getResizeHandler()(e);

                                  // Add a mouseup event listener to the document to detect when resizing is done
                                  const handleMouseUp = () => {
                                    // Set a timeout to reset the resize state
                                    // This allows time for click events to be processed with the flag still set
                                    resizeTimeoutRef.current = setTimeout(
                                      () => {
                                        setIsResizingOrJustResized(false);
                                      },
                                      300
                                    ); // Wait 300ms before allowing sorting again

                                    // Remove the event listener
                                    document.removeEventListener(
                                      "mouseup",
                                      handleMouseUp
                                    );
                                  };

                                  document.addEventListener(
                                    "mouseup",
                                    handleMouseUp
                                  );
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation(); // Prevent touch event from bubbling
                                  setIsResizingOrJustResized(true);
                                  header.getResizeHandler()(e);
                                }}
                                onTouchEnd={() => {
                                  // Similar handling for touch events
                                  if (resizeTimeoutRef.current) {
                                    clearTimeout(resizeTimeoutRef.current);
                                  }

                                  resizeTimeoutRef.current = setTimeout(() => {
                                    setIsResizingOrJustResized(false);
                                  }, 300);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click event from triggering sort
                                  e.preventDefault();
                                }}
                                className={`absolute right-0 top-0 h-full w-[3px] cursor-col-resize select-none touch-none ${
                                  header.column.getIsResizing()
                                    ? "bg-white opacity-90"
                                    : "bg-white opacity-40 hover:opacity-80"
                                }`}
                              />
                            )}
                          </div>{" "}
                          {header.column.getCanFilter() ? (
                            <div className="mt-2  rounded-sm p-1">
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}                    className={
                      rowIndex % 2 === 0
                        ? "bg-white hover:bg-[#e1f0f5]"
                        : "bg-[#eaf5fa] hover:bg-[#d0e8f0]"
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      // Handle action column specially
                      if (cell.column.id === "actions") {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              width: cell.column.columnDef.size,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            className="px-3 py-2 text-[0.8rem] font-normal"
                            title=""
                          >
                            <div className="flex justify-center gap-2">
                              {" "}
                              <Button
                                variant="info"
                                size="icon-sm"
                                className="mx-auto"
                                onClick={() => {
                                  navigate(`/demoduzenle/${row.original.id}`);
                                  console.log("Row clicked:", row.original);
                                }}
                              >
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
                                  className="h-4 w-4"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span className="sr-only">Düzenle</span>
                              </Button>{" "}                              <Button
                                onClick={() => {
                                  setSelectedDemoId(row.original.id);
                                  setOpenDeleteDialog(true);
                                  console.log(
                                    "Silinmek üzere seçilen demo ID:",
                                    row.original.id
                                  );
                                }}
                                variant="outline"
                                size="icon-sm"
                                className="mx-auto border border-[#aad0de] text-[#5F99AE] hover:bg-[#eef6fa] hover:text-[#4b7a8c]"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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
                                <span className="sr-only">Sil</span>
                              </Button>
                            </div>
                          </TableCell>
                        );
                      } // Regular cell rendering for other columns
                      // Get the appropriate tooltip text only if content is truncated
                      const getCellTooltip = () => {
                        // Don't show tooltip by default
                        let tooltipText = "";

                        // First get the cell value
                        let cellValue;
                        const directValue = cell.getValue();
                        if (directValue !== undefined && directValue !== null) {
                          cellValue = String(directValue);
                        } else {
                          // Try to get from row data if direct value is not available
                          const fieldName = cell.column.id;
                          const rowValue = row.original[fieldName];
                          if (rowValue !== undefined && rowValue !== null) {
                            cellValue = String(rowValue);
                          }
                        }

                        // Only add tooltip if text is likely to be truncated
                        // Check if value length is more than what would fit in the cell
                        // Average character width = ~8px for 0.8rem font size
                        // Cell width = cell.column.columnDef.size - padding (px-3 = 24px)
                        const cellWidth = cell.column.columnDef.size;
                        const approxCharsPerCell = Math.floor(
                          (cellWidth - 24) / 8
                        );

                        if (
                          cellValue &&
                          cellValue.length > approxCharsPerCell
                        ) {
                          tooltipText = cellValue;
                        }

                        return tooltipText;
                      };

                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.columnDef.size,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className="px-3 py-2 text-[0.8rem] font-normal"
                          title={getCellTooltip()}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {filtering ? (
                      <span className="text-amber-600">
                        Arama kriterlerine uygun kayıt bulunamadı.
                      </span>
                    ) : (
                      <span>Kayıt bulunamadı.</span>
                    )}
                  </TableCell>{" "}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>{" "}      <div className="py-4 flex items-center justify-between gap-2 border-t border-gray-100 mt-2 pt-3">
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
          {" "}          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const canPrevious = table.getCanPreviousPage();
              if (canPrevious) {
                setIsManualPageChange(true);
                const prevPageIndex = Math.max(0, currentPageIndex - 1);
                setCurrentPageIndex(prevPageIndex);
                table.setPageIndex(prevPageIndex);
                // Force re-render to update UI
                setPaginationKey((prev) => prev + 1);
              }
            }}
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
            Önceki{" "}
          </Button>{" "}          <div className="flex items-center gap-1 bg-[#eef6fa] px-4 py-1.5 rounded-md">
            <span className="text-sm font-medium text-[#5F99AE]">
              Sayfa {currentPageIndex + 1} / {table.getPageCount()}
            </span>
          </div>          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const canNext = table.getCanNextPage();
              if (canNext) {
                setIsManualPageChange(true);
                const nextPageIndex = Math.min(
                  table.getPageCount() - 1,
                  currentPageIndex + 1
                );
                setCurrentPageIndex(nextPageIndex);
                table.setPageIndex(nextPageIndex);
                // Force re-render to update UI
                setPaginationKey((prev) => prev + 1);
              }
            }}
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

// Sütun filtresi bileşeni
function Filter({ column }) {
  const filterVariant = column.columnDef.meta?.filterVariant;
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  );
  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-full border-slate-300 rounded-md text-xs py-1 px-2 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-full border-slate-300 rounded-md text-xs py-1 px-2 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString() || ""}
      className="w-full text-slate-400 border-slate-300 rounded-md text-xs py-1 px-2 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
    >
      <option value="">Tümü</option>
      {sortedUniqueValues.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Ara... (${column.getFacetedUniqueValues().size})`}
        className="w-full border-slate-300 text-black rounded-md h-[25px]  text-xs py-1 px-2 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        list={column.id + "list"}
      />
      <div />
    </>
  );
}

// Gecikmeli giriş bileşeni
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
