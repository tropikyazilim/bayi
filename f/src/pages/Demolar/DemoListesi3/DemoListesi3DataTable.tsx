import { useMemo } from "react";
import * as React from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Excel export işlemleri için
import { jsPDF } from "jspdf"; // PDF export işlemleri için
import autoTable from "jspdf-autotable"; // PDF'de tablo oluşturmak için
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // React Query eklendi
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { type Person } from "./DemoListesi3";
import { MRT_Localization_TR } from "material-react-table/locales/tr";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button as Buttonshad } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

interface TableParameter {
  parametreid: number;
  deger: any;
  kayitzamani?: string;
}

interface TableDesign {
  columnSizing: Record<string, number>;
  columnVisibility: Record<string, boolean>;
  columnFilters: any[];
  sorting: any[];
  columnOrder: string[];
}

interface DemoListesi3DataTableProps {
  columns: MRT_ColumnDef<Person>[];
  data: Person[];
  refetch?: () => void;
}

export default function DemoListesi3DataTable({
  columns,
  data,
  refetch,
}: DemoListesi3DataTableProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const [tableConfig, setTableConfig] = useState<TableDesign>({
    columnOrder: [],
    columnFilters: [],
    columnSizing: {},
    columnVisibility: {},
    sorting: []
  });
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [isManualPageChange, setIsManualPageChange] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const updateTableConfig = (updates: Partial<TableDesign>) => {
    setTableConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Parametreleri getirmek için useQuery kullanımı
  const {
    data: parametersData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["parametreler"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/ayarlar");
        return response.data || [];
      } catch (error) {
        console.error("API Hatası:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Add useEffect to log data when component mounts or data changes
  useEffect(() => {
    console.log("Demo Listesi Data:", data);
  }, [data]);

  // State to force re-render when needed
  const [paginationKey, setPaginationKey] = useState(0);  // Track if a resize operation was recently performed
  const [isResizingOrJustResized, setIsResizingOrJustResized] = useState(false);
  const resizeTimeoutRef = React.useRef(null);
  // ColumnResizeMode tipi yerine doğrudan string değeri kullanıyoruz
  const [columnResizeMode, setColumnResizeMode] = useState("onChange"); // Changed back to onChange for live resizing preview
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState(null);

  // Load saved configuration when parameters data is available
  useEffect(() => {
    if (parametersData && parametersData.length > 0) {
      const tasarimParametre = parametersData.find(
        (param: TableParameter) => param.parametreid === 4
      );      if (tasarimParametre?.deger) {
        try {
          const tasarimVerisi: TableDesign = typeof tasarimParametre.deger === "string" 
            ? JSON.parse(tasarimParametre.deger) 
            : tasarimParametre.deger;

          console.log("Loading saved table design:", tasarimVerisi);

          // Update the table configuration with the saved design
          setTableConfig({
            columnOrder: tasarimVerisi.columnOrder || [],
            columnFilters: tasarimVerisi.columnFilters || [],
            columnSizing: tasarimVerisi.columnSizing || {},
            columnVisibility: tasarimVerisi.columnVisibility || {},
            sorting: tasarimVerisi.sorting || []
          });

          if (tasarimParametre.kayitzamani) {
            setLastUpdateTime(tasarimParametre.kayitzamani);
            console.log("Last update time loaded:", tasarimParametre.kayitzamani);
          }
        } catch (error) {
          console.error("Tablo tasarımı yüklenirken hata:", error);
          toast.error("Tablo tasarımı yüklenirken hata oluştu");
        }
      }
    }
  }, [parametersData]);
  //tasarımı kaydetmek için backende put isteği atılacak
  const updateParametersMutation = useMutation<any, Error, TableParameter[]>({
    mutationFn: async (parameterData) => {
      console.log("Mutation çağrıldı, gönderilen veri:", parameterData);
      return axios.put(`${API_URL}/api/ayarlar`, parameterData, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (response) => {
      setSuccess(true);
      setError(null);

      queryClient.invalidateQueries({ queryKey: ["parametreler"] });

      if (response.data?.updatedAyarlar?.length > 0) {
        const updatedParam = response.data.updatedAyarlar.find(
          (param: TableParameter) => param.parametreid === 4
        );
        if (updatedParam?.kayitzamani) {
          setLastUpdateTime(updatedParam.kayitzamani);
        }
      }

      toast.success("Tüm değerler başarıyla güncellendi", {
        description: "İşlem başarıyla tamamlandı",
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    },
    onError: (error: Error & { response?: any }) => {
      console.error("Mutation hatası:", error);
      console.error("Hata detayları:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Değerler güncellenirken bir hata oluştu";

      setError(errorMessage);
      setSuccess(false);

      toast.error("Hata", {
        description: errorMessage,
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
    },
  });

  // Clean up the timeout when the component unmounts
  React.useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);
  // We'll move the column visibility effect after table initialization

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
  async function handleVarsayilanTasarim() {
    toast.info("Varsayılan tasarım yükleniyor...");

    try {
      const response = await axios.get(`${API_URL}/api/ayarlar/varsayilan/4`);
      const tasarimVerisi: TableDesign = response.data?.deger 
        ? (typeof response.data.deger === "string" 
          ? JSON.parse(response.data.deger) 
          : response.data.deger)
        : response.data;

      if (tasarimVerisi) {
        console.log("Varsayılan tasarım uygulanıyor:", tasarimVerisi);

        if (tasarimVerisi.columnSizing) {
          table.setColumnSizing(tasarimVerisi.columnSizing);
        }

        if (tasarimVerisi.columnFilters) {
          table.setColumnFilters(tasarimVerisi.columnFilters);
        }

        if (tasarimVerisi.columnVisibility) {
          table.setColumnVisibility(tasarimVerisi.columnVisibility);
        }

        if (tasarimVerisi.sorting) {
          table.setSorting(tasarimVerisi.sorting);
        }

        if (tasarimVerisi.columnOrder) {
          table.setColumnOrder(tasarimVerisi.columnOrder);
        }

        if (response.data.kayitzamani) {
          setLastUpdateTime(response.data.kayitzamani);
        }

        toast.success("Varsayılan tablo tasarımı yüklendi");
      } else {
        toast.info("Varsayılan tasarım bulunamadı");
      }
    } catch (error) {
      console.error("Varsayılan tasarım getirme hatası:", error);
      toast.error(
        "Varsayılan tasarım yüklenirken hata oluştu: " +
        ((error as any).response?.data?.message || (error as Error).message)
      );
    }
  }

  function handleTasarimiKaydet() {
    console.log('Saving table design:', tableConfig);

    const parameterData: TableParameter[] = [{
      parametreid: 4,
      deger: tableConfig,
    }];

    updateParametersMutation.mutate(parameterData);
    toast.info("Tablo tasarımı kaydediliyor...");

    if (lastUpdateTime) {
      toast.info(`Son kayıt: ${formatDateTime(lastUpdateTime)}`, {
        duration: 3000,
        style: {
          backgroundColor: "#e0f2fe",
          border: "1px solid #93c5fd",
          color: "#1e40af",
        },
      });
    }
  }

  // We'll move the column visibility effect after table initialization

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

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableFilters: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnActions: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    columnResizeMode: "onChange",
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,

    state: {
      columnOrder: tableConfig.columnOrder,
      columnFilters: tableConfig.columnFilters,
      columnVisibility: tableConfig.columnVisibility,
      columnSizing: tableConfig.columnSizing,
      sorting: tableConfig.sorting,
      pagination: { pageIndex: currentPageIndex, pageSize: 10 },
    },

    onColumnOrderChange: (updater) => {
      const newOrder = typeof updater === 'function' 
        ? updater(tableConfig.columnOrder) 
        : updater;
      console.log('Column order changing to:', newOrder);
      updateTableConfig({ columnOrder: newOrder });
    },

    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function'
        ? updater(tableConfig.columnFilters)
        : updater;
      updateTableConfig({ columnFilters: newFilters });
    },

    onColumnSizingChange: (updater) => {
      const newSizing = typeof updater === 'function' 
        ? updater(tableConfig.columnSizing) 
        : updater;
      console.log('Column sizing changed:', newSizing);
      updateTableConfig({ columnSizing: newSizing });
    },

    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === 'function'
        ? updater(tableConfig.columnVisibility)
        : updater;
      console.log('Column visibility changed:', newVisibility);
      updateTableConfig({ columnVisibility: newVisibility });
    },

    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function'
        ? updater(tableConfig.sorting)
        : updater;
      updateTableConfig({ sorting: newSorting });
    },

    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#fff" : "#eaf5fa",
        "&:hover": {
          backgroundColor: row.index % 2 === 0 ? "#fff" : "#d0e8f0",
        },
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#0e7490",
        color: "white",
        "& .MuiIconButton-root": {
          color: "white",
        },
        "& .MuiTableSortLabel-root": {
          color: "white",
        },
        "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
          color: "white !important",
        },
        "& .MuiTableSortLabel-root:hover": {
          color: "white",
        },
        "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
          color: "white !important",
        },
        "& .MuiTableSortLabel-icon": {
          color: "white !important",
        },
      },
    },
    localization: MRT_Localization_TR,

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={refetch}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const exportToPdf = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      // Add title and date
      const now = new Date();
      const formattedDate = now.toLocaleDateString("tr-TR");
      doc.setFontSize(18);
      doc.text("Demo Listesi", 14, 22);
      doc.setFontSize(11);
      doc.text(`Oluşturulma Tarihi: ${formattedDate}`, 14, 30);

      // Prepare table data
      const tableColumns: string[] = [];
      const tableData: (string | number)[][] = [];

      // Get visible column headers, excluding mrt-row-spacer
      table
        .getAllColumns()
        .filter((column) => column.getIsVisible() && column.id !== "mrt-row-spacer")
        .forEach((column) => {
          const header = String(column.columnDef.header || column.id);
          tableColumns.push(header);
        });

      // Get row data for visible columns
      table.getRowModel().rows.forEach((row) => {
        const rowData: (string | number)[] = [];
        table
          .getAllColumns()
          .filter((column) => column.getIsVisible() && column.id !== "mrt-row-spacer")
          .forEach((column) => {
            const cell = row.getAllCells().find((c) => c.column.id === column.id);
            let value = "";
            if (cell) {
              const cellValue = cell.getValue();
              value = cellValue !== null && cellValue !== undefined ? String(cellValue) : "";
            }
            rowData.push(value);
          });
        tableData.push(rowData);
      });

      // Add table to PDF using autoTable
      autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          font: "helvetica",
        },
        headStyles: {
          fillColor: [14, 116, 144],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
          halign: "left",
        },
      });

      // Generate filename with current date
      const fileName = `Demo_Listesi_${now.toISOString().split("T")[0]}.pdf`;

      // Save the PDF
      doc.save(fileName);

      // Success notification
      toast.success("PDF dosyası başarıyla indirildi", {
        description: `Dosya adı: ${fileName}`,
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    } catch (error) {
      console.error("PDF'e aktarma hatası:", error);
      toast.error("PDF'e aktarma sırasında bir hata oluştu", {
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
    }
  };

  const exportToExcel = () => {
    try {
      // Filter out unwanted columns and get visible columns only
      const exportData = table.getRowModel().rows.map((row) => {
        const rowData: Record<string, string> = {};
        table
          .getAllColumns()
          .filter((column) => column.getIsVisible() && column.id !== "mrt-row-spacer")
          .forEach((column) => {
            const header = String(column.columnDef.header || column.id);
            const cell = row.getAllCells().find((c) => c.column.id === column.id);
            let value = "";
            if (cell) {
              const cellValue = cell.getValue();
              value = cellValue !== null && cellValue !== undefined ? String(cellValue) : "";
            }
            rowData[header] = value;
          });
        return rowData;
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Demo Listesi");

      // Generate filename with current date
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const fileName = `Demo_Listesi_${formattedDate}.xlsx`;

      // Write and download the file
      XLSX.writeFile(workbook, fileName);

      toast.success("Excel dosyası başarıyla indirildi", {
        description: `Dosya adı: ${fileName}`,
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    } catch (error) {
      console.error("Excel'e aktarma hatası:", error);
      toast.error("Excel'e aktarma sırasında bir hata oluştu", {
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
    }
  };

  function formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return "";

    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  return (
    <>
      {" "}
      <div className="flex items-center gap-4">
        {" "}
        <Buttonshad
          variant="outline"
          size="sm"
          asChild={false}
          className="no-underline focus:ring-0 focus:ring-offset-0 focus:outline-none border-slate-300 shadow-none bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 flex items-center"
          onClick={exportToPdf}
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
            className="mr-1"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
          PDF'e Aktar
        </Buttonshad>{" "}
        <Buttonshad
          size="sm"
          variant="outline"
          asChild={false}
          className="h-8 focus:ring-0 focus:ring-offset-0 focus:outline-none border-slate-300 shadow-none bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 flex items-center"
          style={{ boxShadow: "none", outline: "none" }}
          onClick={exportToExcel}
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
            className="mr-1"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2" />
            <path d="M8 17h2" />
            <path d="M14 13h2" />
            <path d="M14 17h2" />
          </svg>
          Excel'e Aktar
        </Buttonshad>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Buttonshad
              size="sm"
              variant="outline"
              className="h-8 focus:ring-0 focus:ring-offset-0 focus:outline-none border-slate-300 shadow-none flex items-center gap-2"
              style={{ boxShadow: "none", outline: "none" }}
            >
              İşlemler <ChevronDown className="h-4 w-4" />
            </Buttonshad>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel inset className="font-normal">
              Tablo Ayarları
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup className="normal-case">              <DropdownMenuItem
                inset
                className="cursor-pointer"
                onClick={handleTasarimiKaydet}
              >
                <span>Tasarımı Kaydet</span>
                <DropdownMenuShortcut className="ml-auto">
                  ⇧⌘P
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                inset
                className="cursor-pointer"
                onClick={handleVarsayilanTasarim}
              >
                <span>Tasarımı Sıfırla</span>
                <DropdownMenuShortcut className="ml-auto">
                  ⌘B
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <MaterialReactTable table={table} />
    </>
  );
}
