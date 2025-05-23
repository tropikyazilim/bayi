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

export default function MusteriEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openIller, setOpenIller] = React.useState(false);
  const [openIlceler, setOpenIlceler] = React.useState(false);
  const [selectedIl, setSelectedIl] = React.useState("");
  const [ilceler, setIlceler] = useState([]);
  const [citiesData, setCitiesData] = useState(null);

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

  // useEffect ile selectedIl değiştiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedIl && citiesData && citiesData.cities) {
      const districts = citiesData.cities[selectedIl] || [];
      const formattedDistricts = districts.map((district) => ({
        value: district,
        label: district,
      }));

      setIlceler(formattedDistricts);

      // İlçe dropdown'ını açık ise ilçe seçildiğinde temizle
      if (form.getValues("ilce")) {
        form.setValue("ilce", "");
      }

      console.log(`${selectedIl} için ilçeler yüklendi:`, formattedDistricts);
    }
  }, [selectedIl, citiesData, form]);

  const createMusteriMutation = useMutation({
    mutationFn: (musteriData) => {
      return axios.post("http://localhost:3002/api/musteriler", musteriData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();

      toast.success("Müşteri başarıyla eklendi", {
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
          error.response?.data?.message || "Müşteri eklenirken bir hata oluştu",
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
      createMusteriMutation.mutate(values);
    }

  return (
    <>
    <div className="h-full w-full">
      <div className="h-full w-full p-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                        if (open) {
                          refetchCities();
                        }
                      }}
                    >                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          size="default"
                          aria-expanded={openIller}
                          className="w-full justify-between text-gray-700"
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
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İlçe
                  </FormLabel>
                  <FormControl>
                    <Popover open={openIlceler} onOpenChange={setOpenIlceler}>                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          size="default"
                          aria-expanded={openIlceler}
                          className="w-full justify-between text-gray-700"
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

          <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-3 md:flex-row md:items-end mt-5">
            <Button
              type="button"
              onClick={() => form.reset()}
              variant="destructive"
              size="lg"
            >
              İptal
            </Button>

            <Button
              type="submit"
              variant="success"
              size="lg"
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
