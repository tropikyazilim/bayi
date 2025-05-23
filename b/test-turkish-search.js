// ES Module imports
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const { Pool } = pg;

// PostgreSQL bağlantı dizesi
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Türkçe karakter dönüşüm fonksiyonları
function turkishToLower(str) {
  if (!str) return ''; 
  return str
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .replace(/Ş/g, "ş")
    .replace(/Ğ/g, "ğ")
    .replace(/Ü/g, "ü")
    .replace(/Ö/g, "ö")
    .replace(/Ç/g, "ç")
    .toLowerCase();
}

function turkishToLowerSql(column) {
  // Bu formatı lisansController.js'deki çalışan formatla uyumlu hale getirelim
  return `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${column}, 'İ', 'i'), 'I', 'ı'), 'Ş', 'ş'), 'Ğ', 'ğ'), 'Ü', 'ü'), 'Ö', 'ö'), 'Ç', 'ç')))`;
}

// Test fonksiyonu
async function testSearch() {
  try {
    // Test değerleri
    const testSearchTerm = 'TURİZM'; // Büyük harfli İ içeren bir test terimi
    console.log(`Test arama terimi: "${testSearchTerm}"`);
    
    // Düzeltilmiş SQL sorgusunu test edelim
    const searchColumn = 'paket_adi'; // Arama yapılacak kolon
    const searchValue = `%${turkishToLower(testSearchTerm)}%`;
    
    // Önceki basit LIKE sorgusu (sorun yaşadığımız)
    const oldQuery = `SELECT id, bayi_adi, musteri_adi, paket_adi FROM lisans WHERE ${searchColumn} ILIKE $1 ORDER BY id DESC LIMIT 10`;
    
    // Yeni Türkçe karakter duyarlı sorgu
    const newQuery = `SELECT id, bayi_adi, musteri_adi, paket_adi FROM lisans WHERE ${turkishToLowerSql(searchColumn)} ILIKE $1 ORDER BY id DESC LIMIT 10`;
    
    // Önce veritabanında bu terimi içeren kayıtlar var mı kontrol edelim
    const checkQuery = `SELECT id, bayi_adi, musteri_adi, paket_adi FROM lisans WHERE ${searchColumn} LIKE '%${testSearchTerm}%' ORDER BY id DESC LIMIT 10`;
    console.log('Kontrol sorgusu:', checkQuery);
    const checkResult = await pool.query(checkQuery);
    console.log(`Veritabanında tam eşleşen "${testSearchTerm}" içeren ${checkResult.rowCount} kayıt var:`);
    console.log(checkResult.rows);
    
    // Eski yöntemle arama
    console.log('Eski sorgu:', oldQuery, [searchValue]);
    const oldResult = await pool.query(oldQuery, [searchValue]);
    console.log(`Eski yöntemle "${testSearchTerm}" araması ${oldResult.rowCount} sonuç döndürdü:`);
    console.log(oldResult.rows);
    
    // Yeni yöntemle arama
    console.log('Yeni sorgu:', newQuery, [searchValue]);
    const newResult = await pool.query(newQuery, [searchValue]);
    console.log(`Yeni yöntemle "${testSearchTerm}" araması ${newResult.rowCount} sonuç döndürdü:`);
    console.log(newResult.rows);
    
    // İkinci bir test için farklı bir Türkçe karakter içeren terim
    const testSearchTerm2 = 'IŞIK'; // Büyük harfli I içeren bir terim
    console.log(`\nİkinci test arama terimi: "${testSearchTerm2}"`);
    
    const searchValue2 = `%${turkishToLower(testSearchTerm2)}%`;
    
    // Yeni yöntemle ikinci terim araması
    console.log('Yeni sorgu:', newQuery, [searchValue2]);
    const newResult2 = await pool.query(newQuery, [searchValue2]);
    console.log(`Yeni yöntemle "${testSearchTerm2}" araması ${newResult2.rowCount} sonuç döndürdü:`);
    console.log(newResult2.rows);
    
    console.log('\nTest tamamlandı. Sonuçları karşılaştırın.');
  } catch (error) {
    console.error('Test hatası:', error);
  } finally {
    // Bağlantıyı kapatalım
    await pool.end();
  }
}

testSearch();
