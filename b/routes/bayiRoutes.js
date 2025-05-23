import express from "express";
import {
  getAllBayiler,
  getBayiById,
  getBayiUnvan,
  createBayi,
  updateBayi,
  filterBayiler
} from "../controllers/bayiController.js";

const router = express.Router();

// Bayi unvanları (önce tanımlanmalı)
router.get("/unvan", getBayiUnvan);
// Bayileri filtreleme
router.get("/filter", filterBayiler);
// Bayi listesi
router.get("/", getAllBayiler);
// Bayi id ile
router.get("/:id", getBayiById);
// Bayi ekle
router.post("/", createBayi);
// Bayi güncelle
router.put("/:id", updateBayi);

export default router;
