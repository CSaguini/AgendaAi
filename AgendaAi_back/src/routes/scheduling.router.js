import { Router } from "express";
import { 
  getAvailableHours,
  createScheduling,
  getUserSchedulings,
  getServiceSchedulings,
  cancelScheduling
} from "../controllers/scheduling.controller.js";

export const schedulingRouter = Router();

// Horários disponíveis
schedulingRouter.get("/available/:serviceId", getAvailableHours);

// Criar agendamento
schedulingRouter.post("/create", createScheduling);

// Agendamentos do usuário
schedulingRouter.get("/user/:userId", getUserSchedulings);

// Agendamentos de um serviço
schedulingRouter.get("/service/:serviceId", getServiceSchedulings);

// Cancelar
schedulingRouter.delete("/cancel/:id", cancelScheduling);
