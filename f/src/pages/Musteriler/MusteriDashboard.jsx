import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MusteriDashboard() {
   const { id } = useParams();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   // State tanımları
   const [musteriUnvan, setMusteriUnvan] = useState("");
   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   const {
    data: musteriIdData,
    isLoading,
    error,
    refetch: musteriIdrefetch
  } = useQuery({
    queryKey: ["musteriler", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/musteriler/${id}`
        );
        return response.data || [];
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Normalize musteri object regardless of array/object response
  const musteri = musteriIdData
    ? Array.isArray(musteriIdData)
      ? musteriIdData[0] || {}
      : musteriIdData
    : {};

  useEffect(() => {
    if (musteri && musteri.unvan) {
      setMusteriUnvan(musteri.unvan);
    } else {
      setMusteriUnvan("");
    }
  }, [musteriIdData]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/musteriler/${id}`);
      toast.success("Müşteri başarıyla silindi");
      // Silme işlemi başarılıysa, müşteri listesini yeniden yükle
      queryClient.invalidateQueries(["musteriler"]);
      
      navigate("/musterilistesi");
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Müşteri silinirken bir hata oluştu");
    } finally {
      // Her durumda, diyalogu kapat
      setOpenDeleteDialog(false);
    }
  };
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-white to-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <span className="text-gray-600 font-medium">Müşteri bilgileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-white to-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Veri Yüklenemedi</h3>
            <p className="text-gray-600 mb-6">
              Müşteri bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            <Button
              onClick={() => musteriIdrefetch()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 px-6 py-2.5"
            >
              Yeniden Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }return (
    <>
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 mx-auto max-w-7xl mt-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="flex-1">
            <h1 className="text-3xl h-12  md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              {musteri.unvan}
            </h1>
            
          </div>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <Button 
              onClick={() => navigate(`/musteriduzenle/${id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 px-5 py-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Düzenle
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 px-5 py-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Sil
            </Button>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Label className="text-gray-500 text-sm font-medium">Yetkili</Label>
            </div>
            <p className="text-gray-800 font-semibold text-lg">{musteri.yetkili || "-"}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <Label className="text-gray-500 text-sm font-medium">E-posta</Label>
            </div>
            <p className="text-gray-800 font-semibold text-lg">{musteri.eposta || "-"}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <Label className="text-gray-500 text-sm font-medium">İl / İlçe</Label>
            </div>
            <p className="text-gray-800 font-semibold text-lg">
              {musteri.il && musteri.ilce ? `${musteri.il} / ${musteri.ilce}` : "-"}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <Label className="text-gray-500 text-sm font-medium">Telefon</Label>
            </div>
            <p className="text-gray-800 font-semibold text-lg">
              {musteri.tel || "-"}
            </p>
          </div>
        </div>
      </div>      {/* Silme onay diyalogu */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Müşteri Silme İşlemi</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Evet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
