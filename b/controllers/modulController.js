import { getConnection } from "../db.js";

export async function getAllModuller(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM moduller ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Modül bilgileri alınamadı: " + error.message });
  }
}

export async function getModulById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM moduller WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Modül bulunamadı" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Modül alınamadı: " + error.message });
  }
}

export async function createModul(req, res) {
  const { modul_kodu, modul_adi, modul_aciklama } = req.body;
  try {
    const connection = req.db || (await getConnection());
    const newModul = await connection.query(
      'INSERT INTO moduller ("modul_kodu", "modul_adi", "modul_aciklama") VALUES ($1, $2, $3) RETURNING *',
      [modul_kodu, modul_adi, modul_aciklama]
    );
    res.status(201).json(newModul.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Modul kaydedilemedi: " + error.message });
  }
}

export async function deleteModul(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("DELETE FROM moduller WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek modül bulunamadı" });
    }
    res.status(200).json({ message: "Modül başarıyla silindi", deletedModule: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Modül silinemedi: " + error.message });
  }
}

export async function updateModul(req, res) {
  const { modul_kodu, modul_adi, modul_aciklama } = req.body;
  const { id } = req.params;
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE moduller SET "modul_kodu" = $1, "modul_adi" = $2, "modul_aciklama" = $3 WHERE id = $4 RETURNING *',
      [modul_kodu, modul_adi, modul_aciklama, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek modül bulunamadı" });
    }
    res.status(200).json({ message: "Modül başarıyla güncellendi", updatedModule: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Modül güncellenemedi: " + error.message });
  }
}