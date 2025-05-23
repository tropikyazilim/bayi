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
 * Ayarları güncelle - birden fazla ayarı aynı anda güncelleyebilir
 */
export async function updateAyarlar(req, res) {    
  try {
    const updates = req.body;
    
    // Daha detaylı hata ayıklama logu    // İstek gövdesi kontrolü
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
      
      // Frontend'den gelen değeri doğrudan kullan (E veya H olarak gelir)
      const updateResult = await connection.query(
        'UPDATE parametreler SET "deger" = $1 WHERE parametreid = $2 RETURNING *',
        [deger, parametreid]
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