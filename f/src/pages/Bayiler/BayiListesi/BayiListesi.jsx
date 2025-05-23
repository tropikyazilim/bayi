"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "./BayiDataTable"
import { columns } from "./BayiColumns"
import axios from "axios"
import { toast } from "sonner"

export default function BayiListesi() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["bayiler"],
    queryFn: async () => {
      try {
        console.log("API isteği yapılıyor: /api/bayiler");
        const response = await axios.get("http://localhost:3002/api/bayiler");
        return response.data || [];
      } catch (error) {
        console.error("API Hatası:", error);
        throw error;
      }
    },
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnWindowFocus: false,
    // Ağ bağlantısı geri geldiğinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnReconnect: false,
    // Stale time'ı arttır - 5 dakika içinde tekrar çekilmesin
    staleTime: 5 * 60 * 1000
  });

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4">
        <div className="flex flex-col justify-center items-center h-32">
          <div className="text-red-500 mb-2">
            Veri yüklenirken bir hata oluştu
          </div>          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="h-full w-full p-1">
        <div className="bg-white p-4 rounded-lg shadow-md  grid grid-cols-1 ">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Bayi Listesi</h1>
              
            </div>
          </div>          <div className="flex-1 p-4 min-h-0">
            <div className="h-full overflow-hidden">
              <DataTable columns={columns} data={data || []} refetch={refetch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}