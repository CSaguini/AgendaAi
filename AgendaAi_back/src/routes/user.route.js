import { Router } from "express"
import { GetUserById, Login, Register, requestPasswordReset, resetPassword, GetAllUsers, ToggleStatusUser  } from "../controllers/user.controller.js"

export const router = Router()

router.post("/register", Register)
router.post("/login", Login)
router.get("/get/:id", GetUserById)
router.post('/requestpasswordreset', requestPasswordReset);
router.post('/resetpassword', resetPassword);
router.get('/all', GetAllUsers);
router.patch('/Status/:id', ToggleStatusUser);
