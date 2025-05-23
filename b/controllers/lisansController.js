import { getConnection } from "../db.js";

export async function getAllLisanslar(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM lisans ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Lisans alınamadı: " + error.message });
  }
}

export async function getLisansById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM lisans WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Lisans alınamadı: " + error.message });
  }
}

export async function filterLisans(req, res) {
  try {
    const connection = req.db || (await getConnection());
    // Filtre parametrelerini al
    const {
      bayi_adi,
      musteri_adi,
      paket_adi,
      yetkili,
      aktif,
      kilit,
      is_demo,
      lisans_kodu, // yeni parametre
      lisans, // yeni parametre (frontendden gelebilir)
      il, // yeni il arama parametresi
    } = req.query;
    let query = "SELECT * FROM lisans WHERE 1=1";
    let params = [];    function turkishToLower(str) {
      if (!str) return ""; // Null/undefined kontrolü
      
      // String kontrolü
      if (typeof str !== 'string') {
        str = String(str);
      }
      
      // Önce özel Türkçe karakterleri dönüştür sonra küçült
      return str
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .replace(/Ş/g, "ş")
        .replace(/Ğ/g, "ğ")
        .replace(/Ü/g, "ü")
        .replace(/Ö/g, "ö")
        .replace(/Ç/g, "ç")
        .toLowerCase()
        // Normalize edilmiş karakterleri tekrar kontrol et (i with dot hatası düzeltmesi)
        .replace(/i̇/g, "i");
    }    // PostgreSQL için geliştirilmiş Türkçe karakter dönüşüm fonksiyonu
    function turkishToLowerSql(column) {
      return `LOWER(
        TRANSLATE(
          ${column},
          'İIŞĞÜÖÇABCDEFGHJKLMNOPQRSTUVWXYZ',
          'iışğüöçabcdefghjklmnopqrstuvwxyz'
        )
      )`;
    }

    if (bayi_adi) {
      // Türkçe karakterleri doğru şekilde küçültüp arama yapalım
      params.push(`%${turkishToLower(bayi_adi)}%`);
      // Veritabanında direkt ILIKE ile aramak daha iyi sonuç verecek
      query += ` AND ${turkishToLowerSql('"bayi_adi"')} ILIKE $${
        params.length
      }`;
    }
    if (musteri_adi) {
      params.push(`%${turkishToLower(musteri_adi)}%`);
      query += ` AND ${turkishToLowerSql('"musteri_adi"')} ILIKE $${
        params.length
      }`;
    }
    if (paket_adi) {
      params.push(`%${turkishToLower(paket_adi)}%`);
      query += ` AND ${turkishToLowerSql('"paket_adi"')} ILIKE $${
        params.length
      }`;
    }
    if (yetkili) {
      params.push(`%${turkishToLower(yetkili)}%`);
      query += ` AND ${turkishToLowerSql('"yetkili"')} ILIKE $${params.length}`;
    }
    if (aktif !== undefined) {
      params.push(aktif === "true");
      query += ` AND "aktif" = $${params.length}`;
    }
    if (kilit !== undefined) {
      params.push(kilit === "true");
      query += ` AND "kilit" = $${params.length}`;
    }
    if (is_demo !== undefined) {
      params.push(is_demo === "true");
      query += ` AND "is_demo" = $${params.length}`;
    }    // Genel arama (filtering) parametresi için geliştirilmiş destek
    if (req.query.filtering) {
      // Orijinal arama terimi ve normalizasyon
      let searchTerm = turkishToLower(req.query.filtering);
      params.push(`%${searchTerm}%`);
      
      // Alternatif ASCII karşılığı (Türkçe karakterleri ASCII'ye çevirelim)
      const asciiSearchTerm = searchTerm
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
      
      // ASCII versiyonu için yeni bir parametre ekleyelim
      params.push(`%${asciiSearchTerm}%`);

      // İki arama türünü birleştiren daha kapsamlı bir sorgu
      query += ` AND (
        -- Orijinal terim araması
        (${turkishToLowerSql('"lisans_kodu"')} ILIKE $${params.length - 1} OR
        ${turkishToLowerSql('"musteri_adi"')} ILIKE $${params.length - 1} OR
        ${turkishToLowerSql('"bayi_adi"')} ILIKE $${params.length - 1} OR
        ${turkishToLowerSql('"paket_adi"')} ILIKE $${params.length - 1} OR
        ${turkishToLowerSql('"yetkili"')} ILIKE $${params.length - 1})
        
        OR
        
        -- ASCII dönüşümü yapılmış terim araması (Özellikle "ğ", "ş" vb. karakterli aramamalarda)
        (${turkishToLowerSql('"lisans_kodu"')} ILIKE $${params.length} OR
        ${turkishToLowerSql('"musteri_adi"')} ILIKE $${params.length} OR
        ${turkishToLowerSql('"bayi_adi"')} ILIKE $${params.length} OR
        ${turkishToLowerSql('"paket_adi"')} ILIKE $${params.length} OR
        ${turkishToLowerSql('"yetkili"')} ILIKE $${params.length})
      )`;
    }
    // lisans_kodu veya lisans parametresi ile arama desteği
    const lisansKodParam = lisans_kodu || lisans;
    if (lisansKodParam) {
      params.push(`%${lisansKodParam}%`);
      query += ` AND "lisans_kodu" ILIKE $${params.length}`;
    } // İl araması için özel JOIN sorgusunu kuralım
    if (il) {
      // Türkçe karakterleri düzenleyerek il parametresini ekleyelim
      const ilLower = turkishToLower(il);

      // Tamamen farklı bir sorgu oluşturalım (birleştirme yapmak yerine)
      query = `
        SELECT DISTINCT l.* 
        FROM lisans l
        LEFT JOIN bayiler b ON l.bayi_adi = b.unvan
        LEFT JOIN musteri m ON l.musteri_adi = m.unvan
        WHERE 1=1
      `;

      // Önceki WHERE koşullarını tekrar ekleyelim
      let whereParams = [];

      if (bayi_adi) {
        whereParams.push(`%${turkishToLower(bayi_adi)}%`);
        query += ` AND ${turkishToLowerSql("l.bayi_adi")} ILIKE $${
          whereParams.length
        }`;
      }
      if (musteri_adi) {
        whereParams.push(`%${turkishToLower(musteri_adi)}%`);
        query += ` AND ${turkishToLowerSql("l.musteri_adi")} ILIKE $${
          whereParams.length
        }`;
      }
      if (paket_adi) {
        whereParams.push(`%${turkishToLower(paket_adi)}%`);
        query += ` AND ${turkishToLowerSql("l.paket_adi")} ILIKE $${
          whereParams.length
        }`;
      }
      if (yetkili) {
        whereParams.push(`%${turkishToLower(yetkili)}%`);
        query += ` AND ${turkishToLowerSql("l.yetkili")} ILIKE $${
          whereParams.length
        }`;
      }
      if (aktif !== undefined) {
        whereParams.push(aktif === "true");
        query += ` AND l.aktif = $${whereParams.length}`;
      }
      if (kilit !== undefined) {
        whereParams.push(kilit === "true");
        query += ` AND l.kilit = $${whereParams.length}`;
      }
      if (is_demo !== undefined) {
        whereParams.push(is_demo === "true");
        query += ` AND l.is_demo = $${whereParams.length}`;
      }
      if (lisansKodParam) {
        whereParams.push(`%${lisansKodParam}%`);
        query += ` AND l.lisans_kodu ILIKE $${whereParams.length}`;
      } // İl arama kriterini ekleyelim - Parametre numaralarını doğru bir şekilde kullan
      whereParams.push(`%${ilLower}%`);
      const ilParamIndex = whereParams.length; // Parametrenin indeks değerini kaydet
      whereParams.push(`%${ilLower}%`); // Aynı değer ikinci kez eklenir, ama farklı bir parametre olarak
      query += ` AND (${turkishToLowerSql("b.il")} ILIKE $${ilParamIndex} 
                 OR ${turkishToLowerSql("m.il")} ILIKE $${whereParams.length})`;

      // Sıralama ekleyelim
      query += " ORDER BY l.id DESC";

      // Parametreleri güncelleyelim
      params = whereParams;
    } else {
      // İl araması yoksa normal sıralama ekleyelim
      query += " ORDER BY id DESC";
    } // Debug için sorguyu logla
    console.log("SQL sorgusu:", query);
    console.log("Parametreler:", params);
    console.log("İl filtresi kullanıldı mı:", il ? "Evet" : "Hayır");
    let result;
    try {
      result = await connection.query(query, params);
      console.log(`Sorgu sonucu: ${result.rows.length} kayıt bulundu`);
    } catch (dbError) {
      console.error("SQL sorgusu çalıştırılırken hata:", dbError);
      throw dbError;
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Lisans filtreleme hatası:", error);

    // Daha detaylı hata mesajı
    let errorDetails = {
      message: "Lisans filtreleme hatası: " + error.message,
      stack: error.stack,
    };

    // İl filtresi için özel hata log'u
    if (il) {
      console.error("İl filtresi ile ilgili hata olabilir:", il);
    }

    res.status(500).json(errorDetails);
  }
}

export async function createLisans(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const {
      aktif,
      kilit,
      is_demo,
      lisans_kodu,
      yetkili,
      bayi_adi,
      musteri_adi,
      paket_adi,
      kullanici_sayisi,
      lisans_suresi,
      items, // Modül listesi olabilir
    } = req.body; // Console logging the received data for debugging
    console.log("Lisans ekleme verileri alındı:", req.body);

    // Converting items array to string if it exists
    const itemsJson = items ? JSON.stringify(items) : null;

    const result = await connection.query(
      `INSERT INTO lisans 
       (aktif, kilit, is_demo, lisans_kodu, yetkili, bayi_adi, musteri_adi, paket_adi,
        kullanici_sayisi, lisans_suresi, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        aktif,
        kilit,
        is_demo,
        lisans_kodu,
        yetkili,
        bayi_adi,
        musteri_adi,
        paket_adi,
        kullanici_sayisi || 1, // Default to 1 if not provided
        lisans_suresi || 0, // Default to 0 if not provided
        itemsJson, // Store items as JSON string
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Lisans oluşturma hatası:", error);
    console.error("Detaylı hata bilgisi:", {
      message: error.message,
      detail: error.detail,
      hint: error.hint,
      constraint: error.constraint,
      table: error.table,
      column: error.column,
    });
    res.status(500).json({
      message: "Lisans oluşturma hatası: " + error.message,
      detail: error.detail,
      stack: error.stack,
      error: error,
    });
  }
}

export async function updateLisans(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const id = req.params.id;
    const {
      aktif,
      kilit,
      is_demo,
      lisans_kodu,
      yetkili,
      bayi_adi,
      musteri_adi,
      paket_adi,
      kullanici_sayisi,
      lisans_suresi,
      items,
    } = req.body;

    // Items dizisini JSON formatına dönüştür
    const itemsJson = items ? JSON.stringify(items) : null;

    const result = await connection.query(
      `UPDATE lisans
       SET aktif = $1, 
           kilit = $2, 
           is_demo = $3, 
           lisans_kodu = $4, 
           yetkili = $5,
           bayi_adi = $6,
           musteri_adi = $7,
           paket_adi = $8,
           kullanici_sayisi = $9,
           lisans_suresi = $10,
           items = $11
       WHERE id = $12
       RETURNING *`,
      [
        aktif,
        kilit,
        is_demo,
        lisans_kodu,
        yetkili,
        bayi_adi,
        musteri_adi,
        paket_adi,
        kullanici_sayisi || 1,
        lisans_suresi || 0,
        itemsJson,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Lisans güncelleme hatası:", error);
    res.status(500).json({
      message: "Lisans güncelleme hatası: " + error.message,
      stack: error.stack,
      error: error,
    });
  }
}
