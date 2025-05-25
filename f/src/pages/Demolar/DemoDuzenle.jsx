"use client";
import * as React from "react";
import { enUS, tr } from "date-fns/locale";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  firma_adi: z.string().min(1, "Firma adı gereklidir"),
  adsoyad: z.string().min(1, "Ad-Soyad gereklidir"),
  telefon: z
    .string()
    .regex(
      /^0[0-9]{10}$/,
      "Telefon 0 ile başlamalı ve toplam 11 haneli olmalıdır"
    ),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  il: z.string().min(1, "İl seçimi gereklidir"),
  aciklama: z.string().min(10, "En az 10 karakter giriniz"),
  secilen_tarih: z.date({
    required_error: "Lütfen bir tarih seçiniz",
    invalid_type_error: "Tarih seçiniz",
  }),
  son_gorusme_tarihi: z.string().optional(),
  ip: z.string().optional(),
  // Düzenleme sayfasında kvkk onayını zorunlu kılmıyoruz
  kvkk: z.boolean().optional(),
  durum: z.enum(["bekliyor", "gorusuldu", "reddedildi", "onaylandi"], {
    required_error: "Lütfen bir durum seçiniz",
  }),
  bayi: z.string().optional(),
  notlar: z.string().optional(),
});

const iller = [
  {
    value: "Adana",
    label: "Adana",
  },
  {
    value: "Adıyaman",
    label: "Adıyaman",
  },
  {
    value: "Afyonkarahisar",
    label: "Afyonkarahisar",
  },
  {
    value: "Ağrı",
    label: "Ağrı",
  },
  {
    value: "Amasya",
    label: "Amasya",
  },
  {
    value: "Ankara",
    label: "Ankara",
  },
  {
    value: "Antalya",
    label: "Antalya",
  },
  {
    value: "Artvin",
    label: "Artvin",
  },
  {
    value: "Aydın",
    label: "Aydın",
  },
  {
    value: "Balıkesir",
    label: "Balıkesir",
  },
  {
    value: "Bilecik",
    label: "Bilecik",
  },
  {
    value: "Bingöl",
    label: "Bingöl",
  },
  {
    value: "Bitlis",
    label: "Bitlis",
  },
  {
    value: "Bolu",
    label: "Bolu",
  },
  {
    value: "Burdur",
    label: "Burdur",
  },
  {
    value: "Bursa",
    label: "Bursa",
  },
  {
    value: "Çanakkale",
    label: "Çanakkale",
  },
  {
    value: "Çankırı",
    label: "Çankırı",
  },
  {
    value: "Çorum",
    label: "Çorum",
  },
  {
    value: "Denizli",
    label: "Denizli",
  },
  {
    value: "Diyarbakır",
    label: "Diyarbakır",
  },
  {
    value: "Edirne",
    label: "Edirne",
  },
  {
    value: "Elazığ",
    label: "Elazığ",
  },
  {
    value: "Erzincan",
    label: "Erzincan",
  },
  {
    value: "Erzurum",
    label: "Erzurum",
  },
  {
    value: "Eskişehir",
    label: "Eskişehir",
  },
  {
    value: "Gaziantep",
    label: "Gaziantep",
  },
  {
    value: "Giresun",
    label: "Giresun",
  },
  {
    value: "Gümüşhane",
    label: "Gümüşhane",
  },
  {
    value: "Hakkari",
    label: "Hakkari",
  },
  {
    value: "Hatay",
    label: "Hatay",
  },
  {
    value: "Isparta",
    label: "Isparta",
  },
  {
    value: "Mersin",
    label: "Mersin",
  },
  {
    value: "İstanbul",
    label: "İstanbul",
  },
  {
    value: "İzmir",
    label: "İzmir",
  },
  {
    value: "Kars",
    label: "Kars",
  },
  {
    value: "Kastamonu",
    label: "Kastamonu",
  },
  {
    value: "Kayseri",
    label: "Kayseri",
  },
  {
    value: "Kırklareli",
    label: "Kırklareli",
  },
  {
    value: "Kırşehir",
    label: "Kırşehir",
  },
  {
    value: "Kocaeli",
    label: "Kocaeli",
  },
  {
    value: "Konya",
    label: "Konya",
  },
  {
    value: "Kütahya",
    label: "Kütahya",
  },
  {
    value: "Malatya",
    label: "Malatya",
  },
  {
    value: "Manisa",
    label: "Manisa",
  },
  {
    value: "Kahramanmaraş",
    label: "Kahramanmaraş",
  },
  {
    value: "Mardin",
    label: "Mardin",
  },
  {
    value: "Muğla",
    label: "Muğla",
  },
  {
    value: "Muş",
    label: "Muş",
  },
  {
    value: "Nevşehir",
    label: "Nevşehir",
  },
  {
    value: "Niğde",
    label: "Niğde",
  },
  {
    value: "Ordu",
    label: "Ordu",
  },
  {
    value: "Rize",
    label: "Rize",
  },
  {
    value: "Sakarya",
    label: "Sakarya",
  },
  {
    value: "Samsun",
    label: "Samsun",
  },
  {
    value: "Siirt",
    label: "Siirt",
  },
  {
    value: "Sinop",
    label: "Sinop",
  },
  {
    value: "Sivas",
    label: "Sivas",
  },
  {
    value: "Tekirdağ",
    label: "Tekirdağ",
  },
  {
    value: "Tokat",
    label: "Tokat",
  },
  {
    value: "Trabzon",
    label: "Trabzon",
  },
  {
    value: "Tunceli",
    label: "Tunceli",
  },
  {
    value: "Şanlıurfa",
    label: "Şanlıurfa",
  },
  {
    value: "Uşak",
    label: "Uşak",
  },
  {
    value: "Van",
    label: "Van",
  },
  {
    value: "Yozgat",
    label: "Yozgat",
  },
  {
    value: "Zonguldak",
    label: "Zonguldak",
  },
  {
    value: "Aksaray",
    label: "Aksaray",
  },
  {
    value: "Bayburt",
    label: "Bayburt",
  },
  {
    value: "Karaman",
    label: "Karaman",
  },
  {
    value: "Kırıkkale",
    label: "Kırıkkale",
  },
  {
    value: "Batman",
    label: "Batman",
  },
  {
    value: "Şırnak",
    label: "Şırnak",
  },
  {
    value: "Bartın",
    label: "Bartın",
  },
  {
    value: "Ardahan",
    label: "Ardahan",
  },
  {
    value: "Iğdır",
    label: "Iğdır",
  },
  {
    value: "Yalova",
    label: "Yalova",
  },
  {
    value: "Karabük",
    label: "Karabük",
  },
  {
    value: "Kilis",
    label: "Kilis",
  },
  {
    value: "Osmaniye",
    label: "Osmaniye",
  },
  {
    value: "Düzce",
    label: "Düzce",
  },
];

