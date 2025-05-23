import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import db, {
  updateDbNameByUsername,
  getConnection,
  closeConnection,
} from "./db.js"; // Veritabanı bağlantısı ve fonksiyonları
import fs from "fs"; // File system modülünü ekledim
import bayiRoutes from "./routes/bayiRoutes.js";
import musteriRoutes from "./routes/musteriRoutes.js";
import lisansRoutes from "./routes/lisansRoutes.js";
import paketRoutes from "./routes/paketRoutes.js";
import modulRoutes from "./routes/modulRoutes.js";
import citiesRoutes from "./routes/citiesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ayarlarRoutes from "./routes/ayarlarRoutes.js";
import demolarRoutes from "./routes/demolarRoutes.js";
import { getAllLisanslar } from "./controllers/lisansController.js";

// .env dosyasını yükle
dotenv.config();

// __dirname değişkenini ESM için tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002; // Portu 3002 olarak değiştirdim

// Middleware
app.use(cors()); // CORS middleware eklendi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısı kontrolü için middleware
app.use(async (req, res, next) => {
  // API isteklerini kontrol et
  if (
    req.path.startsWith("/api/") &&
    req.path !== "/api/login" &&
    req.path !== "/api/logout" &&
    req.path !== "/api/db-status"
  ) {
    try {
      // Bağlantıyı kontrol et ve gerekirse yeniden bağlan
      console.log(
        `[${new Date().toISOString()}] API isteği: ${req.method} ${req.path}`
      );

      // İstek bilgilerini ve veritabanı durumunu kontrol et
      req.db = await getConnection();

      if (!req.db) {
        console.error(
          `[${new Date().toISOString()}] Veritabanı bağlantısı bulunamadı: ${
            req.method
          } ${req.path}`
        );
        return res.status(503).json({
          message:
            "Veritabanı bağlantısı bulunamadı. Lütfen tekrar giriş yapın.",
          error: "NO_DB_CONNECTION",
        });
      }

      // Veritabanı bağlantı durumunu kontrol et
      try {
        // Test sorgusu ile bağlantıyı kontrol et
        const testResult = await req.db.query(
          "SELECT current_database() as current_db"
        );
        console.log(
          `[${new Date().toISOString()}] API isteği için bağlantı kontrolü (${
            req.path
          }): Bağlantılı veritabanı = ${testResult.rows[0].current_db}`
        );
      } catch (testError) {
        console.error(
          `[${new Date().toISOString()}] Veritabanı bağlantı testi başarısız:`,
          testError
        );
        return res.status(500).json({
          message:
            "Veritabanı bağlantısı test edilemedi. Lütfen tekrar giriş yapın.",
          error: "DB_TEST_FAILED",
        });
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Veritabanı bağlantısı kontrolü sırasında hata:`,
        error
      );
      return res.status(500).json({
        message: "Veritabanı bağlantısı sağlanamadı",
        error: error.message,
      });
    }
  }
  next();
});

// İl ve ilçeleri getiren endpoint
app.get("/api/cities", (req, res) => {
  try {
    const citiesData = fs.readFileSync(
      path.join(__dirname, "data", "cities.json"),
      "utf8"
    );
    const parsedData = JSON.parse(citiesData);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("İl ve ilçe verileri alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "İl ve ilçe verileri alınamadı: " + error.message });
  }
});

// Bayi route'larını ekle
app.use("/api/bayiler", bayiRoutes);
app.use("/api/musteriler", musteriRoutes);
app.use("/api/lisanslar", lisansRoutes);
app.use("/api/paketler", paketRoutes);
app.use("/api/moduller", modulRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ayarlar", ayarlarRoutes);
app.get("/api/lisans", getAllLisanslar);
app.use("/api/demolar", demolarRoutes);

// Kullanıcı giriş endpoint'i
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Kullanıcı adı gereklidir" });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Kullanıcı giriş yapıyor: ${username}`
    );

    // Tüm veritabanı bağlantılarını sıfırla ve yeni bağlantı kur
    const updatedDb = await updateDbNameByUsername(username);

    console.log(
      `[${new Date().toISOString()}] ${username} kullanıcısı için veritabanı adı ayarlandı: ${
        process.env.DB_NAME
      }`
    );

    // Test sorgusu yap (bağlantıyı kontrol etmek için)
    try {
      const dbTest = await updatedDb.query(
        "SELECT current_database() as db_name"
      );
      console.log(
        `[${new Date().toISOString()}] Bağlantı testi başarılı, bağlı veritabanı: ${
          dbTest.rows[0].db_name
        }`
      );

      if (dbTest.rows[0].db_name !== process.env.DB_NAME) {
        console.error(
          `[${new Date().toISOString()}] UYARI: Bağlanılan veritabanı (${
            dbTest.rows[0].db_name
          }) beklenenden farklı (${process.env.DB_NAME})`
        );
      }
    } catch (testError) {
      console.error(
        `[${new Date().toISOString()}] Bağlantı testi başarısız:`,
        testError
      );
      throw new Error(
        "Veritabanı bağlantısı kontrolü başarısız: " + testError.message
      );
    }

    // Kullanıcı bilgilerini döndür
    res.status(200).json({
      message: "Veritabanı bağlantısı başarılı",
      user: {
        username: username,
      },
      database: process.env.DB_NAME,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Veritabanı bağlantısı sırasında hata:`,
      error
    );
    res
      .status(500)
      .json({ message: "Veritabanı bağlantısı sağlanamadı: " + error.message });
  }
});

// Kullanıcı çıkış endpoint'i
app.post("/api/logout", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Kullanıcı adı gereklidir" });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Kullanıcı çıkış yapıyor: ${username}`
    );

    // Tüm veritabanı bağlantılarını resetle
    const { resetAllConnections } = await import("./db.js");
    await resetAllConnections();

    console.log(
      `[${new Date().toISOString()}] ${username} kullanıcısı için tüm veritabanı bağlantıları kapatıldı ve bellek temizlendi`
    );

    res.status(200).json({
      message: "Başarıyla çıkış yapıldı",
      success: true,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Çıkış yapılırken hata oluştu:`,
      error
    );
    res.status(500).json({
      message: "Çıkış yapılamadı: " + error.message,
      success: false,
    });
  }
});

// Veritabanı durum kontrolü endpoint'i
app.get("/api/db-status", async (req, res) => {
  try {
    const connection = await getConnection();
    if (connection) {
      // Basit sorgu ile bağlantıyı test et
      await connection.query("SELECT 1");
      res.status(200).json({
        status: "connected",
        database: process.env.DB_NAME,
      });
    } else {
      res.status(200).json({
        status: "disconnected",
      });
    }
  } catch (error) {
    console.error("Veritabanı durum kontrolü sırasında hata:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Lisans aktif durumunu değiştiren endpoint
app.put("/api/lisanslar/:id/toggle-aktif", async (req, res) => {
  try {
    const { id } = req.params;
    const { aktif } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE lisans SET "aktif" = $1 WHERE id = $2 RETURNING *',
      [aktif, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }

    res.status(200).json({
      message: "Lisans aktif durumu başarıyla güncellendi",
      updatedLisans: result.rows[0],
    });
  } catch (error) {
    console.error("Lisans aktif durumu güncellenirken hata oluştu:", error);
    res.status(500).json({
      message: "Lisans aktif durumu güncellenemedi",
      error: error.message,
    });
  }
});

// Lisans kilit durumunu değiştiren endpoint
app.put("/api/lisanslar/:id/toggle-kilit", async (req, res) => {
  try {
    const { id } = req.params;
    const { kilit } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE lisans SET "kilit" = $1 WHERE id = $2 RETURNING *',
      [kilit, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }

    res.status(200).json({
      message: "Lisans kilit durumu başarıyla güncellendi",
      updatedLisans: result.rows[0],
    });
  } catch (error) {
    console.error("Lisans kilit durumu güncellenirken hata oluştu:", error);
    res.status(500).json({
      message: "Lisans kilit durumu güncellenemedi",
      error: error.message,
    });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

export default app;
