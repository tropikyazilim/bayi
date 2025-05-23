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

const bayiTipi = [
  {
    value: "Ana Bayi",
    label: "Ana Bayi",
  },
  {
    value: "Bayi",
    label: "Bayi",
  },
  {
    value: "Çözüm Ortağı",
    label: "Çözüm Ortağı",
  },
  {
    value: "Bayi Adayı",
    label: "Bayi Adayı",
  },
];

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

const formSchema = z.object({
  bayi_kodu: z.union([
    z.string().length(12, "Bayi Kodu tam olarak 10 karakter olmalıdır"),
    z.number(),
  ]),
  bayi_sifre: z.string().min(6, "Bayi Şifre en az 6 karakter olmalıdır"),
  unvan: z.string().min(1, "Ünvan gerekli"),
  firma_sahibi: z.string().min(1, "Firma Sahibi gerekli"),
  bayi_tipi: z.string().min(1, "Bayi Tipi gerekli"),
 
  il: z.string().min(1, "İl gerekli"),
  ilce: z.string().min(1, "İlçe gerekli"),
  adres: z.string().min(1, "Adres gerekli"),
  eposta: z.string().email("Geçersiz e-posta adresi"),
  telefon: z.string().length(10, "Telefon gerekli"),
  cep_telefon: z.string().length(10, "Cep Telefonu gerekli"),
  sorumlu_kisi: z.string().min(1, "Sorumlu Kişi gerekli"),
  ust_bayi: z.string().optional(), // İsteğe bağlı alan olarak güncellendi
});

