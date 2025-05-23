import express from "express";
import {
  getAllPaketler,
  getPaketById,
  createPaket,
  getPaketAdi,
  deletePaket,
  updatePaket
} from "../controllers/paketController.js";

const router = express.Router();

router.get("/paket_adi", getPaketAdi);
router.get("/", getAllPaketler);
router.get("/:id", getPaketById);
router.post("/", createPaket);
router.delete("/:id", deletePaket);
router.put("/:id", updatePaket);

export default router;
