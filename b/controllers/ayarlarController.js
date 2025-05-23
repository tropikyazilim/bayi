import { getConnection } from "../db.js";

/**
 * Tüm ayarları getir
 */
export async function getAllAyarlar(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM parametreler ORDER BY parametreid ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ayarlar alınırken hata:", error);
    res.status(500).json({ message: "Ayarlar alınamadı: " + error.message });
  }
}

/**
 * ID ile ayar getir
 */
export async function getAyarById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM parametreler WHERE parametreid = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ayar bulunamadı" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Ayar alınamadı: " + error.message });
  }
}

/**
 * Varsayılan ayarları getir
 * Bu fonksiyon, belirli bir parametre ID'si için varsayılan değerleri döndürür
 */
export async function getVarsayilanAyar(req, res) {
  try {
    const parametreId = req.params.id;
    const connection = req.db || (await getConnection());
    
    // Veritabanından varsayılan değeri oku
    const result = await connection.query(
      "SELECT * FROM parametreler WHERE parametreid = $1",
      [parametreId]
    );
    
    if (result.rows.length > 0) {
      // Veritabanında kayıt bulundu
      const parametre = result.rows[0];
      
      // Varsayılan değer alanındaki JSON veri
      let varsayilanDeger;
      try {
        // varsayilan_deger alanındaki JSON veriyi parse et
        // Eğer string ise JSON olarak parse et, değilse doğrudan kullan
        if (parametre.varsayilan_deger) {
          if (typeof parametre.varsayilan_deger === 'string') {
            varsayilanDeger = JSON.parse(parametre.varsayilan_deger);
          } else {
            varsayilanDeger = parametre.varsayilan_deger;
          }
          
          return res.status(200).json({
            parametreid: parseInt(parametreId),
            deger: varsayilanDeger,
            kayitzamani: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Varsayılan değer parse edilirken hata:", error);
      }
    }
    
    // Veritabanındaki varsayılan değer alınamadığında veya parse edilemediğinde,
    // kod içindeki varsayılan değerleri kullan (düşme ihtimaline karşı)
    if (parametreId === '4') {
      // Demolar tablosu için varsayılan tablo tasarımı
      const varsayilanTasarim = {
        columnSizing: {
          "firma_adi": 200,
          "adsoyad": 150,
          "telefon": 120,
          "email": 150,
          "il": 100,
          "aciklama": 150,
          "son_gorusme_tarihi": 140,
          "durum": 120,
          "bayi": 130,
          "notlar": 100,
          "actions": 80
        },
        columnVisibility: {}, // Tüm sütunlar görünür
        columnFilters: [],  // Filtre uygulanmamış
        sorting: [],        // Sıralama uygulanmamış
        columnOrder: [
          "firma_adi",
          "adsoyad",
          "telefon",
          "email",
          "il",
          "aciklama",
          "son_gorusme_tarihi",
          "durum",
          "bayi",
          "notlar",
          "actions"
        ]
      };
      
      return res.status(200).json({
        parametreid: 4,
        deger: varsayilanTasarim,
        kayitzamani: new Date().toISOString()
      });
    }
    
    // Diğer parametre türleri için varsayılan değerler
    return res.status(404).json({ 
      message: "Bu parametre için varsayılan değer tanımlanmamış" 
    });
  } catch (error) {
    console.error("Varsayılan ayar alınırken hata:", error);
    res.status(500).json({ 
      message: "Varsayılan ayar alınamadı: " + error.message 
    });
  }
}

/**
 * Ayarları güncelle - birden fazla ayarı aynı anda güncelleyebilir
 */
export async function updateAyarlar(req, res) {    
  try {
    const updates = req.body;
    
    // Daha detaylı hata ayıklama logu
    console.log("REQUEST BODY:", JSON.stringify(req.body, null, 2));
    console.log("REQUEST HEADERS:", JSON.stringify(req.headers, null, 2));
    
    // İstek gövdesi kontrolü
    if (!updates) {
      return res.status(400).json({ 
        message: "İstek gövdesi boş veya geçersiz"
      });
    }
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ 
        message: "Geçersiz veri formatı. Bir dizi gönderilmelidir.",
        receivedData: updates 
      });
    }
    const connection = req.db || (await getConnection());
    console.log("Gelen veri:", updates); // Gelen veriyi konsola yazdır
    const results = [];
      // Her ayar için bir güncelleme yap
    for (const ayar of updates) {      const { parametreid, deger } = ayar;
      console.log("İşlenen ayar:", {parametreid, deger}); // Her bir ayarı konsola yazdır
      
      if (!parametreid || deger === undefined) {
        return res.status(400).json({ 
          message: "Geçersiz ayar verisi. Her ayar için parametreid ve deger gereklidir.",
          invalidData: ayar 
        });
      }
    // JSONB için veri hazırlama
      let jsonbValue;
      
      try {
        // Eğer string ise ve JSON formatında ise parse et, değilse direk kullan
        if (typeof deger === 'string') {
          // Basit değerler için tırnak içine alarak JSON formatına çevir
          if (deger === "E" || deger === "H" || !isNaN(deger)) {
            // E, H gibi enum değerleri veya sayısal değerleri JSON string olarak sakla
            jsonbValue = JSON.stringify(deger);
          } else {
            // Halihazırda JSON string ise direk olarak kullan
            try {
              JSON.parse(deger); // Test için parse et
              jsonbValue = deger; // Geçerli bir JSON ise direk kullan
            } catch {
              // JSON değilse string olarak sakla
              jsonbValue = JSON.stringify(deger);
            }
          }
        } else {
          // String olmayan değerleri JSON string'e çevir
          jsonbValue = JSON.stringify(deger);
        }
          console.log("JSONB için hazırlanan değer:", jsonbValue);
      } catch (error) {
        console.error("JSON dönüşüm hatası:", error);
        // Hata durumunda en güvenli seçenek - string olarak sakla
        jsonbValue = JSON.stringify(String(deger));
      }
      
      // İşlenmiş JSONB değerini kullan
      const updateResult = await connection.query(
        'UPDATE parametreler SET "deger" = $1::jsonb, "kayitzamani" = CURRENT_TIMESTAMP WHERE parametreid = $2 RETURNING *',
        [jsonbValue, parametreid]
      );
      
      if (updateResult.rows.length > 0) {
        results.push(updateResult.rows[0]);
      }
    }
    
    res.status(200).json({
      message: "Ayarlar başarıyla güncellendi", 
      updatedCount: results.length,
      updatedAyarlar: results
    });  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error);
    
    // Daha detaylı hata bilgileri logla
    console.error("Hata detayları:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      body: req.body
    });
    
    // İstemciye anlamlı hata mesajı gönder
    res.status(500).json({ 
      message: "Ayarlar güncellenirken hata: " + error.message,
      error: error.toString(),
      errorDetail: error.detail,
      errorCode: error.code
    });
  }
}