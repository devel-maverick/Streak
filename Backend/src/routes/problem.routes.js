import express from 'express'
import { getPracticeProblems, getById, getPracticeByPlatform, getByCompany } from '../controllers/problem.controller.js'
import { Protected } from '../middleware/auth.js'
const router = express.Router()

router.get('/practice', Protected, getPracticeProblems)
router.get('/practice/:id', Protected, getById)
router.get('/practice/platform/:platform', Protected, getPracticeByPlatform)
router.get('/practice/company/:company', Protected, getByCompany)

export default router