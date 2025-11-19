import { Router } from "express";
import { listUsers, deleteUser } from "../controllers/admin.controller.js";
import { authorize } from "../utils/authorize.js";
import { authMiddleware } from "../utils/authMiddleware.js";
import { requireRole } from "../middlewares/role.js"; 

export const routerAdmin = Router();

routerAdmin.get("/admin", authMiddleware, requireRole("admin"), controller)

