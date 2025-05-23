"use client"
import * as React from "react";
import axios from "axios"
import { useState, useEffect } from "react" // useState import edildi
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 


const formSchema = z.object({
 items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "En az bir modül seçmelisiniz.",
  }),
  paket_adi: z.string().min(1, "Paket gerekli"),
  paket_kodu: z.string().min(1, "Paket gerekli"),
  paket_aciklama: z.string().min(1, "Paket gerekli"),
});

export default function PaketDuzenle() {
    const { id } = useParams();
    const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
   const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paket_adi: "",
      paket_kodu: "",
      paket_aciklama: "",
      items: [],
    },
  });

  const createPaketDuzenleMutation = useMutation({
    mutationFn: (PaketDuzenleData) => {
      return axios.put(`http://localhost:3002/api/paketler/${id}`, PaketDuzenleData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();

      toast.success("Paket başarıyla eklendi", {
        description: "İşlem başarıyla tamamlandı",
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description:
          error.response?.data?.message || "Paket eklenirken bir hata oluştu",
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
      setSuccess(false);
    },
  });

function onSubmit(values) {
    // Form verilerini konsola yazdır
    console.log("Form Verileri:", values);
    // API isteği yap
    createPaketDuzenleMutation.mutate({
      ...values,
      items: values.items,
      
    });
    navigate("/paketlistesi");
  }


const {
    data: modulPaketDuzenleData,
    isLoading: modulPaketDuzenleLoading,
    error: modulPaketDuzenleError,
    refetch: modulPaketDuzenlerefetch,
  } = useQuery({
    queryKey: ["moduller"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/moduller"
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

//paketleri idye göre getiren api
const {
    data: paketIdData,
    isLoading: paketIdLoading,
    isError: paketIdError,
  } = useQuery({
    queryKey: ["paketduzenle", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/paketler/${id}`
        );
        console.log("Paket duzenle verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("Paket duzenle  verileri yüklenirken hata oluştu:", error);
        toast.error("Paket duzenle  verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  });    // Paket duzenle verisi geldiğinde formu doldur
    useEffect(() => {
      if (paketIdData) {
        const paket = Array.isArray(paketIdData) ? paketIdData[0] : paketIdData;
        if (paket) {
          // Eğer paket_modul bir string ise parse et
          let items = [];
          if (paket.paket_modul) {
            try {
              if (typeof paket.paket_modul === 'string') {
                items = JSON.parse(paket.paket_modul);
              } else {
                items = paket.paket_modul;
              }
            } catch (e) {
              console.error("paket_modul parse edilemedi:", e);
            }
          }
          // Form alanlarını paket verileriyle doldur
          const formValues = {
            paket_kodu: paket.paket_kodu || "",
            paket_adi: paket.paket_adi || "",
            paket_aciklama: paket.paket_aciklama || "",
            items: items,
          };
          form.reset(formValues);
          setIsLoading(false);
        }
      }
    }, [paketIdData, form]);

  // Check if any of our queries are loading
  if (modulPaketDuzenleLoading || paketIdLoading || isLoading) {
    return (
      <div className="h-full p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (modulPaketDuzenleError || paketIdError || error) {
    return (
      <div className="h-full p-4">
        <div className="flex flex-col justify-center items-center h-32">
          <div className="text-red-500 mb-2">
            Veri yüklenirken bir hata oluştu
          </div>
          <button onClick={() => {
            modulPaketDuzenlerefetch();
            if (id) {
              queryClient.invalidateQueries(["paketduzenle", id]);
            }
          }}
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
      <div className="h-full w-full p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
              <FormField
                control={form.control}
                name="paket_kodu"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Kodu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket Kodu Giriniz"
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
                name="paket_adi"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Adı
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket No Giriniz"
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
                name="paket_aciklama"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Açıklama
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket Açıklama Giriniz"
                        className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            
        <FormField          control={form.control}          name="items"
          render={() => (
            <FormItem className="md:col-span-3 mt-4">              
                <div className="mb-5 bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border-l-4 border-indigo-500">
                <FormLabel className="text-xl font-semibold text-indigo-700">Modüller</FormLabel>
                <FormDescription className="text-slate-600 text-sm mt-1">
                  Paket için kullanılabilir modülleri seçiniz.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {modulPaketDuzenleData.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.adi}
                        className="flex flex-row items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-200 group"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.modul_adi)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.modul_adi])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.modul_adi
                                    )
                                  )
                            }}
                            className="h-7 w-7 rounded-md border-2 border-indigo-300 bg-white shadow-sm ring-offset-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-blue-500 data-[state=checked]:border-indigo-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                          />
                        </FormControl>
                        <FormLabel className="text-base font-medium cursor-pointer select-none text-gray-700 group-hover:text-indigo-700 transition-colors ml-1">
                          {item.modul_adi}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />              ))}              </div>
              <FormMessage className="text-sm text-red-500 mt-2" />
            </FormItem>
          )}
        />
            </div>
            
            <div className="flex justify-end mt-5">
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={() => {
                  form.reset();
                  navigate("/paketlistesi");
                }}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="ml-3"
              >
                Paketi Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}