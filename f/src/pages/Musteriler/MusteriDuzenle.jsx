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
  unvan: z.string().min(1, "Ünvan gerekli"),
  yetkili: z.string().min(1, "Yetkili gerekli"),
  eposta: z.string().email("Geçerli bir e-posta adresi giriniz"),
  il: z.string().min(1, "İl gerekli"),
  ilce: z.string().min(1, "İlçe gerekli"),
  vergi_dairesi: z.string().min(1, "Vergi dairesi gerekli"),
  vergi_no: z.string().min(1, "Vergi no gerekli"),
  tel: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
  cep_tel: z
    .string()
    .min(10, "Cep telefonu numarası en az 10 karakter olmalıdır"),
  adres: z.string().min(1, "Adres gerekli"),
});

const iller = [
  { value: "Adana", label: "Adana" },
  { value: "Adıyaman", label: "Adıyaman" },
  { value: "Afyonkarahisar", label: "Afyonkarahisar" },
  { value: "Ağrı", label: "Ağrı" },
  { value: "Amasya", label: "Amasya" },
  { value: "Ankara", label: "Ankara" },
  { value: "Antalya", label: "Antalya" },
  { value: "Artvin", label: "Artvin" },
  { value: "Aydın", label: "Aydın" },
  { value: "Balıkesir", label: "Balıkesir" },
  { value: "Bilecik", label: "Bilecik" },
  { value: "Bingöl", label: "Bingöl" },
  { value: "Bitlis", label: "Bitlis" },
  { value: "Bolu", label: "Bolu" },
  { value: "Burdur", label: "Burdur" },
  { value: "Bursa", label: "Bursa" },
  { value: "Çanakkale", label: "Çanakkale" },
  { value: "Çankırı", label: "Çankırı" },
  { value: "Çorum", label: "Çorum" },
  { value: "Denizli", label: "Denizli" },
  { value: "Diyarbakır", label: "Diyarbakır" },
  { value: "Edirne", label: "Edirne" },
  { value: "Elazığ", label: "Elazığ" },
  { value: "Erzincan", label: "Erzincan" },
  { value: "Erzurum", label: "Erzurum" },
  { value: "Eskişehir", label: "Eskişehir" },
  { value: "Gaziantep", label: "Gaziantep" },
  { value: "Giresun", label: "Giresun" },
  { value: "Gümüşhane", label: "Gümüşhane" },
  { value: "Hakkari", label: "Hakkari" },
  { value: "Hatay", label: "Hatay" },
  { value: "Isparta", label: "Isparta" },
  { value: "Mersin", label: "Mersin" },
  { value: "İstanbul", label: "İstanbul" },
  { value: "İzmir", label: "İzmir" },
  { value: "Kars", label: "Kars" },
  { value: "Kastamonu", label: "Kastamonu" },
  { value: "Kayseri", label: "Kayseri" },
  { value: "Kırklareli", label: "Kırklareli" },
  { value: "Kırşehir", label: "Kırşehir" },
  { value: "Kocaeli", label: "Kocaeli" },
  { value: "Konya", label: "Konya" },
  { value: "Kütahya", label: "Kütahya" },
  { value: "Malatya", label: "Malatya" },
  { value: "Manisa", label: "Manisa" },
  { value: "Kahramanmaraş", label: "Kahramanmaraş" },
  { value: "Mardin", label: "Mardin" },
  { value: "Muğla", label: "Muğla" },
  { value: "Muş", label: "Muş" },
  { value: "Nevşehir", label: "Nevşehir" },
  { value: "Niğde", label: "Niğde" },
  { value: "Ordu", label: "Ordu" },
  { value: "Rize", label: "Rize" },
  { value: "Sakarya", label: "Sakarya" },
  { value: "Samsun", label: "Samsun" },
  { value: "Siirt", label: "Siirt" },
  { value: "Sinop", label: "Sinop" },
  { value: "Sivas", label: "Sivas" },
  { value: "Tekirdağ", label: "Tekirdağ" },
  { value: "Tokat", label: "Tokat" },
  { value: "Trabzon", label: "Trabzon" },
  { value: "Tunceli", label: "Tunceli" },
  { value: "Şanlıurfa", label: "Şanlıurfa" },
  { value: "Uşak", label: "Uşak" },
  { value: "Van", label: "Van" },
  { value: "Yozgat", label: "Yozgat" },
  { value: "Zonguldak", label: "Zonguldak" },
  { value: "Aksaray", label: "Aksaray" },
  { value: "Bayburt", label: "Bayburt" },
  { value: "Karaman", label: "Karaman" },
  { value: "Kırıkkale", label: "Kırıkkale" },
  { value: "Batman", label: "Batman" },
  { value: "Şırnak", label: "Şırnak" },
  { value: "Bartın", label: "Bartın" },
  { value: "Ardahan", label: "Ardahan" },
  { value: "Iğdır", label: "Iğdır" },
  { value: "Yalova", label: "Yalova" },
  { value: "Karabük", label: "Karabük" },
  { value: "Kilis", label: "Kilis" },
  { value: "Osmaniye", label: "Osmaniye" },
  { value: "Düzce", label: "Düzce" },
];

