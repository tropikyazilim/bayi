import express from "express";
import { getCities } from "../controllers/citiesController.js";

const router = express.Router();

router.get("/", getCities);

export default router;
