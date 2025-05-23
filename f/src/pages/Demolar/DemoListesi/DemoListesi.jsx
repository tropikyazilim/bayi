"use client";

import { useQuery } from "@tanstack/react-query";
import DemoListesiDataTable from "./DemoListesiDataTable";
import { demolistesicolumns } from "./DemoListesiColumns";
import axios from "axios";
import { toast } from "sonner";

export default function DemoListesi() {
  const {
    data: DemoData,
    isLoading,
    error,
    refetch: demorefetch,
    isFetching,
  } = useQuery({
    queryKey: ["demolar"],
    queryFn: async () => {
      try {
       
        const response = await axios.get(
          "http://localhost:3002/api/demolar"
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
    // Stale time'ı arttır - 5 dakika içinde tekrar çekilmesin
    staleTime: 5 * 60 * 1000,
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
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
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
        <div className="bg-white p-2 rounded-lg shadow-md grid grid-cols-1">
          <div className="py-2 pl-4 border-b bg-cyan-700 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Demo Talebi Listesi</h1>
            </div>
          </div>
          <div className="flex-1 p-1 min-h-0">
            <div className="h-full overflow-hidden w-full">              <DemoListesiDataTable columns={demolistesicolumns} data={DemoData || []} refetch={demorefetch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
