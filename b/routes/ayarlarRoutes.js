import express from "express";
import {
  getAllAyarlar,
  getAyarById,
  updateAyarlar
} from "../controllers/ayarlarController.js";

const router = express.Router();

// Tüm ayarları getir
router.get("/", getAllAyarlar);

// ID'ye göre ayar getir
router.get("/:id", getAyarById);

// Ayarları güncelle (toplu güncelleme)
router.put("/", updateAyarlar);

export default router;