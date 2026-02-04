import { Login, Register, Logout, Me } from "../controllers/auth.controller.js"
import { Protected } from "../middleware/auth.js"
import express from "express"
const router = express.Router()

router.post('/register', Register)
router.post('/login', Login)
router.post('/logout', Protected, Logout)
router.get('/me', Protected, Me)

export default router;