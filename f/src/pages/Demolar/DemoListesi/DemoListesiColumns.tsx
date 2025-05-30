"use client";
import { MRT_ColumnDef } from "material-react-table";
import { type Person } from "./DemoListesi";




export const columns: MRT_ColumnDef<Person>[] = [
      {
          accessorKey: "firma_adi",
          header: "Firma Adı",
          size: 145,
       
        },
        {
          accessorKey: "adsoyad",
          header: "Ad Soyad",
          size: 145,
          
       
        },
        {
          accessorKey: "telefon",
          header: "Telefon",
          size: 145,
       
        },
        {
          accessorKey: "email",
          header: "Email",
          size: 145,
        
        },
        {
          accessorKey: "il",
          header: "İl",
          size: 145,
         
        },
        {
          accessorKey: "aciklama",
          header: "Açıklama",
          size: 145,
        
        },
        {
          accessorKey: "son_gorusme_tarihi",
          header: "Son Görüşme Tarihi",
          size: 145,
         
        },
        {
          id: "durum",
          accessorKey: "durum",
          header: "Durum",
          
          size: 145,
        
        },
        {
          accessorKey: "bayi",
          header: "Bayi",
          size: 145,
        
        },
        {
          accessorKey: "notlar",
          header: "Notlar",
          size: 145,
          grow: 20,
        },
      
      ];