export default function MusteriDuzenle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openIller, setOpenIller] = React.useState(false);
  const [openIlceler, setOpenIlceler] = React.useState(false);
  const [selectedIl, setSelectedIl] = React.useState("");
  const [ilceler, setIlceler] = useState([]);
  const [citiesData, setCitiesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unvan: "",
      yetkili: "",
      eposta: "",
      il: "",
      ilce: "",
      vergi_dairesi: "",
      vergi_no: "",
      tel: "",
      cep_tel: "",
      adres: "",
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
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 3,
  });

  // Cities data değiştiğinde citiesData state'ini güncelle
  useEffect(() => {
    if (citiesResult) {
      setCitiesData(citiesResult);
    }
  }, [citiesResult]);

  // Müşteri verilerini çekmek için useQuery kullanımı
  const {
    data: customerData,
    isLoading: customerLoading,
    isError: customerError,
  } = useQuery({
    queryKey: ["musteri", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/musteriler/${id}`
        );
        console.log("Müşteri verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error("Müşteri verileri yüklenirken hata oluştu:", error);
        toast.error("Müşteri verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  });

  // Müşteri verisi geldiğinde formu doldur
  useEffect(() => {
    let customer = null;
    if (customerData) {
      if (Array.isArray(customerData) && customerData.length > 0) {
        customer = customerData[0];
      } else if (typeof customerData === "object") {
        customer = customerData;
      }
    }
    if (customer) {
      const formValues = {
        unvan: customer.unvan || "",
        yetkili: customer.yetkili || "",
        eposta: customer.eposta || "",
        il: customer.il || "",
        ilce: customer.ilce || "",
        vergi_dairesi: customer.vergi_dairesi || "",
        vergi_no: customer.vergi_no || "",
        tel: customer.tel || "",
        cep_tel: customer.cep_tel || "",
        adres: customer.adres || "",
      };
      form.reset(formValues);
      if (customer.il) setSelectedIl(customer.il);
      setIsLoading(false);
    }
  }, [customerData, form]);

  // İl bilgisi değiştiğinde ilçe verilerini yükle
  useEffect(() => {
    if (selectedIl && refetchCities) {
      refetchCities();
    }
  }, [selectedIl, refetchCities]);

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

  // ID varsa güncelleme, yoksa yeni ekleme işlemi yap
  const handleMusteriMutation = useMutation({
    mutationFn: (musteriData) => {
      if (id) {
        // Güncelleme işlemi
        return axios.put(
          `http://localhost:3002/api/musteriler/${id}`,
          musteriData
        );
      } else {
        // Yeni kayıt işlemi
        return axios.post("http://localhost:3002/api/musteriler", musteriData);
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
    // Form verilerini konsola yazdır
    console.log("Form Verileri:", values);
    console.log("Yetkili value:", values.yetkili);
    console.log("İlçe value:", values.ilce);

    // Form doğrulaması sırasında hataları konsola yazdır
    console.log("Form hataları:", form.formState.errors);

    // Eksik veya boş değerler varsa uyarı göster
    if (!values.yetkili) {
      toast.error("Lütfen yetkili seçiniz");
      return;
    }

    if (!values.il) {
      toast.error("Lütfen il seçiniz");
      return;
    }

    if (!values.ilce) {
      toast.error("Lütfen ilçe seçiniz");
      return;
    }

    // API'ye form verilerini gönder
    setSuccess(false);
    setError(null);
    handleMusteriMutation.mutate(values);
    form.reset();
    navigate(`/musteri/${id}`);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-blue-900"
        >
          <h2 className="text-xl font-bold mb-4">
            {id ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
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
                      placeholder="Ticari Ünvan"
                      className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />{" "}
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
                      value={field.value || ""}
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
            <FormField
              control={form.control}
              name="eposta"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    E-Posta
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="E-Posta Giriniz"
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
              name="tel"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Telefon
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Telefon Giriniz"
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
              name="cep_tel"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Cep Telefonu
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Sıfır Olmadan Giriniz"
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
              name="vergi_dairesi"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Vergi Dairesi
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Vergi Dairesi"
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
              name="vergi_no"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Vergi No
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      minLength={10}
                      maxLength={11}
                      placeholder="Vergi No Giriniz"
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
              name="il"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İl
                  </FormLabel>
                  <FormControl>
                    <Popover
                      open={openIller}
                      onOpenChange={(open) => {
                        setOpenIller(open);
                        if (open && refetchCities) {
                          refetchCities();
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
            />{" "}
            <FormField
              control={form.control}
              name="ilce"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İlçe
                  </FormLabel>
                  <FormControl>
                    <Popover open={openIlceler} onOpenChange={setOpenIlceler}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openIlceler}
                          className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                          disabled={!selectedIl}
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
                                  onSelect={() => {
                                    console.log("İlçe seçildi:", ilce.value);
                                    field.onChange(ilce.value);
                                    form.setValue("ilce", ilce.value);
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
          </div>

          {/* Adres ve Butonlar */}
          <FormField
            control={form.control}
            name="adres"
            render={({ field }) => (
              <FormItem className="space-y-1 mt-10">
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
              onClick={() => {
                if (id) {
                  navigate(`/musteri/${id}`);
                } else {
                  form.reset();
                }
              }}
              className="bg-red-800 hover:bg-red-500 text-white h-10 text-sm px-3 py-0 pl-4 pr-4 mr-5"
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-sm px-3 py-0 pl-4 pr-4"
              disabled={handleMusteriMutation.isPending}
            >
              {handleMusteriMutation.isPending
                ? "Kaydediliyor..."
                : id
                ? "Güncelle"
                : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
