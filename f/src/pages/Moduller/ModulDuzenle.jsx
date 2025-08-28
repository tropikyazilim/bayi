"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const formSchema = z.object({
  modul_kodu: z.string().min(1, "Modül kodu gerekli"),
  modul_adi: z.string().min(1, "Modül adı gerekli"),
  modul_aciklama: z.string().min(1, "Modül açıklaması gerekli"),
});

export default function ModulDuzenle() {
  const { id } = useParams();
    const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modul_kodu: "",
      modul_adi: "",
      modul_aciklama: "",
    },
  });

  // Modül verisini çekme
  const {
    data: ModulData,
    isFetching,
    refetch: refetchBayiDuzenle,
  } = useQuery({
    queryKey: ["modulduzenle", id],
    queryFn: async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
        const response = await axios.get(
          `${apiUrl}/api/moduller/${id}`
        );
        console.log("Modül verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("Modül verileri yüklenirken hata oluştu:", error);
        toast.error("Modül verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  });
  useEffect(() => {
    if (ModulData) {
      const moduller = Array.isArray(ModulData) ? ModulData[0] : ModulData;
      if (moduller) {
        const formValues = {
          modul_kodu: moduller.modul_kodu || "",
          modul_adi: moduller.modul_adi || "",
          modul_aciklama: moduller.modul_aciklama || "",
        };
        form.reset(formValues);
      }
    }
  }, [ModulData, form]);

   const handleModulDuzenleMutation = useMutation({
    mutationFn: (modulData) => {
      if (id) {
        // Güncelleme işlemi
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
        return axios.put(
          `${apiUrl}/api/moduller/${id}`,
          modulData
        );
      } else {
        // Yeni kayıt işlemi
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
        return axios.post(`${apiUrl}/api/moduller`, modulData);
      }
    },
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);

      if (id) {
        toast.success("Modül başarıyla güncellendi", {
          description: "Değişiklikler kaydedildi",
          style: {
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
          },
        });


      } else {
        form.reset();
        toast.success("Modül başarıyla eklendi", {
          description: "İşlem başarıyla tamamlandı",
          style: {
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
          },
        });
      }
    },
    onError: (error) => {
      const operation = id ? "güncellenirken" : "eklenirken";
      toast.error("Hata", {
        description:
          error.response?.data?.message ||
          `Müşteri ${operation} bir hata oluştu`,
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
    // Form verilerini ve ID'yi kontrol etmek için log ekliyorum
    console.log("Form Verileri:", values);
    console.log("Güncelleme için kullanılan ID:", id);
    
    // Form submit işlemi, sadece kullanıcı butona tıkladığında gerçekleşsin
    if (id && typeof id === "string" && id.trim() !== "") {
      handleModulDuzenleMutation.mutate(values);
      form.reset();
      navigate("/modullistesi/");
      
    } else {
      console.error("Geçersiz ID, form submit işlemi iptal edildi.");
      toast.error("Güncelleme hatası", {
        description: "Bayi ID'si bulunamadı, lütfen sayfayı yenileyin veya bayi listesine geri dönün.",
      });
    }
  }

  return (
    <>
      <div className="h-full w-full">
        <div className="h-full w-full p-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                {/* Modül Kodu */}
                <FormField
                  control={form.control}
                  name="modul_kodu"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Kodu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Kodu"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Modül Adı */}
                <FormField
                  control={form.control}
                  name="modul_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Adı
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Adı"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Modül Açıklama */}
                <FormField
                  control={form.control}
                  name="modul_aciklama"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Açıklama
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Açıklama"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>              <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-end mt-5">
                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                    navigate("/modullistesi/");
                  }}
                  className="bg-red-400 text-white border border-gray-300 hover:bg-red-600 h-11 text-sm rounded-lg px-5 font-medium transition-all shadow-sm flex items-center group"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-white group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                  İptal
                </Button>

                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white h-11 text-sm rounded-lg px-6 font-medium transition-all shadow-sm flex items-center relative"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
