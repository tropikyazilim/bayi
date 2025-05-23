"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
    minSize: 60,
    maxSize: 80
  },
  {
    accessorKey: "bayi_kodu",
    header: ({ column }) => (      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center py-2 font-semibold text-gray-700 hover:text-gray-900"
      >
        Bayi Kodu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 110,
    minSize: 110,
    maxSize: 130
  },
  {
    accessorKey: "bayi_sifre",
    header: "Bayi Şifre",
    size: 100,
    minSize: 100,
    maxSize: 120
  },
  {
    accessorKey: "unvan",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ünvan
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 180,
    minSize: 150,
    maxSize: 200,
    cell: ({ row }) => {
      const value = row.getValue("unvan");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
  {
    accessorKey: "firma_sahibi",
    header: "Firma Sahibi",
    size: 130,
    minSize: 130,
    maxSize: 180
  },
  {
    accessorKey: "bayi_tipi",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bayi Tipi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 110,
    minSize: 110,
    maxSize: 140
  },
  {
    accessorKey: "il",
    header: "İl",
    size: 90,
    minSize: 90,
    maxSize: 120
  },
  {
    accessorKey: "ilce",
    header: "İlçe",
    size: 100,
    minSize: 100,
    maxSize: 140
  },
  {
    accessorKey: "adres",
    header: "Adres",
    size: 180,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => {
      const value = row.getValue("adres");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
  {
    accessorKey: "eposta",
    header: "E-posta",
    size: 130,
    minSize: 130,
    maxSize: 180
  },
  {
    accessorKey: "telefon",
    header: "Telefon",
    size: 120,
    minSize: 120,
    maxSize: 140,
    cell: ({ row }) => {
      const value = row.getValue("telefon");
      return value ? value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : null;
    }
  },
  {
    accessorKey: "cep_telefon",
    header: "Cep Telefonu",
    size: 120,
    minSize: 120,
    maxSize: 140,
    cell: ({ row }) => {
      const value = row.getValue("cep_telefon");
      return value ? value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : null;
    }
  },
  {
    accessorKey: "sorumlu_kisi",
    header: "Yetkili",
    size: 120,
    minSize: 120,
    maxSize: 160
  },
  {
    accessorKey: "ust_bayi",
    header: "Üst Bayi",
    size: 130,
    minSize: 130,
    maxSize: 180
  }
];
