import { Router } from "express";
import { Register, ListarContatos } from "../controllers/contato.controller.js";

export const routerCont = Router();

// Rota para salvar um novo contato
routerCont.post("/register", Register);

// 🆕 Rota para listar todos os contatos
routerCont.get("/", ListarContatos);
