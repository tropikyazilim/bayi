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

export default function ModulEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Parametreleri getirmek için useQuery kullanımı
  const {
    data: parametersData,
    isLoading,
    error: queryError
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modul_kodu: "",
      modul_adi: "",
      modul_aciklama: "",
    },
  });

  // Parametreler yüklendiğinde form alanlarını doldur
  useEffect(() => {
    if (parametersData && parametersData.length > 0) {
      // parametreid=1 olan değeri bul ve modul_kodu'na ata
      const modulKoduParam = parametersData.find(param => param.parametreid === 1);
      if (modulKoduParam) {
        form.setValue("modul_kodu", modulKoduParam.deger);
        console.log("Modül kodu otomatik olarak dolduruldu:", modulKoduParam.deger);
      }
    }
  }, [parametersData, form]);

  const createModulMutation = useMutation({
    mutationFn: (ModulData) => {
      return axios.post("http://localhost:3002/api/moduller", ModulData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();
      // Modüller listesini güncelle
      queryClient.invalidateQueries(["moduller"]);

      toast.success("Modül başarıyla eklendi", {
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
          error.response?.data?.message || "Modül eklenirken bir hata oluştu",
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
    console.log("Form Verileri:", values);
    console.log("Form hataları:", form.formState.errors);

    setSuccess(false);
    setError(null);
    createModulMutation.mutate(values);
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
              </div>

             <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-4">
                                           <Button
                                             type="button"
                                             onClick={() => {
                                               form.reset();
                                               
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
