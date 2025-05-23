import { getConnection } from "../db.js";


export async function createDemo(req, res) {
  const { firma_adi, adsoyad, telefon, email, il, aciklama, kvkk, ip     } = req.body;
  try {
    const connection = req.db || (await getConnection());
    const newDemo = await connection.query(
      'INSERT INTO demotalep ("firma_adi", "adsoyad", "telefon","email", "il", "aciklama", "kvkk", "ip"  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [firma_adi, adsoyad, telefon, email, il, aciklama, kvkk, ip]  
    );
    res.status(201).json(newDemo.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Modul kaydedilemedi: " + error.message });
  }
}

export async function getAllDemolar(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM demotalep ORDER BY id desc");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Demo bilgileri alınamadı: " + error.message });
  }
}
//demoları idye göre getiren kardeşimiz
export async function getDemoById(req, res) {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query("SELECT * FROM demotalep WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Demo bulunamadı" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Demo alınamadı: " + error.message });
  }
}

//demoduzenleme idye göre put
export async function updateDemo(req, res) {
  const { firma_adi, adsoyad, telefon, email, il, aciklama, ip, secilen_tarih } = req.body;
  const { id } = req.params;  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE demotalep SET "firma_adi" = $1, "adsoyad" = $2, "telefon" = $3,"email" = $4,"il" = $5, "aciklama" = $6,"ip" = $7,"son_gorusme_tarihi" = $8 WHERE id = $9 RETURNING *',
      [firma_adi, adsoyad, telefon, email, il, aciklama, ip, secilen_tarih, id] 
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek demo bulunamadı" });
    }
    res.status(200).json({ message: "demo başarıyla güncellendi", updatedModule: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "demo güncellenemedi: " + error.message });
  }
}

// Durum güncelleme fonksiyonu
export async function updateDurum(req, res) {
  try {
    const { id } = req.params;
    const { durum } = req.body;
    
    if (!durum) {
      return res.status(400).json({ message: 'Durum bilgisi gereklidir' });
    }
    
    // Durum değerini kontrol et (opsiyonel güvenlik)
    const gecerliDurumlar = ["Bekliyor", "Görüşüldü", "Reddedildi", "Onaylandı"];
    if (!gecerliDurumlar.includes(durum)) {
      return res.status(400).json({ message: 'Geçersiz durum değeri' });
    }
    
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE demotalep SET durum = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [durum, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Demo bulunamadı' });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Demo durumu başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    res.status(500).json({ 
      message: 'Durum güncellenirken bir hata oluştu',
      error: error.message 
    });
  }
}