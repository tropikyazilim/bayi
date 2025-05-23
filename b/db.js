// Veritabanı bağlantısı için gerekli kodlar
import pg from 'pg'; // PostgreSQL için
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname değişkenini ESM için tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını yükle
dotenv.config();

// Veritabanı bağlantı durumu
let dbState = {
  db: null,
  isConnected: false,
  currentUser: null,
  lastConnectionTime: null
};

// Tüm PostgreSQL bağlantılarını temizlemek için pool
const pgPool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Kullanıcı adına göre veritabanı adını günceller ve tüm bağlantıları sıfırlar
 * @param {string} username - Kullanıcının adı
 */
export async function updateDbNameByUsername(username) {
  try {
    console.log(`[${new Date().toISOString()}] updateDbNameByUsername çağrıldı: ${username}`);
    console.log(`[DB STATE] Mevcut durum: connected=${dbState.isConnected}, user=${dbState.currentUser}`);
    
    // Tüm bağlantıları kapat ve bellekteki veritabanı referanslarını temizle
    await resetAllConnections();
    
    // .env dosyasının yolu (kesin yol kullanarak)
    const envPath = path.join(__dirname, '.env');
    console.log('.env dosya yolu:', envPath);
    
    try {
      // .env dosyasını oku
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // DB_NAME satırını bulup değerini kontrol et
      const currentDbNameMatch = envContent.match(/DB_NAME=(.*)/);
      const currentDbName = currentDbNameMatch ? currentDbNameMatch[1] : 'bilinmiyor';
      console.log(`Mevcut DB_NAME değeri: ${currentDbName}`);
      
      // DB_NAME satırını kullanıcı adıyla değiştir
      envContent = envContent.replace(/DB_NAME=.*/g, `DB_NAME=${username}`);
      
      // Değişiklikleri .env dosyasına yaz
      fs.writeFileSync(envPath, envContent);
      console.log(`.env dosyası güncellendi, yeni DB_NAME=${username}`);
      
      // Dotenv'i yeniden yükle
      dotenv.config({path: envPath, override: true});
      
      // process.env.DB_NAME değerini kontrol et
      console.log(`Yüklenen process.env.DB_NAME değeri: ${process.env.DB_NAME}`);
      
      if (process.env.DB_NAME !== username) {
        console.error(`HATA: process.env.DB_NAME (${process.env.DB_NAME}) !== istenen username (${username})`);
        // Zorla process.env'i güncelleyelim
        process.env.DB_NAME = username;
        console.log(`process.env.DB_NAME değeri zorla güncellendi: ${process.env.DB_NAME}`);
      }
    } catch (fsError) {
      console.error('.env dosyası işlenirken hata:', fsError);
      throw fsError;
    }
    
    // Veritabanı bağlantısını yeniden kur
    try {
      dbState.db = await createConnection();
      dbState.isConnected = true;
      dbState.currentUser = username;
      dbState.lastConnectionTime = new Date();
      
      console.log(`[${new Date().toISOString()}] Veritabanı bağlantısı başarıyla kuruldu: ${username} - ${process.env.DB_NAME}`);
    } catch (connError) {
      console.error('Veritabanı bağlantısı kurulurken hata:', connError);
      throw connError;
    }
    
    return dbState.db;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Veritabanı adı güncellenirken ciddi hata:`, error);
    dbState.isConnected = false;
    throw error;
  }
}

/**
 * Tüm PostgreSQL bağlantılarını tamamen sıfırlar
 */
export async function resetAllConnections() {
  try {
    console.log(`[${new Date().toISOString()}] TÜM BAĞLANTILAR SIFIRLANIYOR...`);
    
    // Mevcut db bağlantısını kapat
    if (dbState.db) {
      try {
        await dbState.db.end();
        console.log('Mevcut veritabanı bağlantısı kapatıldı');
      } catch (err) {
        console.error('Mevcut bağlantıyı kapatırken hata:', err);
      }
    }
    
    // Pool'daki tüm bağlantıları kapat
    try {
      await pgPool.end();
      console.log('PG Pool bağlantıları kapatıldı');
    } catch (err) {
      console.error('PG Pool bağlantılarını kapatırken hata:', err);
    }
    
    // Global değişkeni temizle
    dbState.db = null;
    dbState.isConnected = false;
    dbState.currentUser = null;
    
    // Garbage collection'ı zorlayalım (bu platform ve Node.js sürümüne bağlı olarak değişebilir)
    if (global.gc) {
      try {
        global.gc();
        console.log('Garbage collection zorlandı');
      } catch (err) {
        console.error('Garbage collection sırasında hata:', err);
      }
    }
    
    console.log('Tüm bağlantılar başarıyla kapatıldı ve bellek temizlendi');
  } catch (error) {
    console.error('Bağlantıları sıfırlarken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir veritabanı bağlantısı oluşturur
 * @returns {Promise<pg.Client>} Veritabanı bağlantısı
 */
export async function createConnection() {
  try {
    // Veritabanı bağlantı bilgileri
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };
    
    console.log('Bağlanılacak veritabanı bilgileri:', {
      host: dbConfig.host,
      user: dbConfig.user,
      // password gizlendi
      database: dbConfig.database,
      port: dbConfig.port
    });

    // Veritabanı bağlantı nesnesi
    const client = new pg.Client({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port,
    });

    // Veritabanına bağlanma (await ile bekle)
    await client.connect();
    console.log(`PostgreSQL veritabanına (${dbConfig.database}) bağlandı`);
    
    // Test sorgusu yap, veritabanı ismine eriş
    try {
      const result = await client.query('SELECT current_database() as db_name');
      console.log('Bağlanılan gerçek veritabanı adı:', result.rows[0].db_name);
    } catch (testError) {
      console.error('Test sorgusu hatası:', testError);
    }
    
    // Hata dinleyicisi ekle
    client.on('error', async (err) => {
      console.error('Veritabanı bağlantısında hata:', err);
      dbState.isConnected = false;
      // Yeniden bağlanma denemesi
      await reconnect();
    });
    
    return client;
  } catch (error) {
    console.error('Veritabanı bağlantısı kurulurken hata:', error);
    dbState.isConnected = false;
    throw error;
  }
}

/**
 * Mevcut bağlantıyı kapatır
 */
export async function closeConnection() {
  if (dbState.db) {
    try {
      await dbState.db.end();
      console.log('Veritabanı bağlantısı kapatıldı');
      dbState.isConnected = false;
      dbState.currentUser = null;
    } catch (error) {
      console.error('Veritabanı bağlantısı kapatılırken hata:', error);
    }
  }
}

/**
 * Bağlantı koptuğunda yeniden bağlanmayı dener
 */
export async function reconnect() {
  try {
    if (!dbState.isConnected && dbState.currentUser) {
      console.log(`Yeniden bağlanılıyor: ${dbState.currentUser}`);
      await updateDbNameByUsername(dbState.currentUser);
    }
  } catch (error) {
    console.error('Yeniden bağlanma hatası:', error);
  }
}

/**
 * Mevcut veritabanı bağlantısını döndürür veya yeni bir bağlantı oluşturur
 * @returns {Promise<pg.Client>} Veritabanı bağlantısı
 */
export async function getConnection() {
  if (!dbState.isConnected) {
    await reconnect();
  }
  return dbState.db;
}

// İlk bağlantıyı kur
try {
  dbState.db = await createConnection();
  dbState.isConnected = true;
} catch (error) {
  console.error('İlk bağlantı hatası:', error);
}

export default dbState.db;