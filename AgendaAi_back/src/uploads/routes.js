import { Router } from "express";
import { uploadCompany, uploadSchedule } from "./upload.js";

const router = Router();

// Upload da imagem da empresa
router.post("/upload/company", uploadCompany.single("file"), (req, res) => {
  res.json({
    url: `/uploads/companies/${req.file.filename}`,
  });
});

// Upload da imagem de inspiração para agendamento
router.post("/upload/schedule", uploadSchedule.single("file"), (req, res) => {
  res.json({
    url: `/uploads/schedules/${req.file.filename}`,
  });
});

export default router;