export default function DemoDuzenle() {
  const { id } = useParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openIller, setOpenIller] = React.useState(false);
  const queryClient = useQueryClient();
  const [selectedIl, setSelectedIl] = useState(null);
  const [date, setDate] = useState(null);
  const [openBayi, setOpenBayi] = React.useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);
  const [bayiSearch, setBayiSearch] = useState("");
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firma_adi: "",
      adsoyad: "",
      telefon: "",
      email: "",
      il: "",
      aciklama: "",
      ip: "",
      secilen_tarih: "",
      kvkk: true,
      durum: "",
      bayi: "",
      notlar: "",
    },
  });
  // Bayileri getirmek için useQuery kullanımı
  const {
    data: bayiler = [],
    isFetching: isFetchingBayi,
    refetch: refetchBayiler,
  } = useQuery({
    queryKey: ["bayiler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/bayiler/unvan"
        );
        console.log("Bayiler verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Bayiler verileri alınamadı:", error);
        return [];
      }
    },
    // Başlangıçta otomatik çalışmasını engelliyoruz
    enabled: false,
    // Önbellek süresini uzun tutuyoruz
    staleTime: 5 * 60 * 1000, // 5 dakika - bu süre içinde veri "taze" kabul edilir
    gcTime: 10 * 60 * 1000, // 10 dakika
    // Hata durumunda yeniden deneme sayısını sınırlıyoruz
    retry: 3,
  });

  // Demo verisini çekme
  const {
    data: DemoData,
    isFetching,
    refetch: refetchDemoDuzenle,
  } = useQuery({
    queryKey: ["demoduzenle", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/demolar/${id}`
        );
        console.log("Demo verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("Demo verileri yüklenirken hata oluştu:", error);
        toast.error("Demo verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  });
  useEffect(() => {
    if (DemoData) {
      const demolar = Array.isArray(DemoData) ? DemoData[0] : DemoData;
      if (demolar) {
        console.log("Yüklenen demo verileri:", demolar);
        const formValues = {
          firma_adi: demolar.firma_adi || "",
          adsoyad: demolar.adsoyad || "",
          telefon: demolar.telefon || "",
          email: demolar.email || "",
          il: demolar.il || "",
          aciklama: demolar.aciklama || "",
          ip: demolar.ip || "",
          son_gorusme_tarihi: demolar.son_gorusme_tarihi || "",
          secilen_tarih: demolar.secilen_tarih || "",
          durum: demolar.durum || "",
          bayi: demolar.bayi || "",
          notlar: demolar.notlar || "",
        };
        form.reset(formValues);

        // Eğer bir secilen_tarih varsa, date state'ini güncelle
        if (demolar.secilen_tarih) {
          try {
            setDate(new Date(demolar.secilen_tarih));
          } catch (error) {
            console.error("Tarih dönüştürme hatası:", error);
          }
        }
      }
    }
  }, [DemoData, form]);  const handleDemoDuzenleMutation = useMutation({
    mutationFn: (DemoDuzenleData) => {
      if (id) {
        // Güncelleme işlemi
        return axios.put(
          `http://localhost:3002/api/demolar/${id}`,
          DemoDuzenleData
        );
      } else {
        // Yeni kayıt işlemi
        return axios.post(`http://localhost:3002/api/demolar`, DemoDuzenleData);
      }
    },
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);
      
      // Veri önbelleğini güncelle
      queryClient.invalidateQueries(["demoduzenle", id]);
      queryClient.invalidateQueries(["demolistesi"]);

      if (id) {
        toast.success("Demo başarıyla güncellendi", {
          description: "Değişiklikler kaydedildi",
          style: {
            backgroundColor: "#ecfdf5",
            border: "1px solid #6ee7b7",
            color: "#065f46",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }
        });
      } else {
        form.reset();
        toast.success("Demo başarıyla eklendi", {
          description: "İşlem başarıyla tamamlandı",
          style: {
            backgroundColor: "#ecfdf5",
            border: "1px solid #6ee7b7",
            color: "#065f46",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }
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
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        },
      });
      setSuccess(false);
      setError(error.response?.data?.message || `Müşteri ${operation} bir hata oluştu`);
    },
  });function onSubmit(values) {
    // Form verileri ve hataları konsola yazdır - sorun giderme için
    console.log("Form başarıyla gönderildi!");
    console.log("Form Verileri:", values);
    console.log("Form hataları:", form.formState.errors);

    // Seçilen tarihi ekle (date state'inden)
    if (date) {
      values.secilen_tarih = format(date, "yyyy-MM-dd");
    }

    // Demo verilerini güncelle
    handleDemoDuzenleMutation.mutate(values, {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        
        // Başarılı bildirim göster
        toast.success(id ? "Demo başarıyla güncellendi" : "Form başarıyla gönderildi", {
          description: id ? "Değişiklikler kaydedildi" : "Form kaydedildi",
          style: {
            backgroundColor: "#ecfdf5",
            border: "1px solid #6ee7b7",
            color: "#065f46",
            borderRadius: "0.5rem",
            fontSize: "0.875rem"
          }
        });
        
        // Yönlendirme yap
        navigate("/demolistesi/");
      }
    });
  }

  // Bayi arama kutusu için filtreleme
  const filteredBayiler =
    bayiSearch.trim() === ""
      ? bayiler
      : bayiler.filter(
          (bayi) =>
            bayi.unvan &&
            bayi.unvan.toLowerCase().includes(bayiSearch.toLowerCase())
        );  return (
    <>
      <div className="h-full w-full bg-gray-50 py-6">
        <div className="h-full w-full px-4 py-2 max-w-6xl mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-8 rounded-xl shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto border border-gray-100 animate-fadeIn"
              style={{ animationDuration: "0.3s" }}
            >{success && !error && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 text-sm flex items-center space-x-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Form başarıyla kaydedildi.</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm flex items-center space-x-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Demo Talebi Düzenle
                </h2>
                <div className="h-1.5 w-32 bg-teal-500 rounded-full"></div>
              </div>
              <div className="space-y-6">                {/* İlk sıra */}                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firma_adi"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          Firma Adı
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1H7z" clipRule="evenodd" />
                            </svg>
                            <Input
                              type="text"
                              placeholder="Firma Adı"
                              className="bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10 text-sm rounded-lg transition-all pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adsoyad"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          Ad-Soyad
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <Input
                              type="text"
                              placeholder="Ad-Soyad"
                              className="bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10 text-sm rounded-lg transition-all pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>                {/* İkinci sıra */}                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="telefon"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          Telefon
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="0_________"
                              className="bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10 text-sm rounded-lg transition-all pl-10"
                              value={field.value}
                              onChange={(e) => {
                                let value = e.target.value;

                                // Sadece rakam girilebilmesini sağla
                                value = value.replace(/[^0-9]/g, "");

                                // 0 ile başlamasını zorla
                                if (!value.startsWith("0")) {
                                  value =
                                    "0" +
                                    value.substring(
                                      value.startsWith("0") ? 1 : 0
                                    );
                                }

                                // Maksimum 11 karakter (başındaki 0 dahil)
                                value = value.substring(0, 11);

                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="E-mail adresiniz"
                              className="bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10 text-sm rounded-lg transition-all pl-10"
                              {...field}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>                {/* İl seçimi */}                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="il"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          İl
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={openIller}
                            onOpenChange={(open) => {
                              setOpenIller(open);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openIller}
                                className="w-full justify-between text-left text-gray-700 h-10 text-sm border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all pl-10 hover:bg-gray-50"
                              >
                                {field.value
                                  ? iller.find((il) => il.value === field.value)
                                      ?.label
                                  : "İl Seçiniz..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0 border border-gray-200 shadow-lg rounded-lg"
                              align="start"
                              sideOffset={4}
                            >
                              <Command>
                                <CommandInput
                                  placeholder="İl ara..."
                                  className="h-10 border-0"
                                />
                                <CommandList className="max-h-[300px]">
                                  <CommandEmpty>İl bulunamadı.</CommandEmpty>
                                  <CommandGroup className="p-1.5">
                                    {iller.map((il) => (
                                      <CommandItem
                                        key={il.value}
                                        value={il.value}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);
                                          setOpenIller(false);
                                          setSelectedIl(currentValue);
                                        }}
                                        className="text-sm rounded-md cursor-pointer hover:bg-teal-50 aria-selected:bg-teal-50 aria-selected:text-teal-600 py-2"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 text-teal-500",
                                            field.value === il.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {il.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>{/* Açıklama */}                <FormField
                  control={form.control}
                  name="aciklama"
                  render={({ field }) => (
                    <FormItem className="space-y-2">                      <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                        Açıklama
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="İhtiyaçlarınızı detaylı açıklayınız"
                            className="min-h-[120px] bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm rounded-lg transition-all resize-none pl-10 pt-3"
                            {...field}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                {/* IP ve Son Görüşme Tarihi - 2 sütunlu */}                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ip"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 font-semibold text-sm block">
                          IP
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              disabled
                              className="bg-gray-50 border-gray-200 h-10 text-sm rounded-lg transition-all pl-10 text-gray-500"
                              {...field}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="son_gorusme_tarihi"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 font-semibold text-sm block">
                          Son Görüşme Tarihi
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              className="bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10 text-sm rounded-lg transition-all pl-10"
                              {...field}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>                <FormField
                  control={form.control}
                  name="secilen_tarih"
                  render={({ field }) => (
                    <FormItem className="space-y-2">                      <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                        Tarih Seçiniz
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal h-10 border-gray-200 bg-white hover:bg-gray-50 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all pl-10",
                                !date && "text-gray-500"
                              )}
                            >
                              <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              {date ? (
                                format(date, "PPP", {
                                  locale: tr,
                                })
                              ) : (
                                <span>Bir tarih seçin</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              locale={tr}
                              formats={{
                                day: "dd",
                                month: "MM",
                                year: "yyyy",
                              }}
                              onSelect={(currentValue) => {
                                field.onChange(currentValue);
                                setDate(currentValue);
                              }}
                              initialFocus
                              className="rounded-lg border-gray-200"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="durum"
                    render={({ field }) => (
                      <FormItem className="space-y-2">                        <FormLabel className="text-gray-700 font-semibold text-sm flex items-center">
                          Durum
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 rounded-lg bg-white transition-all pl-10">
                                <SelectValue placeholder="Bir durum seçiniz" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                                <SelectGroup>
                                  <SelectItem value="bekliyor" className="focus:bg-teal-50 focus:text-teal-600 transition-colors duration-150">
                                    <div className="flex items-center">
                                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2 flex-shrink-0"></div>
                                      Bekliyor
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="gorusuldu" className="focus:bg-teal-50 focus:text-teal-600 transition-colors duration-150">
                                    <div className="flex items-center">
                                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-2 flex-shrink-0"></div>
                                      Görüşüldü
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="reddedildi" className="focus:bg-teal-50 focus:text-teal-600 transition-colors duration-150">
                                    <div className="flex items-center">
                                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 mr-2 flex-shrink-0"></div>
                                      Reddedildi
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="onaylandi" className="focus:bg-teal-50 focus:text-teal-600 transition-colors duration-150">
                                    <div className="flex items-center">
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 mr-2 flex-shrink-0"></div>
                                      Onaylandı
                                    </div>
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="bayi"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 font-semibold text-sm block">
                          Bayi
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={openBayi}
                            onOpenChange={(open) => {
                              setOpenBayi(open);
                              if (open) refetchBayiler();
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openBayi}
                                className="w-full justify-between text-left h-10 bg-white border-gray-200 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 rounded-lg transition-all text-sm font-normal pl-10 hover:bg-gray-50"
                              >
                                <span
                                  className={
                                    field.value ? "text-gray-800" : "text-gray-500"
                                  }
                                >
                                  {field.value ? field.value : "Bayi Seçiniz..."}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0 border border-gray-200 shadow-lg rounded-lg"
                              align="start"
                              sideOffset={4}
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Bayi ara..."
                                  className="h-10 border-0"
                                  value={bayiSearch}
                                  onValueChange={(value) => {
                                    setBayiSearch(value);
                                  }}
                                />
                                <CommandList className="max-h-[240px]">
                                  {isFetching ? (
                                    <div className="py-6 text-center text-sm flex items-center justify-center space-x-2">
                                      <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>Yükleniyor...</span>
                                    </div>
                                  ) : filteredBayiler.length === 0 ? (
                                    <CommandEmpty className="py-4 text-center text-gray-500">Bayi bulunamadı.</CommandEmpty>
                                  ) : (
                                    <CommandGroup className="p-1.5">
                                      {filteredBayiler.map((bayi) => (
                                        <CommandItem
                                          key={bayi.id}
                                          value={bayi.id.toString()}
                                          onSelect={() => {
                                            setSelectedBayi(bayi);
                                            field.onChange(bayi.unvan);
                                            setOpenBayi(false);
                                          }}
                                          className="text-sm rounded-md cursor-pointer hover:bg-teal-50 aria-selected:bg-teal-50 aria-selected:text-teal-600 py-2 transition-colors duration-150"
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 text-teal-500",
                                              filteredBayiler.find(
                                                (framework) =>
                                                  framework.unvan === field.value
                                              )?.unvan === bayi.unvan
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {bayi.unvan}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>                <FormField
                  control={form.control}
                  name="notlar"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-semibold text-sm block">
                        Notlar
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Müşteri ile ilgili notlarınızı buraya yazabilirsiniz."
                            className="min-h-[120px] bg-white border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm rounded-lg transition-all resize-none pl-10 pt-3"
                            {...field}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                  {/* Butonlar */}
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      navigate("/demolistesi/");
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
                    disabled={handleDemoDuzenleMutation.isPending}
                    className="bg-teal-500 hover:bg-teal-600 text-white h-11 text-sm rounded-lg px-6 font-medium transition-all shadow-sm flex items-center relative"
                  >
                    {handleDemoDuzenleMutation.isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </div>{" "}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
