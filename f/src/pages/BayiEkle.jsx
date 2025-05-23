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
const yetkililer = [
  {
    value: "Ömür Genç",
    label: "Ömür Genç",
  },
  {
    value: "Volkan Kök",
    label: "Volkan Kök",
  },
  {
    value: "Hazar Kumaş",
    label: "Hazar Kumaş",
  },
];
const formSchema = z.object({
  bayi_kodu: z.union([
    z.string().length(12, "Bayi Kodu tam olarak 10 karakter olmalıdır"),
    z.number()
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

export default function BayiEkle() {
  const [openYetkililer, setOpenYetkililer] = React.useState(false);
  const [openBayiTipi, setOpenBayiTipi] = React.useState(false);
  const [openIller, setOpenIller] = React.useState(false);
  const [openUstBayi, setOpenUstBayi] = React.useState(false); // Üst bayi için state
  const [selectedIl, setSelectedIl] = React.useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);

  // QueryClient oluştur
  const queryClient = useQueryClient();

  // Bayileri getirmek için useQuery kullanımı
  const {
    data: bayiler = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["bayiler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/bayiler/unvan"
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

  const createBayiMutation = useMutation({
    mutationFn: (bayiData) => {
      return axios.post("http://localhost:3001/api/bayiler", bayiData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();
      toast.success("Bayi başarıyla eklendi", {
        description: "İşlem başarıyla tamamlandı",
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
      // Bayiler listesini güncelle
      queryClient.invalidateQueries({ queryKey: ["bayiler"] });
    },
    onError: (error) => {
      toast.error("Hata", {
        description:
          error.response?.data?.message || "Bayi eklenirken bir hata oluştu",
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

    // Form doğrulaması sırasında hataları konsola yazdır
    console.log("Form hataları:", form.formState.errors);

    // API'ye form verilerini gönder
    setSuccess(false);
    setError(null);
    createBayiMutation.mutate(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-4 rounded-lg shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto shadow-blue-900"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
            {/* İlk Satır */}
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
              name="unvan"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Ticari Ünvan
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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
                <FormItem className="space-y-1 mt-7">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Yetkili
                  </FormLabel>
                  <FormControl>
                    <Popover
                      open={openYetkililer}
                      onOpenChange={setOpenYetkililer}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openYetkililer}
                          className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-sm font-normal shadow-sm shadow-blue-200"
                        >
                          {field.value
                            ? yetkililer.find(
                                (yetkili) => yetkili.value === field.value
                              )?.label
                            : "Yetkili Seçiniz..."}
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
                            placeholder="Yetkili ara..."
                            className="h-8"
                          />
                          <CommandList className="max-h-[200px]">
                            <CommandEmpty>Yetkili bulunamadı</CommandEmpty>
                            <CommandGroup>
                              {yetkililer.map((yetkili) => (
                                <CommandItem
                                  key={yetkili.value}
                                  value={yetkili.value}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    setOpenYetkililer(false);
                                  }}
                                  className="text-m"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-3 w-3",
                                      field.value === yetkili.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {yetkili.label}
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
              name="bayi_tipi"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-7">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Bayi Tipi
                  </FormLabel>
                  <FormControl>
                    <Popover open={openBayiTipi} onOpenChange={setOpenBayiTipi}>
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
                            <CommandEmpty>Bayi Tipi bulunamadı.</CommandEmpty>
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
                <FormItem className="space-y-1 mt-7">
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
                <FormItem className="space-y-1 mt-7">
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
                <FormItem className="space-y-1 mt-7">
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
                <FormItem className="space-y-1 mt-7">
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
                <FormItem className="space-y-1 mt-7">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İl
                  </FormLabel>
                  <FormControl>
                    <Popover open={openIller} onOpenChange={setOpenIller}>
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
                <FormItem className="space-y-1 mt-7">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İlçe
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="İlçe"
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
              name="ust_bayi"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-7">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Üst Bayi
                  </FormLabel>
                  <FormControl>
                    <Popover
                      open={openUstBayi}
                      onOpenChange={(open) => {
                        setOpenUstBayi(open);
                        if (open) {
                          refetch();
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
                          {field.value ? field.value : "Üst Bayi Seçiniz..."}
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
                            ) : bayiler.length === 0 ? (
                              <CommandEmpty>Bayi bulunamadı.</CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {bayiler.map((bayi) => (
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
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7 mr-5"> */}
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

          <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-end mt-5">

            <Button
              type="button"
              onClick={() => form.reset()}
              className="bg-red-800 hover:bg-red-500 text-white h-10 text-sm px-3 py-0 pl-4 pr-4 mr-5 "
            >
              İptal
            </Button>
            
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm px-2 py-0 pl-4 pr-4 mr-5"
              onClick={() => {
                const unvan = form.getValues("unvan");
                let prefix = "";

                // Eğer ünvan varsa ilk iki harfini al
                if (unvan && unvan.length >= 2) {
                  // Sadece harf ve sayıları al, özel karakterleri atla
                  const validChars = unvan.replace(/[^a-zA-Z0-9]/g, "");
                  if (validChars.length >= 2) {
                    prefix = validChars.substring(0, 2).toUpperCase();
                  } else {
                    toast.warning("Ünvan geçerli değil", {
                      description: "Ünvan en az 2 harf veya rakam içermelidir",
                    });
                    return;
                  }
                } else {
                  // Ünvan yoksa veya 2 karakterden kısaysa uyarı ver
                  toast.warning("Ünvan alanını doldurun", {
                    description:
                      "Ünvan alanı doldurulmadan bayi kodu üretilemez",
                  });
                  return;
                }

                // Toplam uzunluk 12 olacak şekilde, prefix'ten sonra 10 karakterlik random kısım ekle
                const randomPart = Math.random()
                  .toString(36)
                  .substring(2, 12)
                  .toUpperCase();

                // Eğer randomPart 10 karakterden kısa ise, tamamlamak için ek karakterler ekle
                const filledRandomPart = randomPart
                  .padEnd(10, "0")
                  .substring(0, 10);

                // Ünvan ön eki ve rastgele kısmı birleştir - tam olarak 12 karakter
                const bayiKodu = prefix + filledRandomPart;

                // Bayi kodu alanını güncelle
                form.setValue("bayi_kodu", bayiKodu);
              }}
            >
              Bayi Kodu Üret
            </Button>

            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white h-10 text-sm px-2 py-0 pl-4 pr-4 mr-5"
              onClick={() => {
                const randomPassword = Math.random()
                  .toString(36)
                  .substring(2, 11);
                form.setValue("bayi_sifre", randomPassword);
              }}
            >
              Şifre Üret
            </Button>
            <Button
              type="submit"
              disabled={createBayiMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-sm px-3 py-0 pl-4 pr-4 "
            >
              {createBayiMutation.isPending ? "Gönderiliyor..." : "Kaydet"}
            </Button>
          </div>
          {/* </div> */}
        </form>
      </Form>
    </>
  );
}
