"use client"

import { Button } from "@/components/ui/button"

export const mustericolums = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    minSize: 80,
    cell: ({ row }) => {
      const value = row.getValue("id");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
   {
    accessorKey: "unvan",
    header: "Ticari Ünvan",
    size: 250,
    minSize: 250,
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
    accessorKey: "yetkili",
    header: "Yetkili",
    size: 200,
    minSize: 200,
    cell: ({ row }) => {
      const value = row.getValue("yetkili");
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
    size: 250,
    minSize: 250,
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
    accessorKey: "il",
    header: "İl",
    size: 150,
    minSize: 150,
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
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const value = row.getValue("ilce");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
        {
    accessorKey: "vergi_dairesi",
    header: "Vergi Dairesi",
    size: 180,
    minSize: 180,
    cell: ({ row }) => {
      const value = row.getValue("vergi_dairesi");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
    
  },
        {
    accessorKey: "vergi_no",
    header: "Vergi No",
    size: 100,
    minSize: 100,
    maxSize: 120,
              cell: ({ row }) => {
      const value = row.getValue("vergi_no");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
        {
    accessorKey: "tel",
    header: "Telefon",
    size: 100,
    minSize: 100,
    maxSize: 120,
              cell: ({ row }) => {
      const value = row.getValue("tel");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
        {
    accessorKey: "cep_tel",
    header: "Cep Telefon",
    size: 100,
    minSize: 100,
    maxSize: 120,
              cell: ({ row }) => {
      const value = row.getValue("cep_tel");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
        {
    accessorKey: "adres",
    header: "Adres",
    size: 100,
    minSize: 100,
    maxSize: 120,
            cell: ({ row }) => {
      const value = row.getValue("adres");
      return value ? (
        <div className="max-w-[180px] truncate" title={value}>
          {value}
        </div>
      ) : null;
    }
  },
];
  