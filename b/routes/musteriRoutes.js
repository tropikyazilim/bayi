import express from "express";
import {
  getAllMusteriler,
  getMusteriById,
  createMusteri,
  getMusteriUnvan,
  deleteMusteri,
  updateMusteri
} from "../controllers/musteriController.js";

const router = express.Router();

// Müşteri unvanları (önce tanımlanmalı)
router.get("/unvan", getMusteriUnvan);
router.get("/", getAllMusteriler);
router.get("/:id", getMusteriById);
router.post("/", createMusteri);
router.put("/:id", updateMusteri);
router.delete("/:id", deleteMusteri);

export default router;