export default function BayiDuzenle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openBayiTipi, setOpenBayiTipi] = React.useState(false);
  const [openIller, setOpenIller] = React.useState(false);
  const [openIlceler, setOpenIlceler] = React.useState(false); // İlçeler için state
  const [openUstBayi, setOpenUstBayi] = React.useState(false); // Üst bayi için state
  const [selectedIl, setSelectedIl] = React.useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);
  const [ilceler, setIlceler] = useState([]); // İlçeleri tutmak için state
  const [citiesData, setCitiesData] = useState(null); // Tüm şehir verilerini tutmak için state

  // QueryClient oluştur
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bayi_kodu: "",
      bayi_sifre: "",
      unvan: "",
      firma_sahibi: "",
      bayi_tipi: "",
      il: "",
      ilce: "",
      adres: "",
      eposta: "",
      telefon: "",
      cep_telefon: "",
      sorumlu_kisi: "",
      ust_bayi: "",
    },
  });

  // Cities verilerini getirmek için useQuery kullanımı
  const {
    data: citiesResult,
    isLoading: citiesLoading,
    isError: citiesError,
    refetch: refetchCities,
  } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/cities");
        console.log("İl ve ilçe verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("İl ve ilçe verileri yüklenirken hata oluştu:", error);
        toast.error("İl ve ilçe verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    enabled: false,
    // Önbellek süresini uzun tutuyoruz
    staleTime: 24 * 60 * 60 * 1000, // 24 saat - bu süre içinde veri "taze" kabul edilir
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 gün
    // Hata durumunda yeniden deneme sayısını sınırlıyoruz
    retry: 3,
  });

  // Cities data değiştiğinde citiesData state'ini güncelle
  useEffect(() => {
    if (citiesResult) {
      setCitiesData(citiesResult);
    }
  }, [citiesResult]);

  // Bayileri getirmek için useQuery kullanımı
  const {
    data: bayilerData,
    isFetching,
    refetch: refetchBayiDuzenle,
  } = useQuery({
    queryKey: ["bayiduzenle", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/bayiler/${id}`
        );
        console.log("Bayi verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("Bayi verileri yüklenirken hata oluştu:", error);
        toast.error("Bayi verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  }); // Bayi verisi geldiğinde formu doldur
  useEffect(() => {
    if (bayilerData && Array.isArray(bayilerData) && bayilerData.length > 0) {
      const bayiler = bayilerData[0];
      console.log("Müşteri il/ilçe bilgisi:", bayiler.il, bayiler.ilce);
      console.log("Müşteri sorumlu_kisi bilgisi:", bayiler.sorumlu_kisi);
      console.log("Tüm bayi verileri:", bayiler); // Form alanlarını müşteri verileriyle doldur
      const formValues = {
        bayi_kodu: bayiler.bayi_kodu || "",
        bayi_sifre: bayiler.bayi_sifre || "",
        unvan: bayiler.unvan || "",
        firma_sahibi: bayiler.firma_sahibi || "",
        bayi_tipi: bayiler.bayi_tipi || "",
        il: bayiler.il || "",
        ilce: bayiler.ilce || "",
        adres: bayiler.adres || "",
        eposta: bayiler.eposta || "",
        telefon: bayiler.telefon || "",
        cep_telefon: bayiler.cep_telefon || "",
        sorumlu_kisi: bayiler.sorumlu_kisi || "",
        ust_bayi: bayiler.ust_bayi || "",
      };

      console.log("Form değerleri yükleniyor:", formValues);
      form.reset(formValues);

      // İl bilgisini state'e kaydet
      if (bayiler.il) {
        setSelectedIl(bayiler.il);
      }

      console.log("Form müşteri verileriyle dolduruldu");
      setIsLoading(false);
    }
  }, [bayilerData, form]);
  // İl bilgisi değiştiğinde ilçe verilerini yükle
  useEffect(() => {
    if (selectedIl && refetchCities) {
      refetchCities();
    }

    // Debug form values
    const currentValues = form.getValues();
    console.log("Current form values:", currentValues);
    console.log("Current sorumlu_kisi value:", currentValues.sorumlu_kisi);
  }, [selectedIl, refetchCities, form]);

  // useEffect ile selectedIl değiştiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedIl && citiesData && citiesData.cities) {
      const districts = citiesData.cities[selectedIl] || [];
      const formattedDistricts = districts.map((district) => ({
        value: district,
        label: district,
      }));

      setIlceler(formattedDistricts);

      // Müşteri verilerinden alınan ilçe değerini kontrol et
      const currentIlce = form.getValues("ilce");

      // İlçe kontrolü: Müşteri verilerinden gelen ilçe değeri mevcut ilçe listesinde var mı?
      if (currentIlce) {
        const ilceExists = districts.some(
          (district) => district === currentIlce
        );

        if (!ilceExists) {
          // İlçe listesinde yoksa, ilçe değerini temizle
          form.setValue("ilce", "");
          console.log(
            "İlçe değeri sıfırlandı çünkü seçilen il için mevcut değil:",
            currentIlce
          );
        } else {
          console.log("Mevcut ilçe korundu:", currentIlce);
        }
      }

      console.log(`${selectedIl} için ilçeler yüklendi:`, formattedDistricts);
    }
  }, [selectedIl, citiesData, form]);

  // Veritabanından gelen sorumlu_kisi değerini formda ayarla
  useEffect(() => {
    if (bayilerData && bayilerData.sorumlu_kisi) {
      form.setValue("sorumlu_kisi", bayilerData.sorumlu_kisi); // API'den gelen sorumlu_kisi değerini ayarla
    }
  }, [form, bayilerData]);

  // ID değerini kontrol etmek için log ekliyorum
  console.log("Gelen ID:", id);

  const handleBayiMutation = useMutation({
    mutationFn: (bayilerData) => {
      if (id) {
        // Güncelleme işlemi
        return axios.put(
          `http://localhost:3002/api/bayiler/${id}`,
          bayilerData
        );
      } else {
        // Yeni kayıt işlemi
        return axios.post("http://localhost:3002/api/bayiler", bayilerData);
      }
    },
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);

      if (id) {
        toast.success("Müşteri başarıyla güncellendi", {
          description: "Değişiklikler kaydedildi",
          style: {
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
          },
        });

  
      } else {
        form.reset();
        toast.success("Müşteri başarıyla eklendi", {
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
      handleBayiMutation.mutate(values);
      form.reset();
      navigate("/bayilistesi/");
      
    } else {
      console.error("Geçersiz ID, form submit işlemi iptal edildi.");
      toast.error("Güncelleme hatası", {
        description: "Bayi ID'si bulunamadı, lütfen sayfayı yenileyin veya bayi listesine geri dönün.",
      });
    }
  }

  return (
    <>
      <div className="h-full w-full ">
        <div className="h-full w-full p-1 ">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Formun otomatik gönderilmesini engelle
                form.handleSubmit(onSubmit)(e);
              }}
              className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300  "
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
                {/* İlk Satır */}
                <FormField
                  control={form.control}
                  name="unvan"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Ticari Ünvan
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          readOnly
                          placeholder="Ticari Ünvan"
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
                  name="bayi_kodu"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Bayi Kodu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          readOnly
                          placeholder="Bayi Kodu"
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
                  name="bayi_sifre"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m ">
                        Şifre
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          readOnly
                          placeholder="Şifre"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* İkinci Satır */}
                <FormField
                  control={form.control}
                  name="sorumlu_kisi"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      {" "}
                      <FormLabel className="text-slate-700 font-medium text-m">
                        sorumlu_kisi
                      </FormLabel>{" "}
                      <FormControl>
                        <Select
                          className="w-[180px] max-h-60 overflow-auto"
                          onValueChange={field.onChange}
                          value={FormData.sorumlu_kisi || ""}
                        >
                          <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200">
                            <SelectValue placeholder="sorumlu_kisi" />
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

                <FormField
                  control={form.control}
                  name="bayi_tipi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Bayi Tipi
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openBayiTipi}
                          onOpenChange={setOpenBayiTipi}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBayiTipi}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value
                                ? bayiTipi.find(
                                    (bayi) => bayi.value === field.value
                                  )?.label
                                : "Bayi Tipi Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Bayi Tipi ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                <CommandEmpty>
                                  Bayi Tipi bulunamadı.
                                </CommandEmpty>
                                <CommandGroup>
                                  {bayiTipi.map((bayi) => (
                                    <CommandItem
                                      key={bayi.value}
                                      value={bayi.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setOpenBayiTipi(false);
                                      }}
                                      className="text-m"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          field.value === bayi.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {bayi.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firma_sahibi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Firma Sahibi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Firma Sahibi"
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
                  name="telefon"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Telefon
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Telefon Giriniz (Başında 0 Olmadan)"
                          maxLength={10}
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
                  name="cep_telefon"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Cep Telefonu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cep Telefonu Giriniz (Başında 0 Olmadan)"
                          maxLength={10}
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
                  name="eposta"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        E-Posta
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="e-mail"
                          placeholder="E-Posta Giriniz"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Üçüncü Satır */}
                <FormField
                  control={form.control}
                  name="il"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        İl
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openIller}
                          onOpenChange={(open) => {
                            setOpenIller(open);
                            if (open) {
                              refetchCities(); // Cities verisini yeniden yükle
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openIller}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value
                                ? iller.find((il) => il.value === field.value)
                                    ?.label
                                : "İl Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="İl ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                <CommandEmpty>İl bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {iller.map((il) => (
                                    <CommandItem
                                      key={il.value}
                                      value={il.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setOpenIller(false);
                                        setSelectedIl(currentValue);
                                      }}
                                      className="text-m"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
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
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ilce"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        İlçe
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openIlceler}
                          onOpenChange={setOpenIlceler}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openIlceler}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                              disabled={!selectedIl} // İl seçilmemişse disable et
                            >
                              {field.value
                                ? field.value
                                : selectedIl
                                ? "İlçe Seçiniz..."
                                : "Önce İl Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="İlçe ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                <CommandEmpty>İlçe bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {ilceler.map((ilce) => (
                                    <CommandItem
                                      key={ilce.value}
                                      value={ilce.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setOpenIlceler(false);
                                      }}
                                      className="text-m"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          field.value === ilce.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {ilce.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ust_bayi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Üst Bayi
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openUstBayi}
                          onOpenChange={(open) => {
                            setOpenUstBayi(open);
                            if (open) {
                              refetchBayiDuzenle();
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openUstBayi}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value
                                ? field.value
                                : "Üst Bayi Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Bayi ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                {isFetching ? (
                                  <div className="py-3 text-center text-m">
                                    Yükleniyor...
                                  </div>
                                ) : !bayilerData || bayilerData.length === 0 ? (
                                  <CommandEmpty>Bayi bulunamadı.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {bayilerData.map((bayi) => (
                                      <CommandItem
                                        key={bayi.id}
                                        value={bayi.id.toString()}
                                        onSelect={() => {
                                          setSelectedBayi(bayi);
                                          field.onChange(bayi.unvan);
                                          setOpenUstBayi(false);
                                        }}
                                        className="text-m"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-3 w-3",
                                            field.value === bayi.unvan
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
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Adres ve Butonlar */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4  mr-5"> */}
              <FormField
                control={form.control}
                name="adres"
                render={({ field }) => (
                  <FormItem className="space-y-1 md:col-span-2 mt-10">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Adres
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adres"
                        className="min-h-16 bg-white border-slate-300 focus:border-blue-500 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-end mt-5">                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                    navigate("/bayilistesi/");
                  }}
                  variant="destructive"
                  size="lg"
                >
                  İptal
                </Button>

                <Button
                  type="submit"
                  disabled={handleBayiMutation.isPending}
                  variant="info"
                  size="lg"
                >
                  {handleBayiMutation.isPending
                    ? "Gönderiliyor..."
                    : "GÜNCELLE"}
                </Button>
              </div>
              {/* </div> */}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
