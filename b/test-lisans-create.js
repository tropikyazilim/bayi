// Test script for creating a license
import { getConnection } from './db.js';

// Wrap in an async IIFE to use await at top level
(async () => {
  try {
    console.log("Connecting to database...");
    const connection = await getConnection();
    console.log("Connected to database");
    
    // Test data for a new license
    const testLicense = {
      bayi_adi: "TEST BAYİ",
      musteri_adi: "TEST MÜŞTERİ",
      paket_adi: "TEST PAKET",
      aktif: true,
      kilit: false,
      is_demo: false,
      lisans_kodu: "2505251234ABCD123456",
      yetkili: "Test Yetkili",
      kullanici_sayisi: 5,
      lisans_suresi: 30,
      items: ["Modul1", "Modul2"]
    };
    
    // Converting items array to string
    const itemsJson = JSON.stringify(testLicense.items);
    
    // Insert test license
    console.log("Inserting test license...");
    const result = await connection.query(
      `INSERT INTO lisans 
       (bayi_adi, musteri_adi, paket_adi, aktif, kilit, 
        is_demo, lisans_kodu, yetkili, kullanici_sayisi, lisans_suresi, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        testLicense.bayi_adi,
        testLicense.musteri_adi,
        testLicense.paket_adi,
        testLicense.aktif,
        testLicense.kilit,
        testLicense.is_demo,
        testLicense.lisans_kodu,
        testLicense.yetkili,
        testLicense.kullanici_sayisi,
        testLicense.lisans_suresi,
        itemsJson
      ]
    );
    
    console.log("License created successfully:");
    console.log(result.rows[0]);
  } catch (error) {
    console.error('Error creating test license:', error);
  } finally {
    process.exit(0); // Ensure script exits
  }
})();
