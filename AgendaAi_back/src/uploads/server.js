import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Para servir imagens estáticas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Para permitir JSON
app.use(express.json());

// Rotas
app.use("/api", routes);

app.listen(3000, () => console.log("Server rodando na porta 3000"));
