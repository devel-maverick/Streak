import express from 'express'
import { getPracticeProblems, getById, getPracticeByPlatform, getByCompany, getCompanies } from '../controllers/problem.controller.js'
import { Protected } from '../middleware/auth.js'
const router = express.Router()

router.get('/companies', getCompanies)
router.get('/practice', getPracticeProblems)
router.get('/practice/:id', Protected, getById)
router.get('/practice/platform/:platform', Protected, getPracticeByPlatform)
router.get('/practice/company/:company', getByCompany)

export default router