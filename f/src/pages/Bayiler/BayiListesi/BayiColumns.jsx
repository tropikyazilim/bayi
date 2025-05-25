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
    header: "Bayi Kodu",
    size: 120,
    minSize: 110,
    maxSize: 140
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
    header: "Bayi Ünvan",
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
    header: "Bayi Tipi",
    size: 110,
    minSize: 110,
    maxSize: 140
  },
  {
    accessorKey: "il",
    header: "İl",
    size: 90,
    minSize: 90,
    maxSize: 120,
        cell: ({ row }) => {
      const value = row.getValue("il");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
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
    maxSize: 180,
        cell: ({ row }) => {
      const value = row.getValue("eposta");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
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
    maxSize: 180,
    cell: ({ row }) => {
      const value = row.getValue("ust_bayi");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  }
];
