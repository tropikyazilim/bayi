"use client"

import { useState, useEffect } from "react"
import * as React from "react" // React import eklendi
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // React Query eklendi
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Label } from "@radix-ui/react-label"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

export function DataTable({ columns, data, refetch }) {
  const [error, setError] = useState(null); 
  const [filterParams, setFilterParams] = useState({}); // Filtreleme parametrelerini saklayacak state
  const queryClient = useQueryClient(); // QueryClient'ı al
  // Tablonun kullanacağı verileri yönetmek için state
  const [tableData, setTableData] = useState(data || []);
  const [filtering, setFiltering] = useState("");  
  
  const form = useForm({
    defaultValues: {
      bayi_kodu: "",
      unvan: "",
      firma_sahibi: "",
    },  });
  const navigate = useNavigate(); // Hook fonksiyon içine taşındı  
  const { id } = useParams(); // URL'den id parametresini al
  
  // Bu sayede başka bir sayfada bayiler güncellendiğinde bu liste de güncellenecek
  React.useEffect(() => {
    // data prop'u değiştiğinde ve içeriği varsa, ana veriyi direkt kullan (API isteği yapmadan)
    if (data?.length > 0) {
      console.log("Data prop'u değişti, filtrelemesiz tablo verilerini güncelliyorum");
      
      // Eğer aktif bir filtreleme işlemi yoksa data prop'unu kullan
      const hasActiveFilters = Object.values(filterParams).some(val => val && val !== '');
      if (!hasActiveFilters) {
        // Filtreleme yok, ana veriyi kullan
        queryClient.setQueryData(['filteredBayiler', {}], data);
        console.log("Filtre yok, ana veri direkt kullanıldı");
      } else {
        console.log("Aktif filtre var, ana veri güncellenmedi");
      }
    }  }, [data, queryClient, filterParams]);
  
  // React Query ile filtrelenmiş veri çekme
  const { data: filteredData, isLoading, isRefetching } = useQuery({
    queryKey: ['filteredBayiler', filterParams],
    queryFn: async () => {
      try {
        // Filtreleme parametreleri var mı kontrol et
        const hasFilters = Object.values(filterParams).some(val => val && val !== '');
        
        if (hasFilters) {
          // Boş olmayan parametreleri URL'ye ekle
          const queryParams = new URLSearchParams();
          
          Object.entries(filterParams).forEach(([key, value]) => {
            if (value) {
              queryParams.append(key, value);
            }
          });
          
          console.log("Filtreleme isteği yapılıyor", queryParams.toString());
          // Filtreleme API'sine istek gönder
          const response = await axios.get(`http://localhost:3002/api/bayiler/filter?${queryParams.toString()}`);
          
          // Kullanıcıya sonucu bildir
          if (response.data.length === 0) {
            toast.info("Filtreleme sonucu", {
              description: "Arama kriterlerine uygun kayıt bulunamadı.",
            });
          } else {
            console.log(`Filtreleme sonucu: ${response.data.length} kayıt bulundu`);
          }
          
          return response.data;
        } else {
          // Filtre yoksa mevcut verileri kullan
          console.log("Filtresiz sorguda ana veri kullanılıyor");
          return data || [];
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setError("Veriler çekilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        toast.error("Veri çekme hatası", {
          description: error.response?.data?.message || "Veriler çekilirken bir hata oluştu.",
        });
        throw error;
      }
    },    // Her zaman etkin olsun
    enabled: true,
    // Başlangıçta data prop'unu kullan
    initialData: data,
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnWindowFocus: false,
    // Bileşen mount edildiğinde yenile
    refetchOnMount: true,
    // Filtreleme sonrası önceki veri tutulmasın
    keepPreviousData: false,
    // Stale time'ı azalt - hemen yeniden çekilebilsin
    staleTime: 0,
    // Cache süresi
    cacheTime: 5 * 60 * 1000
  });
  
  // Form gönderildiğinde çalışacak fonksiyon
  function onSubmit(values) {
    console.log("Form Verileri:", values);
    
    // Filtreleme parametrelerini temizle (boşluk içerenleri kaldır)
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, val]) => [key, typeof val === 'string' ? val.trim() : val])
    );
    
    // Filtreleme parametreleri var mı kontrol et
    const hasFilters = Object.values(cleanedValues).some(val => val && val !== '');
    
    if (hasFilters) {
      // Filtreleme parametreleri varsa, bunlarla filtreleme yap
      console.log("Filtre parametreleri var, filtreleme sorgusu yapılacak", cleanedValues);
      
      // Önce mevcut durumu temizle
      queryClient.removeQueries(['filteredBayiler']);
      
      // Sonra filtre parametrelerini ayarla
      setFilterParams(cleanedValues);
        // Manuel olarak yeni sorgu başlat
      queryClient.fetchQuery({
        queryKey: ['filteredBayiler', cleanedValues],
        queryFn: async () => {
          const queryParams = new URLSearchParams();
          Object.entries(cleanedValues).forEach(([key, value]) => {
            if (value) {
              queryParams.append(key, value);
            }
          });
          
          console.log("Manuel filtreleme isteği yapılıyor");
          const response = await axios.get(`http://localhost:3002/api/bayiler/filter?${queryParams.toString()}`);
          
          // Sorgudan gelen verileri direkt olarak TableData'ya da ayarlayalım
          setTableData(response.data);
          console.log("tableData manuel güncellendi:", response.data.length);
          
          return response.data;
        }
      });    } else {
      // Filtre yoksa, filterParams'ı sıfırla ve mevcut verileri göster
      console.log("Filtre parametreleri yok, tüm verileri göster");
      setFilterParams({});
      
      // Mevcut verileri direkt kullan
      if (data) {
        // Önbelleği güncelle
        queryClient.setQueryData(['filteredBayiler', {}], data);
        // TableData'yı da güncelle
        setTableData(data);
        console.log("tableData filtresiz güncellendi:", data.length);
      }
    }
  }
  
  // Herhangi bir işlem yapıldığında verileri yenilemek için kullanılabilecek fonksiyon
  const refreshData = () => {
    console.log("Yenileme butonu tıklandı");
    // Form'u sıfırla
    form.reset({
      bayi_kodu: "",
      unvan: "",
      firma_sahibi: "",
    });
    
    // Filtreleri temizle
    setFilterParams({});
    
    // Önbelleği temizle ve veriyi ana kaynaktan yenile
    queryClient.removeQueries(['filteredBayiler']);
      // Ana listeyi yenile (Bu tek API isteği yapacak)
    refetch().then((result) => {
      if (result.data) {
        // Yeni veri geldiğinde filtresiz sorguya kaydet
        queryClient.setQueryData(['filteredBayiler', {}], result.data);
        
        // TableData'yı da güncelle
        setTableData(result.data);
        console.log("tableData yenilemede güncellendi:", result.data.length);
        
        toast.success("Veriler güncellendi", {
          description: `${result.data.length} kayıt başarıyla yenilendi.`,
        });
      }
    });
  };  // filteredData değiştiğinde tableData'yı güncelle
  React.useEffect(() => {
    if (filteredData !== undefined && filteredData !== null) {
      console.log("filteredData değişti:", filteredData.length);
      setTableData(filteredData);
    }    // ...existing code...
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                  {error}
                </div>
              )}
    // ...existing code...
  }, [filteredData]);
  
  // Table yapılandırması - tableData kullanarak tabloyu güncelleyelim
  const table = useReactTable({
    data: tableData, // State üzerinden veri kullan (filteredData değil)
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
  })
    // Bu useEffect kaldırıldı çünkü yukarıdaki useEffect ile aynı işlevi görüyor

  return (
    <div className="h-full flex flex-col">
       <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-0   max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300  "
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-3 py-2 rounded mb-3 text-m">
              Veriler yükleniyor, lütfen bekleyin...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 pb-2">
            
                  <FormField
                    control={form.control}
                    name="bayi_kodu"
                    render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                      Bayi Kodu
                      </FormLabel>
                      <FormControl>
                      <Input
                        type="text"
                        placeholder="Bayi Kodu"
                        className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unvan"
                    render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                      Ticari Ünvan
                      </FormLabel>
                      <FormControl>
                      <Input
                        type="text"
                        
                        placeholder="Ticari Ünvan"
                        className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                    )}
                  />

                  

                  <FormField
                    control={form.control}
                    name="firma_sahibi"
                    render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m ">
                      Firma Sahibi
                      </FormLabel>
                      <FormControl>
                      <Input
                        type="text"
                        
                        placeholder="Firma Sahibi"
                        className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                    )}
                  />
                  <div className="flex items-end">                    <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    >
                    ARA
                    </Button>
                  </div>
                  </div>
                  {/* </div> */}
        </form>
      </Form>      <div className="flex items-center py-2 justify-between">
        <Input
          placeholder="Tüm alanlarda arama yapın..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm h-8"
        />        <Button
          onClick={refreshData}
          variant="success"
          size="sm"
        >
          Yenile
        </Button>      </div>
      <div>
        <div className="rounded-md border">
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
                      className="px-2 py-2 whitespace-nowrap bg-slate-200"
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
                    
                    // className={index % 2 === 0 ? "bg-white" : "bg-slate-50"} 
                    className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} cursor-pointer hover:bg-muted`}
                  onClick={() => {
                    // BayiEkle sayfasına yönlendir
                    navigate(`/bayiduzenle/${row.original.id}`); // BayiEkle sayfasına git
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
                        }}
                        className="px-2 py-2"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="py-4 flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Toplam {table.getFilteredRowModel().rows.length} kayıt
        </div>
        <div className="flex items-center gap-2">          <Button
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
              Sayfa{" "}
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
          </div>          <Button
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
  )
}
