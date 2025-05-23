import { getConnection } from "../db.js";

// Tüm bayileri getir
export const getAllBayiler = async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM bayiler ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Bayiler alınırken hata oluştu:", error);
    res.status(500).json({ message: "Bayiler alınamadı: " + error.message });
  }
};

// Bayileri filtrele
export const filterBayiler = async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const { bayi_kodu, unvan, firma_sahibi } = req.query;

    // Dinamik olarak WHERE şartları oluştur
    let queryText = "SELECT * FROM bayiler WHERE 1=1";
    const queryParams = [];
    let paramCount = 1;

    if (bayi_kodu) {
      queryText += ` AND bayi_kodu ILIKE $${paramCount}`;
      queryParams.push(`%${bayi_kodu}%`);
      paramCount++;
    }

    if (unvan) {
      queryText += ` AND unvan ILIKE $${paramCount}`;
      queryParams.push(`%${unvan}%`);
      paramCount++;
    }

    if (firma_sahibi) {
      queryText += ` AND firma_sahibi ILIKE $${paramCount}`;
      queryParams.push(`%${firma_sahibi}%`);
      paramCount++;
    }

    // Sıralama ekle
    queryText += " ORDER BY id DESC";

    const result = await connection.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Bayiler filtrelenirken hata oluştu:", error);
    res.status(500).json({ message: "Bayiler filtrelenirken hata: " + error.message });
  }
};

// ID ile bayi getir
export const getBayiById = async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM bayiler WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("İlgi idye sahip bayi yok!:", error);
    res.status(500).json({ message: "Bayi alınamadı: " + error.message });
  }
};

// Bayi unvanları
export const getBayiUnvan = async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT id, unvan FROM bayiler ORDER BY unvan"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Bayi unvanları alınırken hata oluştu:", error);
    res.status(500).json({ message: "Bayi unvanları alınamadı: " + error.message });
  }
};

// Bayi ekle
export const createBayi = async (req, res) => {
  const {
    bayi_kodu,
    bayi_sifre,
    unvan,
    firma_sahibi,
    bayi_tipi,
    il,
    ilce,
    adres,
    eposta,
    telefon,
    cep_telefon,
    sorumlu_kisi,
    ust_bayi,
  } = req.body;

  if (!bayi_kodu || !bayi_sifre) {
    return res.status(400).json({ message: "Bayi kodu ve şifre gereklidir" });
  }

  try {
    const connection = req.db || (await getConnection());
    const newBayi = await connection.query(
      'INSERT INTO bayiler ("bayi_kodu", "bayi_sifre", "unvan", "firma_sahibi", "bayi_tipi", "il", "ilce", "adres", "eposta", "telefon", "cep_telefon", "sorumlu_kisi", "ust_bayi") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        bayi_kodu,
        bayi_sifre,
        unvan,
        firma_sahibi,
        bayi_tipi,
        il,
        ilce,
        adres,
        eposta,
        telefon,
        cep_telefon,
        sorumlu_kisi,
        ust_bayi,
      ]
    );
    res.status(201).json(newBayi.rows[0]);
  } catch (error) {
    console.error("Bayi kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Bayi kaydedilemedi: " + error.message });
  }
};

// Bayi güncelle
export const updateBayi = async (req, res) => {
  const {
    bayi_kodu,
    bayi_sifre,
    unvan,
    firma_sahibi,
    bayi_tipi,
    il,
    ilce,
    adres,
    eposta,
    telefon,
    cep_telefon,
    sorumlu_kisi,
    ust_bayi
  } = req.body;
  const { id } = req.params;
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE bayiler SET "bayi_kodu" = $1, "bayi_sifre" = $2, "unvan" = $3, "firma_sahibi" = $4, "bayi_tipi" = $5, "il" = $6, "ilce" = $7, "adres" = $8, "eposta" = $9, "telefon" = $10, "cep_telefon" = $11, "sorumlu_kisi" = $12, "ust_bayi" = $13 WHERE id = $14 RETURNING *',
      [
        bayi_kodu,
        bayi_sifre,
        unvan,
        firma_sahibi,
        bayi_tipi,
        il,
        ilce,
        adres,
        eposta,
        telefon,
        cep_telefon,
        sorumlu_kisi,
        ust_bayi,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek bayi bulunamadı" });
    }
    res.status(200).json({ message: "Bayi başarıyla güncellendi", updatedBayi: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Bayi güncellenemedi: " + error.message });
  }
};
