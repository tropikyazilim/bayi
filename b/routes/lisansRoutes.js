import express from "express";
import {
  getAllLisanslar,
  getLisansById,
  createLisans,
  filterLisans,
  updateLisans // yeni eklendi
} from "../controllers/lisansController.js";

const router = express.Router();

router.get("/filter", filterLisans);
router.get("/", getAllLisanslar);
router.post("/", createLisans);
router.get("/:id", getLisansById);
router.put("/:id", updateLisans);

export default router;
