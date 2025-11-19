import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função reutilizável de storage
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "uploads", folder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, fileName);
    },
  });

// Dois uploads diferentes
export const uploadCompany = multer({ storage: storage("entreprenuer") });
export const uploadSchedule = multer({ storage: storage("schedules") });
