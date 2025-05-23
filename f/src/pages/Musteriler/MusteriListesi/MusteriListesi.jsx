"use client";

import { useQuery } from "@tanstack/react-query";
import MusteriDataTable from "./musteridatatable";
import { mustericolums } from "./mustericolumns";
import axios from "axios";
import { toast } from "sonner";

export default function MusteriListesi() {
  const {
    data: musteriData,
    isLoading,
    error,
    refetch: musterirefetch,
  } = useQuery({
    queryKey: ["musteriler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/musteriler"
        );
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
          </div>
          <button
            onClick={() => musterirefetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="h-full w-full p-1">        <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 shadow-slate-300">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Müşteri Listesi</h1>
              </div>          </div>          <div className="flex-1 min-h-0">
              <div className="h-full overflow-auto">
                <MusteriDataTable columns={mustericolums} data={Array.isArray(musteriData) ? musteriData : musteriData ? [musteriData] : []} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
