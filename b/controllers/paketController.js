import { getConnection } from "../db.js";

export async function getAllPaketler(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM paketler ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Paket bilgileri alınamadı: " + error.message });
  }
}

export async function getPaketById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM paketler WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Paket bulunamadı" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Paket alınamadı: " + error.message });
  }
}

export async function createPaket(req, res) {
  const { paket_adi, paket_kodu, paket_aciklama, items } = req.body;
  try {
    const connection = req.db || (await getConnection());
    const itemsJson = JSON.stringify(items);
    const newPaket = await connection.query(
      'INSERT INTO paketler ("paket_adi", "paket_kodu", "paket_aciklama", "paket_modul") VALUES ($1, $2, $3, $4) RETURNING *',
      [paket_adi, paket_kodu, paket_aciklama, itemsJson]
    );
    res.status(201).json(newPaket.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Paket kaydedilemedi: " + error.message });
  }
}

export async function getPaketAdi(req, res) {
  try {
    console.log("[getPaketAdi] Başladı");
    const connection = req.db || (await getConnection());
    console.log("[getPaketAdi] DB bağlantısı alındı:", !!connection);
    // Test sorgusu
    const test = await connection.query("SELECT 1+1 as test");
    console.log("[getPaketAdi] Test sorgusu sonucu:", test.rows);
    const result = await connection.query("SELECT id, paket_adi FROM paketler ORDER BY paket_adi");
    console.log("[getPaketAdi] Paketler sorgu sonucu:", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("[getPaketAdi] Hata:", error); // Hata detayını logla
    res.status(500).json({ message: "Paket adları alınamadı: " + error.message });
  }
}

export async function deletePaket(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("DELETE FROM paketler WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek paket bulunamadı" });
    }
    res.status(200).json({ message: "Paket başarıyla silindi", deletedPaket: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Paket silinemedi: " + error.message });
  }
}

export async function updatePaket(req, res) {
  const { paket_adi, paket_kodu, paket_aciklama, items } = req.body;
  const { id } = req.params;
  try {
    const connection = req.db || (await getConnection());
    const itemsJson = JSON.stringify(items);
    const result = await connection.query(
      'UPDATE paketler SET "paket_adi" = $1, "paket_kodu" = $2, "paket_aciklama" = $3, "paket_modul" = $4 WHERE id = $5 RETURNING *',
      [paket_adi, paket_kodu, paket_aciklama, itemsJson, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek paket bulunamadı" });
    }
    res.status(200).json({ message: "Paket başarıyla güncellendi", updatedPaket: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Paket güncellenemedi: " + error.message });
  }
}