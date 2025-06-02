"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Ayarlar() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const formSchema = z.object({
    modul_kodu: z.string().min(1, "Modül kodu gerekli"),
    kullanici_sayisi: z.string().min(1, "Kullanıcı sayısı gerekli"),
    is_demo_ayar: z.enum(["E", "H"]).default("H"),
  });

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  console.log("Kullanılan API URL:", apiUrl);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modul_kodu: "",
      kullanici_sayisi: "",
      is_demo_ayar: "H",
    },
  });
  const updateParametersMutation = useMutation({
    mutationFn: (parameterData) => {
      console.log("Mutation çağrıldı, gönderilen veri:", parameterData);

      // Content-Type header'ı ekleyerek ve stringification yaparak gönderelim
      const dataJson = JSON.stringify(parameterData);
      console.log("Stringified data:", dataJson);

      return axios.put(`${apiUrl}/api/ayarlar`, dataJson, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (response) => {
      console.log("Başarılı yanıt:", response.data);
      setSuccess(true);
      setError(null);

      // Parametreler listesini güncelle
      queryClient.invalidateQueries(["parametreler"]);

      toast.success("Tüm değerler başarıyla güncellendi", {
        description: "İşlem başarıyla tamamlandı",
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    },
    onError: (error) => {
      console.error("Mutation hatası:", error);
      console.error("Hata detayları:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Hata detaylarını göster
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Değerler güncellenirken bir hata oluştu";

      setError(errorMessage);

      toast.error("Hata", {
        description: errorMessage,
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

    // SADECE form state'inden doğrudan değerleri kullan
    // Bu yöntem, sekme değişikliklerinden etkilenmeden, güvenilir şekilde form değerlerini toplar
    const allFormValues = form.getValues();
    console.log("Tüm form değerleri:", allFormValues);

    // Doğrudan values nesnesini kullan - bu şekilde zod doğrulaması yapılmış değerleri alırız
    // Bu, beklenmeyen veri tiplerini önler
    const validatedValues = values;
    console.log("Doğrulanmış form değerleri:", validatedValues);

    const parametreValues = [];

    // Sadece bilinen form alanlarını eşleştir
    const fieldMappings = {
      modul_kodu: "1",
      kullanici_sayisi: "2",
      is_demo_ayar: "3",
    };
    // Form değerlerinden parametre değerlerini oluştur
    Object.keys(fieldMappings).forEach((fieldName) => {
      if (allFormValues[fieldName] !== undefined) {
        const parametreId = fieldMappings[fieldName];

        // Switch için özel kontrol
        let degerValue = allFormValues[fieldName];

        // Switch değeri için özel işlem
        if (fieldName === "is_demo_ayar") {
          console.log("Switch değeri gönderilmeden önce:", degerValue);
          // Switch değerini E/H formatında gönder
          if (degerValue === true || degerValue === "on") degerValue = "E";
          else if (degerValue === false || degerValue === "off" || !degerValue)
            degerValue = "H";
          // Eğer zaten E/H formatında ise dokunma
          console.log("Switch değeri normalize edildi:", degerValue);
        }

        // Kullanıcı sayısını kontrol et - sayı da olabilir string de
        if (fieldName === "kullanici_sayisi") {
          // Sayısal değeri string olarak gönder - JSON için güvenli format
          degerValue = String(degerValue);
        } // JSONB tipine uygun olarak değer hazırla
        // Değeri direk olarak gönder, backend tarafında JSON işlemi yapılacak
        // parametreId de string olmalı
        parametreValues.push({
          parametreid: String(parametreId),
          deger: degerValue,
        });
      }
    });

    console.log("Gönderilecek veriler (tüm sekmelerden):", parametreValues);

    setSuccess(false);
    setError(null);

    // useMutation hook'u kullanarak PUT isteği gönder
    updateParametersMutation.mutate(parametreValues);
  }
  // Parametreleri getirmek için useQuery kullanımı
  const {
    data: parametersData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["parametreler"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/ayarlar`);
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

  // Parametreler yüklendiğinde form alanlarını güncelle
  useEffect(() => {
    if (parametersData && parametersData.length > 0) {
      // Form değerini güncelle
      form.setValue("modul_kodu", parametersData[0].deger);
      form.setValue("kullanici_sayisi", parametersData[1].deger);
      form.setValue("is_demo_ayar", parametersData[2].deger);
    }
  }, [parametersData, form]);

  return (
    <div className="h-full w-full p-4">
      <div className="bg-white rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                {error}
              </div>
            )}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white py-2 px-4 border-b bg-cyan-700 rounded-t-lg">
                Genel Ayarlar
              </h1>
              <div className="h-0.5 bg-gray-200 w-full"></div>
            </div>
            <div className="px-4 pb-4">
              <Tabs defaultValue="moduller" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="moduller">Modüller</TabsTrigger>
                  <TabsTrigger value="lisanslar">Lisanslar</TabsTrigger>
                </TabsList>
                <TabsContent value="moduller" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="modul_kodu"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-slate-700 font-medium">
                              Modül Kodu Default Değeri
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Modül Kodu"
                                className="bg-white border-slate-300 focus:border-blue-500 h-9"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="lisanslar" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="kullanici_sayisi"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-slate-700 font-medium">
                              Kullanıcı Sayısı Ön Tanım
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Kullanıcı Sayısı"
                                className="bg-white border-slate-300 focus:border-blue-500 h-9"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="is_demo_ayar"
                        render={({ field }) => (
                          <FormItem className="col-span-1 flex flex-col justify-end">
                            <FormLabel className="text-slate-700 font-medium">
                              Demo Olarak Başlat
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.value === "E"}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked ? "E" : "H");
                                  }}
                                />
                                <span className="text-sm text-slate-500">
                                  {field.value === "E" ? "Açık" : "Kapalı"}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="border-t mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 px-6 py-4 bg-gray-50">
                <Button
                  type="button"
                  onClick={() => form.reset()}
                  className="w-full sm:w-auto bg-red-800 hover:bg-red-700 text-white font-medium"
                  size="lg"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-600 text-white font-medium"
                  size="lg"
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
