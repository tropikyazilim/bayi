import express from "express";
import { createDemo, getAllDemolar, updateDurum, getDemoById, updateDemo } from "../controllers/demolarController.js"; 

const router = express.Router();

router.get("/", getAllDemolar);
router.get("/:id", getDemoById);
router.post("/", createDemo);
router.patch('/:id/durum', updateDurum);
router.put("/:id", updateDemo);

export default router;
