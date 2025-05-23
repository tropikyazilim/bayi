"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export const columns = [  {
    accessorKey: "lisans_kodu",    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center justify-center">
        <span>Lisans Kodu</span>
        <ArrowUpDown className="ml-1 h-3 w-3"/>
      </div>
    ),
    size: 140,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    accessorKey: "musteri_adi",
    header: "Müşteri Adı",
    size: 140,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    accessorKey: "kullanici_sayisi",
    header: "Kullanıcı",
    size: 70,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {    
    accessorKey: "bayi_adi",
    header: "Bayi Adı",
    size: 120,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    accessorKey: "paket_adi",
    header: "Paket Adı",
    size: 120,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    accessorKey: "ekstramoduller",
    header: "Aktif Modüller",
    size: 130,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
    cell: ({ row }) => {      
      const allModules = row.original.items || [];
      const value = Array.isArray(allModules) ? allModules.join(", ") : "";
      return value;
    },
  },  {
    accessorKey: "yetkili",
    header: "Yetkili",
    size: 90,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    accessorKey: "created_at",
    header: "Oluşturulma",
    size: 130,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },  {
    // Use a derived accessor for the combined column
    accessorFn: (row) => {
      // Get total license duration
      const lisansSuresi = row.lisans_suresi || 0;

      // Calculate remaining time
      const creationDate = row.created_at
        ? new Date(row.created_at)
        : new Date();
      const today = new Date();
      const daysSinceCreation = Math.floor(
        (today - creationDate) / (1000 * 60 * 60 * 24)
      );
      const remainingDays = Math.max(0, lisansSuresi - daysSinceCreation);

      // Calculate percentage for progress bar
      const percentage =
        lisansSuresi > 0
          ? Math.max(0, Math.min(100, (remainingDays / lisansSuresi) * 100))
          : 0;
      // Lisans tipi bilgisini de ekle (full, demo, normal)
      const licenseType =
        lisansSuresi === 0
          ? "full"
          : remainingDays === 0
          ? "expired"
          : "active";
      return { lisansSuresi, remainingDays, percentage, licenseType };
    },    id: "sure_bilgileri", // Use id for the derived accessor    
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center justify-center">
        <span>Lisans</span>
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </div>
    ),
    size: 110,
    enableResizing: true,
    size: 110,
    minSize: 110,
    maxSize: 130,
    cell: ({ getValue }) => {
      const { lisansSuresi, remainingDays, percentage } = getValue(); // Determine color based on remaining days
      // Özel durumları belirle
      const isFullVersion = lisansSuresi === 0 && remainingDays === 0; // Full sürüm (hiç gün verilmemiş)
      const isExpiredDemo = lisansSuresi > 0 && remainingDays === 0; // Demo süresi bitmiş
      const getStatusColor = () => {
        if (isFullVersion) return "bg-teal-500";
        if (isExpiredDemo) return "bg-red-300";
        if (remainingDays < 10) return "bg-amber-500";
        if (percentage > 75) return "bg-teal-500";
        if (percentage > 40) return "bg-blue-500";
        return "bg-gray-500";
      };

      // Özel durumlarda gösterilecek ikonları tanımla
      const FullVersionIcon = () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-teal-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
          <path d="M16 6h4v4" />
        </svg>
      );
      const ExpiredDemoIcon = () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-red-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );      return (
        <div className="group transition-colors flex flex-col justify-center items-center">
          {/* Özel durumlar için gösterimi değiştir */}
          {isFullVersion ? (
            <div className="flex items-center justify-center text-xs">
              <div
                className="flex items-center justify-center bg-teal-50 rounded-md border border-teal-200 w-full"
                title="Tam sürüm lisans"
              >
                <div className="flex items-center w-20 h-7 justify-center">
                  <span className="font-bold text-teal-500">F</span>
                  <FullVersionIcon />
                </div>
              </div>
            </div>
          ) : isExpiredDemo ? (
            <div className="flex items-center justify-center text-xs">
              <div
                className="flex items-center justify-center bg-red-50 rounded-md border border-red-200 w-full"
                title="Demo süresi dolmuş"
              >
                <div className="flex items-center w-20 h-7 justify-center">
                  {" "}
                  <span className="font-bold text-red-300">D</span>
                  <ExpiredDemoIcon />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs relative w-full px-1">
              <div className="flex items-center justify-center w-10 h-6 rounded-l-sm ">
                <span
                  title="Toplam lisans süresi"
                  className="font-semibold text-gray-700 px-1.5"
                >
                  {lisansSuresi}
                </span>
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 text-gray-400 text-xs font-bold">
                &rsaquo;
              </span>
              <div className="flex items-center justify-center w-10 h-6 rounded-r-sm">
                <span
                  title="Kalan gün sayısı"
                  className={`font-semibold px-1.5 ${
                    remainingDays === 0
                      ? "text-gray-500"
                      : remainingDays < 10
                      ? "text-amber-600"
                      : "text-gray-700"
                  }`}
                >
                  {remainingDays}
                </span>
              </div>
            </div>
          )}

          {!isFullVersion && !isExpiredDemo && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden shadow-inner mt-1">
              <div
                className={`h-1.5 rounded-full ${getStatusColor()} transition-all group-hover:brightness-110`}
                style={{ width: `${percentage}%` }}
                title={`%${Math.round(percentage)} kalan süre`}
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "aktif",    header: "Aktif",
    size: 60,
    minSize: 60,
    maxSize: 80,
    cell: ({ row, table }) => {
      const initialValue = row.getValue("aktif");
      const [isChecked, setIsChecked] = useState(initialValue);
      const queryClient = useQueryClient();
      // Toggle mutation tanımlama
      const toggleAktifMutation = useMutation({
        mutationFn: async (newValue) => {
          const response = await axios.put(
            `http://localhost:3002/api/lisanslar/${row.original.id}/toggle-aktif`,
            {
              aktif: newValue,
            }
          );
          return response.data;
        },
        onSuccess: () => {
          // Başarıyla güncellendiğinde cache'i yenile
          queryClient.invalidateQueries({ queryKey: ["filteredLisanslar"] });
          console.log(
            `Lisans ${
              row.original.id
            } aktif durumu başarıyla değiştirildi: ${!isChecked}`
          );
        },
        onError: (error) => {
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
          console.error("Aktif durumu değiştirilemedi:", error);
        },
      });      const handleToggleAktif = async () => {
        try {
          // Önce UI'ı güncelle
          const newValue = !isChecked;
          setIsChecked(newValue);

          // Mutasyonu çağır
          toggleAktifMutation.mutate(newValue);
        } catch (error) {
          console.error("Aktif durumu değiştirilemedi:", error);
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
        }
      };
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center gap-2">
            <Switch
              checked={isChecked}
              onCheckedChange={handleToggleAktif}
              className={
                isChecked
                  ? "data-[state=checked]:bg-teal-500 data-[state=checked]:text-green-50"
                  : "data-[state=unchecked]:bg-slate-300 data-[state=unchecked]:text-red-50"
              }
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "kilit",    header: "Kilit",
    size: 50,
    minSize: 70,
    maxSize: 50,
    cell: ({ row, table }) => {
      const initialValue = row.getValue("kilit");
      const [isChecked, setIsChecked] = useState(initialValue);
      const queryClient = useQueryClient();
      // Toggle mutation tanımlama
      const toggleKilitMutation = useMutation({
        mutationFn: async (newValue) => {
          const response = await axios.put(
            `http://localhost:3002/api/lisanslar/${row.original.id}/toggle-kilit`,
            {
              kilit: newValue,
            }
          );
          return response.data;
        },
        onSuccess: () => {
          // Başarıyla güncellendiğinde cache'i yenile
          queryClient.invalidateQueries({ queryKey: ["filteredLisanslar"] });
          console.log(
            `Lisans ${
              row.original.id
            } kilit durumu başarıyla değiştirildi: ${!isChecked}`
          );
        },
        onError: (error) => {
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
          console.error("Kilit durumu değiştirilemedi:", error);
        },
      });

      const handleToggleKilit = async () => {
        try {
          // Önce UI'ı güncelle
          const newValue = !isChecked;
          setIsChecked(newValue);

          // Mutasyonu çağır
          toggleKilitMutation.mutate(newValue);
        } catch (error) {
          console.error("Kilit durumu değiştirilemedi:", error);
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
        }      };      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <Switch
              checked={isChecked}
              onCheckedChange={handleToggleKilit}
              className={
                isChecked
                  ? "data-[state=checked]:bg-red-400 data-[state=checked]:text-green-50"
                  : "data-[state=unchecked]:bg-slate-300 data-[state=unchecked]:text-red-50"
              }
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "duzenle",
    header: "Düzenle",
    size: 70,
    minSize: 60,
    maxSize: 70,    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="icon-sm"
            className="bg-blue-500 hover:bg-[#7abedb] text-white border-[#82c7e2] hover:text-[#053e56] transition-colors scale-75 transform"
            onClick={() => {
              navigate(`/lisansduzenle/${row.original.id}`);
              console.log("Row clicked:", row.original);
            }}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Düzenle</span>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "kopyala",
    header: "Kopyala",
    size: 70,
    minSize: 60,
    maxSize: 70,
    cell: ({ row }) => {
      // Kopyalama durumunu izlemek için state ekle
      const [copying, setCopying] = useState(false);
      const copyToClipboard = () => {
        // Kopyalama başladığını bildir
        setCopying(true); // Row verilerinin bir özetini oluştur
        const durumBilgileri = row.getValue("sure_bilgileri") || {};
        const lisansSuresi = durumBilgileri.lisansSuresi || 0;
        const remainingDays = durumBilgileri.remainingDays || 0;

        // Lisans durumu bilgisini belirle
        let lisansDurumu = "Normal";
        if (lisansSuresi === 0) {
          lisansDurumu = "Full Sürüm";
        } else if (remainingDays === 0) {
          lisansDurumu = "Süresi Dolmuş";
        } else if (remainingDays < 10) {
          lisansDurumu = "Süresi Azalmış";
        }

        // Modül bilgilerini al (artık ekstra değil, tüm modüller)
        const allModules = row.original.items || [];
        const modullerString = Array.isArray(allModules)
          ? allModules.join(", ")
          : "-";

        const lisansData = {
          lisans_kodu: row.getValue("lisans_kodu") || "-",
          musteri_adi: row.getValue("musteri_adi") || "-",
          kullanici_sayisi: row.getValue("kullanici_sayisi") || "-",
          bayi_adi: row.getValue("bayi_adi") || "-",
          paket_adi: row.getValue("paket_adi") || "-",
          yetkili: row.getValue("yetkili") || "-",
          created_at: row.getValue("created_at") || "-",
          lisans_suresi: lisansSuresi,
          kalan_gun: remainingDays,
          durum: lisansDurumu,
          aktif: row.getValue("aktif") ? "Aktif" : "Pasif",
          kilit: row.getValue("kilit") ? "Kilitli" : "Kilitsiz",
          ekstra_moduller: modullerString, // Değişken adı ekstra_moduller kaldı ama içerik tüm modüller olarak güncellendi
        }; // Sütun başlıklarını al
        // columns array'ini doğrudan import edemediğimiz için bir çözüm olarak
        // bilinen sütun başlıkları için bir mapping oluşturalım
        const columnHeaders = {
          lisans_kodu: "Lisans Kodu",
          musteri_adi: "Müşteri Adı",
          kullanici_sayisi: "Kullanıcı",
          bayi_adi: "Bayi Adı",
          paket_adi: "Paket Adı",
          ekstramoduller: "Aktif Modüller", // Başlık güncellendi
          yetkili: "Yetkili",
          created_at: "Oluşturulma Tarihi",
        };

        // Daha düzgün ve okunabilir bir metin formatı oluştur
        const formattedText = `LİSANS BİLGİLERİ
─────────────────────────────────────────
${columnHeaders.lisans_kodu.padEnd(16)}  : ${lisansData.lisans_kodu}
${columnHeaders.musteri_adi.padEnd(16)}  : ${lisansData.musteri_adi}
${columnHeaders.kullanici_sayisi.padEnd(16)}  : ${lisansData.kullanici_sayisi}
${columnHeaders.bayi_adi.padEnd(16)}  : ${lisansData.bayi_adi}
${columnHeaders.paket_adi.padEnd(16)}  : ${lisansData.paket_adi}
${columnHeaders.yetkili.padEnd(16)}  : ${lisansData.yetkili}
${columnHeaders.created_at.padEnd(16)}  : ${lisansData.created_at}
────── Lisans Durumu ──────────────────
Toplam Süre      : ${lisansData.lisans_suresi} gün
Kalan Gün        : ${lisansData.kalan_gun} gün
Durum            : ${lisansData.durum}
Aktif/Pasif      : ${lisansData.aktif}
Kilit Durumu     : ${lisansData.kilit}
────── Modül Bilgileri ─────────────────
${columnHeaders.ekstramoduller.padEnd(16)}  : ${lisansData.ekstra_moduller}
─────────────────────────────────────────`;

        // Metni panoya kopyala
        navigator.clipboard
          .writeText(formattedText)
          .then(() => {
            console.log("Lisans bilgileri kopyalandı");
            // Başarılı kopyalama bildirimi göster
            toast.success("Lisans bilgileri panoya kopyalandı", {
              description: `${lisansData.lisans_kodu} kodlu lisans bilgileri kopyalandı`,
              duration: 3000,
            });
            // Kopyalama durumunu sıfırla
            setTimeout(() => setCopying(false), 1000);
          })
          .catch((err) => {
            console.error("Kopyalama hatası:", err);
            // Hata bildirimi göster
            toast.error("Kopyalama başarısız", {
              description: "Lisans bilgileri kopyalanırken bir hata oluştu",
              duration: 3000,
            });
            setCopying(false);
          });
      };      return (        
        <div className="flex items-center justify-center">
          <Button
            variant={copying ? "outline" : "ghost"}
            size="icon-sm"
            className={`transition-all duration-300 border border-slate-300 group relative scale-75 transform ${
              copying
                ? "border-slate-700 bg-white text-green-600 scale-65"
                : "hover:bg-white hover:text-blue-600"
            }`}
            onClick={copyToClipboard}
            disabled={copying}
            title="Lisans bilgilerini kopyala"
          >
            {copying ? (
              // Kopyalandı ikonu (check mark) ve animasyon
              <div className="relative">                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 bg-white text-green-500 animate-bounce"
                  viewBox="0 0 24 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                
              </div>
            ) : (
              // Kopyala ikonu
              <div className="relative">                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>{" "}
                {/* Bilgileri Kopyala yazısı kaldırıldı */}
              </div>
            )}
            <span className="sr-only">Kopyala</span>
          </Button>
        </div>
      );
    },
  },
];
