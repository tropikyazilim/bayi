"use client";

import { Button } from "@/components/ui/button";
import { StatusCell } from "./DemoListesiDataTable";

export const demolistesicolumns = [
  {
    accessorKey: "firma_adi",
    header: "Firma Adı",
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "adsoyad",
    header: "Ad Soyad",
    size: 100,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "telefon",
    header: "Telefon",
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "il",
    header: "İl",
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "aciklama",
    header: "Açıklama",
    size: 200,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "son_gorusme_tarihi",
    header: "Son Görüşme Tarihi",
    size: 150,
    enableResizing: true,
  
    meta: {
      filterVariant: "text",
    },
  },
  {
    id: "durum",
    accessorKey: "durum", 
    header: "Durum",
    cell: ({ row, getValue }) => <StatusCell row={row} value={getValue()} />,
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "bayi",
    header: "Bayi",
    size: 130,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "notlar",
    header: "Notlar",
    size: 150,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    id: "actions",
    header: "İşlemler",
    size: 120,
    enableResizing: true,
    enableSorting: false,
    enableFiltering: false,
    cell: () => null, // Cell rendering is handled directly in the DataTable component
  },
];
