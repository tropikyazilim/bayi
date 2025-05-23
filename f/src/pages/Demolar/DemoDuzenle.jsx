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
  SelectItem,
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
    },
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
  }, [DemoData, form]);

  const handleDemoDuzenleMutation = useMutation({
    mutationFn: (DemoDuzenleData) => {
      if (id) {
        // Güncelleme işlemi
        return axios.put(
          `http://localhost:3002/api/demolar/${id}`,
          DemoDuzenleData
        );
      } else {
        // Yeni kayıt işlemi
        return axios.post(`${API_URL}/api/demolar`, DemoDuzenleData);
      }
    },
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);

      if (id) {
        toast.success("Demo başarıyla güncellendi", {
          description: "Değişiklikler kaydedildi",
          style: {
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
          },
        });
      } else {
        form.reset();
        toast.success("Demo başarıyla eklendi", {
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
    // Form verileri ve hataları konsola yazdır - sorun giderme için
    console.log("Form başarıyla gönderildi!");
    console.log("Form Verileri:", values);
    console.log("Form hataları:", form.formState.errors);

    // Seçilen tarihi ekle (date state'inden)
    if (date) {
      values.secilen_tarih = format(date, "yyyy-MM-dd");
    }

    // Demo verilerini güncelle
    handleDemoDuzenleMutation.mutate(values);

    setSuccess(true);
    setError(null);
    navigate("/demolistesi/");

    // Form verileri validasyondan geçerse toast mesajı gösterme
    toast.success("Form başarıyla gönderildi", {
      description: "Form kaydedildi",
      style: {
        backgroundColor: "#dcfce7",
        border: "1px solid #86efac",
        color: "#166534",
      },
    });
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Demo Talebi Düzenle
                </h2>
                <div className="h-0.5 bg-gray-200 w-full"></div>
              </div>
              <div className="space-y-5">
                {/* İlk sıra */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firma_adi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-sm">
                          Firma Adı
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Firma Adı"
                            className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adsoyad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-sm">
                          Ad-Soyad
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ad-Soyad"
                            className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* İkinci sıra */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-sm">
                          Telefon
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="0_________"
                              className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
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
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-sm">
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="E-mail adresiniz"
                            className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* İl seçimi */}
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="il"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-sm">
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
                                className="w-full justify-between text-gray-700 h-9 text-sm border-gray-300 rounded-md"
                              >
                                {field.value
                                  ? iller.find((il) => il.value === field.value)
                                      ?.label
                                  : "İl Seçiniz..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                  className="h-9"
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
                                        className="text-sm"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Açıklama */}
                <FormField
                  control={form.control}
                  name="aciklama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">
                        Açıklama
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="İhtiyaçlarınızı detaylı açıklayınız"
                          className="min-h-[100px] bg-white border-gray-300 focus:border-blue-500 text-sm shadow-sm rounded-md resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">
                        IP
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          disabled
                          className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="son_gorusme_tarihi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">
                        Son Görüşme Tarihi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          // disabled
                          className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm shadow-sm rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secilen_tarih"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">
                        Tarih Seçiniz
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {date ? (
                                format(date, "PPP", {
                                  locale: tr,
                                })
                              ) : (
                                <span>Bir tarih seç</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
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
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Butonlar */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      navigate("/demolistesi/");
                    }}
                    className="bg-red-400 text-white border border-gray-300 hover:bg-red-500 h-9 text-sm rounded-md px-4"
                  >
                    İptal
                  </Button>

                  <Button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white h-9 text-sm rounded-md px-6"
                  >
                    Gönder
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
