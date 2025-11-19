import express from 'express';
import { GetDisponibilidade, CreateAgendamento } from '../controllers/agendamentoController.js';

const router = express.Router();

// Rota para buscar disponibilidade de um serviço
router.get('/disponibilidade/:serviceId', GetDisponibilidade); 
// Rota para criar um novo agendamento
router.post('/agendamento', CreateAgendamento); // Sugestão de rota: /api/agendamento

export default router;