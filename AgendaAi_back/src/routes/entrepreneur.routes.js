import { Router } from "express"
import { AllEntrepreneur, Delete, Register, GetEntreprenuerById, UpdateEntreprenuer, ToggleStatusEntrepreneur, SearchEntrepreneurByName} from "../controllers/entrepreneur.controller.js"
import { authorize } from "../utils/authorize.js"

export const routerEnt = Router()

routerEnt.post("/register/:userId", Register, authorize('entrepreneur'))
routerEnt.delete("/delete/:id", Delete, authorize('entrepreneur'))
routerEnt.get("/entreprenuers", AllEntrepreneur)
routerEnt.get("/entrepreneur/:id", GetEntreprenuerById)
routerEnt.patch("/update/:id", UpdateEntreprenuer)
routerEnt.patch("/status/:id", ToggleStatusEntrepreneur)
routerEnt.get("/search", SearchEntrepreneurByName)