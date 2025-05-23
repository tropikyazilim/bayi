import express from "express";
import {
  getAllModuller,
  getModulById,
  createModul,
  deleteModul,
  updateModul
} from "../controllers/modulController.js";

const router = express.Router();

router.get("/", getAllModuller);
router.get("/:id", getModulById);
router.post("/", createModul);
router.delete("/:id", deleteModul);
router.put("/:id", updateModul);

export default router;
