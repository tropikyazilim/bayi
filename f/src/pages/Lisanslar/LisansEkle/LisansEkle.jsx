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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
  bayi_adi: z.string().min(1, "Bayi seçimi zorunludur"),
  musteri_adi: z.string().min(1, "Müşteri seçimi zorunludur"),
  paket_adi: z.string().min(1, "Paket seçimi zorunludur"),
  yetkili: z.string().min(1, "Yetkili gerekli"),
  kullanici_sayisi: z.coerce.number().min(1).max(100),
  lisans_suresi: z.coerce.number().min(0).max(365),
  is_demo: z.boolean(),
  items: z.array(z.string()).optional(),
  lisans_kodu: z.string().min(16).max(32).optional(),
});

function generateLicenseKey() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Son iki hane
  const day = String(now.getDate()).padStart(2, "0"); // 2 haneli gün
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 2 haneli ay
  const time = `${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes()
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`; // 6 haneli saat-dakika-saniye
  console.log(time);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${year}${day}${month}${randomPart}${time}`;
}

export default function LisansEkle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openBayi, setOpenBayi] = React.useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);
  const [openMusteri, setOpenMusteri] = React.useState(false);
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [openPaket, setOpenPaket] = React.useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [selectedPaketId, setSelectedPaketId] = useState(null);
  const [showLisansDialog, setShowLisansDialog] = useState(false);
  const [lastLisansKodu, setLastLisansKodu] = useState("");
  const [bayiSearch, setBayiSearch] = useState("");
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



  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bayi_adi: "",
      yetkili: "",
      musteri_adi: "",
      paket_adi: "",
      kullanici_sayisi: "", // eklendi
      lisans_suresi: 0, // eklendi
      is_demo: "", // eklendi
      items: [],
      lisans_kodu: undefined, // yeni alan, undefined yapıldı
    },
  });
  // Parametreler yüklendiğinde form alanlarını doldur
  useEffect(() => {
    if (parametersData && parametersData.length > 0) {
      // parametre idsine göre ilgili alanları doldur
      
      const lisansEkleAyarParam = parametersData.find(param => param.parametreid === 2);
      const lisansEkleAyarDemoParam = parametersData.find(param => param.parametreid === 3);
      if (lisansEkleAyarParam && lisansEkleAyarDemoParam) {
        form.setValue("kullanici_sayisi", lisansEkleAyarParam.deger);
        form.setValue("is_demo", lisansEkleAyarDemoParam.deger === "E" ? true : false);
        console.log("Kullanıcı sayısı alanı otomatik olarak dolduruldu:", lisansEkleAyarParam.deger);
      }
    }
  }, [parametersData, form]);



  //modülleri getirmek için useQuery kullanımı
  const {
    data: modulPaketDuzenleData,
    isLoading: modulPaketDuzenleLoading,
    error: modulPaketDuzenleError,
    refetch: modulPaketDuzenlerefetch,
  } = useQuery({
    queryKey: ["moduller"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/moduller");
        return response.data || [];
      } catch (error) {
        console.error("API Hatası:", error);
        throw error;
      }
    },
    // Başlangıçta verileri otomatik yükle
    enabled: true,
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnWindowFocus: false,
    // Ağ bağlantısı geri geldiğinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnReconnect: false,
  });

  // Seçilen paket ID'sine göre modülleri getiren fonksiyon
  const fetchPaketModules = (armut) => {
    setSelectedPaketId(armut);
  };

  // Seçilen paket ID'sine göre modülleri getiren sorgu
  const { data: paketModulleri, isLoading: paketModulleriLoading } = useQuery({
    queryKey: ["paketModulleri", selectedPaketId],
    queryFn: async () => {
      if (!selectedPaketId) return null;

      try {
        const response = await axios.get(
          `http://localhost:3002/api/paketler/${selectedPaketId}`
        );
        console.log("Paket modülleri yüklendi:", response.data);
        // API yanıtının yapısını kontrol et
        if (response.data && Array.isArray(response.data)) {
          console.log(
            "Paket modül verileri detayı:",
            response.data.length > 0
              ? {
                  paket_id: response.data[0].id,
                  paket_adi: response.data[0].paket_adi,
                  paket_modul: response.data[0].paket_modul,
                  paket_modul_type: typeof response.data[0].paket_modul,
                }
              : "Boş dizi"
          );
        }
        return response.data;
      } catch (error) {
        console.error("Paket modülleri yüklenirken hata oluştu:", error);
        toast.error("Paket modülleri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    enabled: !!selectedPaketId, // burada değişiklik!
    refetchOnWindowFocus: false,
  }); // Paket modülleri yüklendiğinde form alanlarını güncelle
  useEffect(() => {
    if (
      paketModulleri &&
      Array.isArray(paketModulleri) &&
      paketModulleri.length > 0 &&
      modulPaketDuzenleData
    ) {
      const paket = paketModulleri[0];

      // Eğer paket_modul bir string ise parse et
      let items = [];
      if (paket.paket_modul) {
        try {
          if (typeof paket.paket_modul === "string") {
            items = JSON.parse(paket.paket_modul);
          } else {
            items = paket.paket_modul;
          }
        } catch (e) {
          console.error("paket_modul parse edilemedi:", e);
        }
      }

      // Form alanlarını paket verileriyle doldur
      console.log("Paket modülleri yüklendi, değerler ayarlanıyor:", items);
      console.log("Mevcut form değerleri:", form.getValues());

      // Kontrol: Form değerleri ile mevcut modül adları uyumlu mu?
      if (modulPaketDuzenleData && modulPaketDuzenleData.length > 0) {
        console.log(
          "Mevcut modüller:",
          modulPaketDuzenleData.map((m) => m.modul_adi)
        );
        console.log("Seçilen paket modülleri:", items);

        // items dizisi içindeki her bir öğenin modulPaketDuzenleData içinde karşılığı var mı kontrol et
        const validItems = items.filter((item) =>
          modulPaketDuzenleData.some((modul) => modul.modul_adi === item)
        );

        if (validItems.length !== items.length) {
          console.warn(
            "Bazı modül adları sistemde bulunan modüllerle eşleşmiyor!"
          );
          console.log("Geçerli modüller:", validItems);
          // Sadece geçerli olanları kullan
          items = validItems;
        }
      }

      // Form alanlarını temizle ve sonra değerleri ayarla
      setTimeout(() => {
        form.setValue("items", items || []);
        console.log("Form değerleri güncellendi:", form.getValues());
      }, 0);
    }
  }, [paketModulleri, form, modulPaketDuzenleData]);

  // Bayileri getirmek için useQuery kullanımı
  const {
    data: bayiler = [],
    isFetching,
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

  // Müşterileri getirmek için useQuery kullanımı
  const {
    data: musteriler = [],
    isFetching: isFetchingMusteri,
    refetch: refetchMusteri,
  } = useQuery({
    queryKey: ["musteriler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/musteriler/unvan"
        );
        console.log("Müşteri verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Müşteri verileri alınamadı:", error);
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

  // paket adlarını getirmek için useQuery kullanımı
  const {
    data: paketler = [],
    isFetching: isFetchingPaketler,
    refetch: refetchPaketler,
  } = useQuery({
    queryKey: ["paketler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/paketler/paket_adi"
        );
        console.log("Paket verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Paket verileri alınamadı:", error);
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
        console.error(
          "Paket duzenle  verileri yüklenirken hata oluştu:",
          error
        );
        toast.error("Paket duzenle  verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  }); // Paket duzenle verisi geldiğinde formu doldur
  useEffect(() => {
    if (paketIdData && Array.isArray(paketIdData) && paketIdData.length > 0) {
      const paket = paketIdData[0];

      // Eğer paket_modul bir string ise parse et
      let items = [];
      if (paket.paket_modul) {
        try {
          if (typeof paket.paket_modul === "string") {
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
        items: items,
      };
      console.log("Form değerleri yükleniyor:", formValues);
      form.reset(formValues);
    }
  }, [paketIdData, form]);
  const createLisansEkleMutation = useMutation({
    mutationFn: (LisansData) => {
      return axios.post("http://localhost:3002/api/lisanslar", LisansData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();
      // Modüller listesini güncelle
      queryClient.invalidateQueries(["moduller"]);

      toast.success("Lisans başarıyla eklendi", {
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
          error.response?.data?.message || "Lisans eklenirken bir hata oluştu",
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
    const lisansKodu = generateLicenseKey();
    const aktif = true;
    const kilit = false;
    const newValues = { ...values, lisans_kodu: lisansKodu, aktif, kilit };
    setLastLisansKodu(lisansKodu);
    setSuccess(false);
    setError(null);
    createLisansEkleMutation.mutate(newValues, {
      onSuccess: () => {
        setShowLisansDialog(true);
      },
    });
  }
  // Bayi arama kutusu için filtreleme
  const filteredBayiler =
    bayiSearch.trim() === ""
      ? bayiler
      : bayiler.filter((bayi) =>
          bayi.unvan && bayi.unvan.toLowerCase().includes(bayiSearch.toLowerCase())
        );

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-start justify-center pt-0 pb-8">
      <div className="w-full mx-auto p-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white p-5 rounded-xl shadow-lg max-h-[calc(100vh-40px)] overflow-y-auto border border-gray-200"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                {error}
              </div>
            )}

            {/* Lisans Bilgileri Başlık */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 bg-green-100 rounded-lg px-4 md:px-6 py-3 mb-4 border-b border-gray-200 shadow-sm min-h-0 w-full">
              <span className="text-lg md:text-xl font-bold text-slate-700 ">
                LİSANS BİLGİLERİ
              </span>
              <span className="hidden md:inline h-8 w-0.5 bg-gray-500 mx-4 rounded-full" />
              <span className="text-slate-700 text-sm md:text-base font-medium mt-1 md:mt-0">
                Lisans oluşturmak için gerekli bilgileri giriniz.
              </span>
            </div>

            {/* Lisans Bilgileri Form Alanları */}
            <div className="w-full flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-end mt-1">
              {/* Bayi */}
              <div className="flex-1 min-w-[150px] max-w-full">
                <FormField
                  control={form.control}
                  name="bayi_adi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
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
                              size="default"
                              aria-expanded={openBayi}
                              className="w-full justify-between text-gray-700"
                            >
                              <span
                                className={
                                  field.value ? "" : "font-normal text-gray-400"
                                }
                              >
                                {field.value ? field.value : "Bayi Seçiniz..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0 border border-gray-400 rounded shadow-sm"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>                              <CommandInput
                                placeholder="Bayi ara..."
                                className="h-8"
                                value={bayiSearch}
                                onValueChange={(value) => {
                                  setBayiSearch(value);
                                }}
                              />
                              <CommandList className="max-h-[160px]">
                                {isFetching ? (
                                  <div className="py-2 text-center text-sm">
                                    Yükleniyor...
                                  </div>
                                ) : filteredBayiler.length === 0 ? (
                                  <CommandEmpty>Bayi bulunamadı.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredBayiler.map((bayi) => (                                      <CommandItem
                                        key={bayi.id}
                                        value={bayi.id.toString()}
                                        onSelect={() => {
                                          setSelectedBayi(bayi);
                                          field.onChange(bayi.unvan);
                                          setOpenBayi(false);
                                        }}
                                        className="text-sm font-medium text-gray-800"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            filteredBayiler.find((framework) => framework.unvan === field.value)?.unvan === bayi.unvan
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
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Müşteri Adı */}
              <div className="flex-1 min-w-[150px] max-w-full">
                <FormField
                  control={form.control}
                  name="musteri_adi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
                        Müşteri Adı
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openMusteri}
                          onOpenChange={(open) => {
                            setOpenMusteri(open);
                            if (open) refetchMusteri();
                          }}
                        >                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              size="default"
                              aria-expanded={openMusteri}
                              className="w-full justify-between text-gray-700"
                            >
                              <span
                                className={
                                  field.value ? "" : "font-normal text-gray-400"
                                }
                              >
                                {field.value
                                  ? field.value
                                  : "Müşteri Seçiniz..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0 border border-gray-400 rounded shadow-sm"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Müşteri ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[160px]">
                                {isFetchingMusteri ? (
                                  <div className="py-2 text-center text-sm">
                                    Yükleniyor...
                                  </div>
                                ) : musteriler.length === 0 ? (
                                  <CommandEmpty>
                                    Müşteri bulunamadı.
                                  </CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {musteriler.map((musteri) => (
                                      <CommandItem
                                        key={musteri.id}
                                        value={musteri.id.toString()}
                                        onSelect={() => {
                                          setSelectedMusteri(musteri);
                                          field.onChange(musteri.unvan);
                                          setOpenMusteri(false);
                                        }}
                                        className="text-sm font-medium text-gray-800"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === musteri.unvan
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {musteri.unvan}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Paket */}
              <div className="flex-1 min-w-[150px] max-w-full">
                <FormField
                  control={form.control}
                  name="paket_adi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
                        Paket
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openPaket}
                          onOpenChange={(open) => {
                            setOpenPaket(open);
                            if (open) refetchPaketler();
                          }}
                        >                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              size="default"
                              aria-expanded={openPaket}
                              className="w-full justify-between text-gray-700"
                            >
                              <span
                                className={
                                  field.value ? "" : "font-normal text-gray-400"
                                }
                              >
                                {field.value ? field.value : "Paket Seçiniz..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0 border border-gray-400 rounded shadow-sm"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Paket ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[160px]">
                                {isFetchingPaketler ? (
                                  <div className="py-2 text-center text-sm">
                                    Yükleniyor...
                                  </div>
                                ) : paketler.length === 0 ? (
                                  <CommandEmpty>Paket bulunamadı.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {paketler.map((paket) => (
                                      <CommandItem
                                        key={paket.id}
                                        value={paket.id.toString()}
                                        onSelect={() => {
                                          setSelectedPaket(paket);
                                          field.onChange(paket.paket_adi);
                                          setOpenPaket(false);
                                          fetchPaketModules(paket.id);
                                        }}
                                        className="text-sm font-medium text-gray-800"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === paket.paket_adi
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {paket.paket_adi}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
              </div>
               {/* Yetkili */}
              <div className="w-full sm:w-28 max-w-full">
                <FormField
                  control={form.control}
                  name="yetkili"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Yetkili
                      </FormLabel>{" "}
                      <FormControl>
                        <Select
                          className="w-[180px] max-h-60 overflow-auto"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          {...field}
                        >
                          <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200">
                            <SelectValue placeholder="Yetkili" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ömür">Ömür</SelectItem>
                            <SelectItem value="volkan">Volkan</SelectItem>
                            <SelectItem value="hazar">Hazar</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Kullanıcı Sayısı */}
              <div className="w-full sm:w-28 max-w-full">
                <FormField
                  control={form.control}
                  name="kullanici_sayisi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
                        Kullanıcı Sayısı
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          min={1}
                          max={100}
                          defaultValue={1}
                          className="bg-white border border-gray-400 rounded shadow-sm h-8 text-sm font-normal text-gray-800 placeholder:font-normal placeholder:text-gray-400 min-h-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Lisans Süresi */}
              <div className="w-full sm:w-28 max-w-full">
                <FormField
                  control={form.control}
                  name="lisans_suresi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
                        Lisans Süresi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Gün"
                          min={0}
                          max={365}
                          defaultValue={0}
                          value={field.value}
                          className="bg-white border border-gray-400 rounded shadow-sm h-8 text-sm font-normal text-gray-800 placeholder:font-normal placeholder:text-gray-400 min-h-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Demo */}
              <div className="w-full sm:w-20 flex flex-col justify-end max-w-full">
                <FormField
                  control={form.control}
                  name="is_demo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-semibold text-gray-700 mb-0.5 tracking-tight">
                        Demo
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-8 w-12 border border-gray-400 bg-white shadow-sm mt-0 min-h-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Modüller Başlık */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 bg-blue-400 rounded-lg px-4 md:px-6 py-3 mt-6 mb-4 border-b border-gray-200 shadow-sm min-h-0 w-full">
              <span className="text-lg md:text-xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                MODÜLLER
              </span>
              <span className="hidden md:inline h-8 w-0.5 bg-gray-500 mx-4 rounded-full" />
              <span className="text-white text-sm md:text-base font-medium mt-1 md:mt-0">
                Paket için kullanılabilir modülleri seçiniz.
              </span>
            </div>

            {/* Modüller Checkbox Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {(modulPaketDuzenleData || []).map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 pl-3 h-12 rounded bg-white border border-gray-300 shadow-sm min-w-0 w-full cursor-pointer hover:bg-gray-50 transition-colors min-h-0">
                      <FormControl>
                        <Checkbox
                          checked={(field.value || []).includes(item.modul_adi)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([
                                  ...(field.value || []),
                                  item.modul_adi,
                                ])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value) => value !== item.modul_adi
                                  )
                                );
                          }}
                          className="h-5 w-5 border-2 border-gray-400 bg-white shadow focus:ring-0 focus:ring-offset-0 hover:border-blue-500 min-h-0"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer select-none text-gray-800 ml-1 truncate h-12 w-full">
                        {item.modul_adi}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Butonlar */}
            <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-3 md:flex-row md:items-end mt-5">              <Button
                type="button"
                onClick={() => form.reset()}
                variant="secondary"
                size="lg"
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="default"
                size="lg"
              >
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
        {/* Lisans kodu gösteren dialog */}
        <Dialog open={showLisansDialog} onOpenChange={setShowLisansDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex flex-col items-center justify-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-2"
                >
                  <circle cx="12" cy="12" r="12" fill="#dcfce7" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <DialogTitle className="text-center text-2xl font-bold">
                  Lisans Numaranız:
                </DialogTitle>
                <div className="text-center text-2xl font-mono font-semibold mt-2 mb-4">
                  {lastLisansKodu}
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="mx-auto bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  setShowLisansDialog(false);
                  navigate("/lisansekle");
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
