import { Router } from "express";
import { GetAllServicesEntreprenuer, Register,  UpdateServiceEntreprenuer , DeleteServiceEntreprenuer } from "../controllers/services_entreprenuer.controller.js";

export const routerServicesEntreprenuer = Router()

routerServicesEntreprenuer.post("/register/:id", Register)
routerServicesEntreprenuer.get("/getall/:id", GetAllServicesEntreprenuer)
routerServicesEntreprenuer.put("/update/:serviceId", UpdateServiceEntreprenuer);
routerServicesEntreprenuer.delete("/delete/:serviceId", DeleteServiceEntreprenuer);