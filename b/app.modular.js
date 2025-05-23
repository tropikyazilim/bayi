import express from "express";
import bayiRoutes from "./routes/bayiRoutes.js";

const app = express();

// ...existing middleware and config...

// Bayi route'larını ekle
app.use("/api/bayiler", bayiRoutes);

// ...diğer route'lar ve sunucu başlatma kodu...

export default app;
