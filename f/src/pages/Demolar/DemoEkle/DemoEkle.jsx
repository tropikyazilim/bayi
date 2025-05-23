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
    kvkk: z.boolean().refine((val) => val === true, {
        message: "KVKK metnini kabul etmeniz gerekmektedir",
    }),
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

export default function DemoEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openIller, setOpenIller] = React.useState(false);
  const queryClient = useQueryClient();
    const [selectedIl, setSelectedIl] = useState(null);
    const navigate = useNavigate();
    


  // Parametreleri getirmek için useQuery kullanımı
  const {
    data: parametersData,
    isLoading,
    error: queryError,
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
        firma_adi: "",
        adsoyad: "",
        telefon: "0",
        email: "",
        il: "",
        aciklama: "",
        kvkk: false
        
    },
});

  // Parametreler yüklendiğinde form alanlarını doldur
  useEffect(() => {
    if (parametersData && parametersData.length > 0) {
      // parametreid=1 olan değeri bul ve modul_kodu'na ata
      const modulKoduParam = parametersData.find(
        (param) => param.parametreid === 1
      );
      if (modulKoduParam) {
        form.setValue("modul_kodu", modulKoduParam.deger);
        console.log(
          "Modül kodu otomatik olarak dolduruldu:",
          modulKoduParam.deger
        );
      }
    }
  }, [parametersData, form]);

  const createDemoMutation = useMutation({
    mutationFn: (DemoData) => {
      return axios.post("http://localhost:3002/api/demolar", DemoData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();
      // Modüller listesini güncelle
    //   queryClient.invalidateQueries(["demolar"]);

      toast.success("Demo başarıyla eklendi", {
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
          error.response?.data?.message || "Demo eklenirken bir hata oluştu",
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
    // Kullanıcının IP adresini almak için ipify API kullanımı
    const getIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const userIp = response.data.ip;
        
        
        // IP adresini form verilerine ekleyelim
        const formDataWithIp = {
          ...values,
          ip: userIp
        };
        
        console.log("Form başarıyla gönderildi!");
        console.log("Form Verileri :", formDataWithIp);
        console.log("Form hataları:", form.formState.errors);
        
        // IP eklenmiş veriyi API'ye gönder
        createDemoMutation.mutate(formDataWithIp);
      } catch (error) {
        console.error("IP adresi alınamadı:", error);
   
      }
    };

    // IP adresini al ve formu gönder
    getIpAddress();
    
    setSuccess(false);
    setError(null);
    
    // Form verileri validasyondan geçerse toast mesajı gösterme
    toast.success("Form başarıyla gönderildi", {
      description: "Talebiniz alınmıştır, en kısa sürede dönüş yapılacaktır.",
      style: {
        backgroundColor: "#dcfce7",
        border: "1px solid #86efac",
        color: "#166534",
      },
    });
    
    
    
  }

  return (
    <>
      <div className="h-full w-full flex justify-center items-start py-4">
        <div className="max-w-3xl w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Demo Talebi
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

                {/* KVKK */}
                <div className="mt-6 space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-sm h-9 border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                      >
                        Kişisel Verilerin Korunması Kanunu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-3xl max-h-[80vh] overflow-y-auto">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Kişisel Verilerin Korunması Kanunu
                          </h4>
                          <p className="text-sm text-muted-foreground items-center">
                            Kişisel Verilerin Korunması Kanunu İşbu 6698 Sayılı
                            Kişisel Verilerin Korunması Kanunu ile yürürlükteki
                            yasal mevzuata uygun olarak ve 6698 sayılı Kişisel
                            Verilerin Korunması Kanunu ("Kanun") kapsamında "Veri
                            Sorumlusu" sıfatıyla DEV BROS LTD ŞTİ.'ye ("Şirket")
                            ait www.devbros.com.tr alan adlı internet sitesinin
                            kullanması ile bağlantılı olarak elde edilen ve
                            tarafımızca sağlanan verilerin toplanması, işlenmesi
                            ve kullanım türü, derecesi ve amacı ile ilgili olarak
                            siz kullanıcılarımıza bilgilendirme yapılması
                            amaçlanmaktadır.
                            <br />
                            <br />
                            www.devbros.com.tr alan adlı internet sitesi DEV BROS
                            LTD ŞTİ. tarafından işletilmektedir. Şirket
                            kullanıcıların kişisel verilerinin yönetilmesinde
                            sorumlu kuruluştur. İşbu madde kapsamındaki
                            bilgilendirme 6698 sayılı "Kişisel Verilerin Korunması
                            Kanunu" kapsamında yapılmaktadır.
                            <br />
                            <br />
                            Kişisel verilerinizinin, gizli bilgilerinizin
                            korunmasını ve gizli tutulmasını ciddiye almaktayız.
                            Kanun ve ilgili mevzuat hükümlerine tarafımızca,
                            çalışanlarımızca ve servis sağlayıcılarımızca
                            görevlerini yerlerine getirirlerken gizliliklerine
                            mutlaka dikkat edilmesini ve yalnızca sizlere
                            bildirdiğimiz amaçlarla kullanılmasını sağlamak üzere
                            teknik ve idari önlemleri almaktayız.
                            <br />
                            <br />
                            Kişisel verilerin işlenmesi, kişisel verilerin tamamen
                            ve kısmen otomatik olan (çerezler) ya da herhangi bir
                            veri kayıt sisteminin parçası olmak kaydıyla otomatik
                            olmayan yollarla elde edilmesi, kaydedilmesi,
                            depolanması, muhafaza edilmesi, değiştirilmesi,
                            yeniden düzenlenmesi, açıklanması, aktarılması,
                            devralınması, elde edilebilir hale getirilmesi,
                            sınıflandırılması ya da kullanılmasının engellenmesi
                            gibi kişilere ait veriler üzerinde gerçekleştirilen
                            her türlü işlemi ifade etmektedir.
                            <br />
                            <br />
                            İnternet sitesine üyeliği kapsamında bizlere
                            sağladığınız bilgileriniz, buna ek olarak mal ve
                            hizmet alımlarınız sırasında çerezler ve benzeri
                            yöntemler aracılığı edinilen bilgiler; bizim
                            tarafımızdan, mevcut ve ilerideki iştiraklerimiz,
                            bağlı şirketlerimiz, hissedarlarımız, iş ortaklarımız,
                            haleflerimiz, hizmet ve faaliyetlerimiz ile yan
                            hizmetlerimizi yürütmek üzere hizmet aldığımız,
                            işbirliği yaptığımız, yurt içinde ve/veya yurtdışında
                            faaliyet gösteren program ortağı kuruluşlar ve diğer
                            üçüncü kişiler (hukuk ve vergi danışmanlarımız,
                            bankalar, bağımsız denetçiler dahil ve fakat bunlarla
                            sınırlı olmamak üzere, sizlere hizmet sunabilmemiz
                            için işbirliği yaptığımız veya yapabileceğimiz hizmet
                            tedarikçileri) ve/veya bunların belirleyecekleri
                            üçüncü kişiler/kuruluşlar tarafından muhtelif mal ve
                            hizmetlerin sağlanması ve her türlü bilgilendirme,
                            reklam-tanıtım, promosyon, satış, pazarlama ve üyelik
                            uygulamaları amaçlı yapılacak elektronik ve diğer
                            ticari-sosyal iletişimler için, belirtilenler ve
                            halefleri nezdinde süresiz olarak veya öngörecekleri
                            süre ile kayda alınabilecek, basılı/manyetik
                            arşivlerde saklanabilecek, gerekli görülen hallerde
                            güncellenebilecek, paylaşılabilecek, aktarılabilecek,
                            transfer edilebilecek, kullanılabilecek ve Kanun’un 5.
                            ve 6. maddelerinde belirtilen kişisel veri işleme
                            şartları ve amaçları dahilinde işlenebilecektir. Buna
                            ek olarak Kanun dahil ilgili mevzuat hükümleri
                            dahilinde zorunlu olması durumunda bazı uygulamalar ve
                            işlemler için ayrıca ilave izniniz de
                            gerekebilecektir. Bu durumlarda sizlerle iletişime
                            geçilecek ve sizlerin açık rızaları rica edilecektir.
                            Bu verilere ek olarak bizlere iletmiş olduğunuz
                            kişisel verileriniz hukukun gerekli kıldığı durumlarda
                            resmi kurum/kuruluşlar, mahkemeler tarafından talep
                            edilmesi halinde ilgili merci ve mahkemelere
                            iletilebilecektir.
                            <br />
                            <br />
                            Kişisel verileriniz internet sitemizde siz
                            kullanıcılarımıza daha iyi hizmet sunabilmesi,
                            hizmetlerimizin iyileştirebilmesi, ayrıca bu konuda
                            izin vermiş olmanız durumunda pazarlama
                            faaliyetlerinde kullanılabilmesi, ürün/hizmet teklifi,
                            her türlü bilgilendirme, reklam-tanıtım, promosyon,
                            satış, pazarlama, mağaza kartı, kredi kartı ve üyelik
                            uygulamaları, modelleme, raporlama, skorlama, internet
                            sitesinin kullanımını kolaylaştırılması,
                            kullanıcılarının ilgi alanlarına ve tercihlerine
                            yönelik tarafımızca veya iştiraklerimiz tarafından
                            yapılacak geliştirme çalışmalarda kullanılabilecektir.
                            İnternet sitesi üzerinde yaptığınız hareketlerin
                            çerezler ve benzeri yöntemlerle izlenebileceğini,
                            kaydının tutulabileceğini, istatistiki veya yukarıda
                            bahsedilen amaçlarla kullanılabilecektir. Ancak buna
                            ek olarak önemle belirtmek isteriz ki internet
                            sitemize üyelik, ürün veya hizmetlerimizin satın
                            alınması ve bilgi güncelleme amaçlı girilen bilgiler,
                            kredi kartı ve banka kartlarına ait gizli bilgiler
                            diğer internet kullanıcıları tarafından
                            görüntülenemez.
                            <br />
                            <br />
                            Ebeveyninin veya velisinin izni olmadan küçüklerin
                            kişisel verilerini göndermemeleri gerekmektedir.
                            <br />
                            <br />
                            Şirket’e ait internet sitesinin, durumun niteliğine
                            göre diğer internet sitelerine bağlantılar içermesi
                            halinde bu sitelerin operatörlerinin veri koruma
                            hükümlerine uygun olup olmamaları hususunda hiçbir
                            taahhütte bulunmamaktayız. Şirket, link veya benzeri
                            başka yöntemlerle bağlantı verdiği sitelerin
                            içeriklerinden hiçbir zaman sorumlu değildir.
                            <br />
                            <br />
                            6698 Sayılı Kişisel Verilerin Korunması Kanunu’nun 11.
                            maddesi uyarınca; kişisel verilerinizin işlenip
                            işlenmediğini öğrenme, kişisel verileriniz işlenmişse
                            buna ilişkin bilgi talep etme, kişisel verilerinizin
                            işlenme amacını ve bunların amacına uygun kullanılıp
                            kullanılmadığını öğrenme, yurt içinde veya yurt
                            dışında kişisel verilerinizin aktarıldığı üçüncü
                            kişileri bilme, kişisel verilerinizin eksik veya
                            yanlış işlenmiş olması halinde bunların düzeltilmesini
                            isteme ve bu kapsamda yapılan işleme ilişkin olarak
                            kişisel verilerinizin aktarıldığı üçüncü kişilere
                            bildirilmesini isteme, Kanun’un ve ilgili sair mevzuat
                            hükümlerine uygun olarak işlenmiş olmasına rağmen,
                            işlenmesini gerektiren sebeplerin ortadan kalkması
                            halinde kişisel verilerin silinmesini veya yok
                            edilmesini isteme ve bu kapsamda yapılan işlemin
                            kişisel verilerinizin aktarıldığı üçüncü kişilere
                            bildirilmesini isteme, işlenen verilerin münhasıran
                            otomatik sistemler vasıtasıyla analiz edilmesi
                            suretiyle aleyhinize bir sonucun ortaya çıkmasına
                            itiraz etme, kişisel verilerinizin Kanun’a aykırı
                            olarak işlenmesi sebebiyle zarara uğramanız halinde
                            zararın giderilmesini talep etme haklarına sahipsiniz.
                            Kişisel veri sahipleri olarak, az önce saymış
                            olduğumuz haklarınıza ilişkin taleplerinizi, söz
                            konusu yöntemlerle Şirket’e iletmeniz durumunda
                            Şirketimiz talebin niteliğine göre en kısa sürede ve
                            en geç otuz gün içinde ücretsiz olarak
                            sonuçlandıracaktır. Ancak, işlemin ayrıca bir maliyeti
                            gerektirmesi halinde Kişisel Verileri Koruma Kurulunca
                            belirlenen tarifedeki ücret alınabilir.
                            <br />
                            <br />
                            Kanun’un 13. maddesinin 1. fıkrası gereğince, yukarıda
                            belirtilen haklarınızı kullanmak ile ilgili
                            talebinizi, yazılı olarak veya Kişisel Verileri Koruma
                            Kurulu’nun belirlediği diğer yöntemlerle Şirket’e
                            iletebilirsiniz. Kişisel Verileri Koruma Kurulu
                            tarafından şu aşamada ilgili haklarınızın kullanımına
                            ilişkin herhangi bir yöntem belirlemediği için,
                            başvurunuzu Kanun gereğince, yazılı olarak Şirket’e
                            iletmeniz gerekmektedir.
                            <br />
                            <br />
                            Çerezler
                            <br />
                            <br />
                            İnternet sitemizde; IP adresi, kullanılan tarayıcı,
                            bilgisayarınızdaki işletim sistemi, internet
                            bağlantınız, site kullanımları hakkındaki bilgiler
                            gibi belirli verileri otomatik olarak elde etmemize
                            yardımcı olan çerezler (cookie) bulunmaktadır. Söz
                            konusu çerezler bir internet sayfası sunucusu
                            tarafından sabit sürücünüze iletilen küçük metin
                            dosyalarıdır ve sitemizde bulunan çerezler,
                            bilgisayarınız için zararlı sayılabilecek virüsler
                            göndermek için kullanılmamaktadır.
                            <br />
                            <br />
                            Çerezler genellikle bilgisayarınızda saklanarak,
                            internet sitemizde yapmış olduğunuz işlemler,
                            gezintileriniz esnasındaki tıklamalarınızın
                            kaydedilmesi yolu ile internet sitesini hangi zaman
                            dilimi içerisinde, ne kadar süre ile kaç kişinin
                            kullandığı, bir kişinin internet sitesini hangi
                            amaçlarla, kaç kez ziyaret ettiği ve site üzerinde ne
                            kadar vakit harcadığı hakkında istatistiksel bilgileri
                            elde etmek ve kullanıcı sayfalarından dinamik olarak
                            reklam ve içerik üretilmesine yardımcı olmak amacı ile
                            sağlanmaktadır. İnternet sitemizi kullanarak
                            kullanılan çerezleri onaylamış olursunuz. Şirket, söz
                            konusu çerezler aracılığı ile verilerinizi işleyebilir
                            ve elde edilen bilgileri analiz etme amacı ile bu
                            kapsamda yurtiçinde ve yurtdışında üçüncü kişilere
                            aktarabilir.
                            <br />
                            <br />
                            Çerezler tarafından verileriniz toplanmadan internet
                            sitemizi görüntülemek istiyorsanız seçiminizi
                            cihazınızın/tarayıcınızın ayarlarından her zaman
                            değiştirebilirsiniz. Çerezlerin kullanımını
                            durdurduğunuzda internet sitemizde her türlü işlemi
                            belirli özelliklerinin çalışmayabileceğini lütfen
                            unutmayınız.
                            <br />
                            <br />
                            Açık Rıza
                            <br />
                            <br />
                            Sizler, internet sitemize girerek tarafımıza sağlamış
                            olduğunuz kişisel verilerinizin Kanun’a ve işbu 6698
                            Sayılı Kişisel Verilerin Korunması Kanunu’ne uygun bir
                            şekilde ve belirtilen amaçlarla işlenebileceğini
                            bilmekte, kabul etmekte ve ayrıca işbu 6698 Sayılı
                            Kişisel Verilerin Korunması Kanunu ile Kanun
                            kapsamında yapılması gereken aydınlatma yükümlülüğü
                            yerine getirildiğini, Sözleşme’yi okuduğunuzu,
                            anladığınızı, haklarınızın ve yükümlülüklerinin
                            bilincinde olduğunuzu beyan etmektesiniz.
                            <br />
                            <br />
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                    <FormField
                      control={form.control}
                      name="kvkk"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </FormControl>
                          <div className="leading-none">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              6698 Sayılı Kişisel Verilerin Korunması Kanunu hakkında
                              bilgilendirmeyi okudum, kabul ediyorum.
                            </FormLabel>
                            <FormMessage className="text-xs" />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      navigate("/");
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
