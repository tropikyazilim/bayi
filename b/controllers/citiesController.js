import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getCities(req, res) {
  try {
    const citiesData = fs.readFileSync(path.join(__dirname, "../data/cities.json"), "utf8");
    const parsedData = JSON.parse(citiesData);
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).json({ message: "İl ve ilçe verileri alınamadı: " + error.message });
  }
}