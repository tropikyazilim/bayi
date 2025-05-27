"use client";

import { Button } from "@/components/ui/button";
import { StatusCell } from "./DemoListesiDataTable2";

export const degerler = [
  {
    accessorKey: "firma_adi",
    size: 200,
  },
  {
    accessorKey: "adsoyad",
    size: 100,
  },
  {
    accessorKey: "telefon",
    size: 150,
  },
  {
    accessorKey: "email",
    size: 150,
  },
  {
    accessorKey: "il",
    size: 150,
  },
  {
    accessorKey: "aciklama",
    size: 200,
  },
  {
    accessorKey: "son_gorusme_tarihi",
    size: 150,
  },
  {
    accessorKey: "durum",
    size: 150,
  },
  {
    accessorKey: "bayi",
    size: 130,
  },
  {
    accessorKey: "notlar",
    size: 150,
  },
  {
    accessorKey: "actions ",
    size: 150,
  },
];

export const demolistesicolumns2 = [
  {
    accessorKey: "firma_adi",
    header: "Firma Adı",
    size: degerler[0].size,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "adsoyad",
    header: "Ad Soyad",
    size: degerler[1].size,

    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "telefon",
    header: "Telefon",
    size: degerler[2].size,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: degerler[3].size,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "il",
    header: "İl",
    size: degerler[4].size,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "aciklama",
    header: "Açıklama",
    size: degerler[5].size,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "son_gorusme_tarihi",
    header: "Son Görüşme Tarihi",
    size: degerler[6].size,
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
    size: degerler[7].size,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "bayi",
    header: "Bayi",
    size: degerler[8].size,
    enableResizing: true,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "notlar",
    header: "Notlar",
    size: degerler[9].size,
    enableResizing: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    id: "actions",
    header: "İşlemler",
    size: degerler[10].size,
    enableResizing: true,
    enableSorting: false,
    enableFiltering: false,
    cell: () => null, // Cell rendering is handled directly in the DataTable component
  },
];
