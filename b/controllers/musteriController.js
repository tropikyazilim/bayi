import { getConnection } from "../db.js";

export async function getAllMusteriler(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM musteri ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Müşteriler alınamadı: " + error.message });
  }
}

export async function getMusteriById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM musteri WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Müşteri alınamadı: " + error.message });
  }
}

export async function createMusteri(req, res) {
  const { unvan, yetkili, eposta, il, ilce, vergi_dairesi, vergi_no, tel, cep_tel, adres } = req.body;
  try {
    const connection = req.db || (await getConnection());
    const newMusteri = await connection.query(
      'INSERT INTO musteri ("unvan", "yetkili", "eposta", "il", "ilce", "vergi_dairesi", "vergi_no", "tel", "cep_tel", "adres") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [unvan, yetkili, eposta, il, ilce, vergi_dairesi, vergi_no, tel, cep_tel, adres]
    );
    res.status(201).json(newMusteri.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Müşteri kaydedilemedi: " + error.message });
  }
}

export async function getMusteriUnvan(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT id, unvan FROM musteri ORDER BY unvan");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Müşteri ünvanları alınamadı: " + error.message });
  }
}

export async function deleteMusteri(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("DELETE FROM musteri WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek müşteri bulunamadı" });
    }
    res.status(200).json({ message: "Müşteri başarıyla silindi", deletedMusteri: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Müşteri silinemedi: " + error.message });
  }
}

export async function updateMusteri(req, res) {
  const { unvan, yetkili, eposta, il, ilce, vergi_dairesi, vergi_no, tel, cep_tel, adres } = req.body;
  const { id } = req.params;
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE musteri SET "unvan" = $1, "yetkili" = $2, "eposta" = $3, "il" = $4, "ilce" = $5, "vergi_dairesi" = $6, "vergi_no" = $7, "tel" = $8, "cep_tel" = $9, "adres" = $10 WHERE id = $11 RETURNING *',
      [unvan, yetkili, eposta, il, ilce, vergi_dairesi, vergi_no, tel, cep_tel, adres, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek müşteri bulunamadı" });
    }
    res.status(200).json({ message: "Müşteri başarıyla güncellendi", updatedMusteri: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Müşteri güncellenemedi: " + error.message });
  }
}