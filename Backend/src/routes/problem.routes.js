import express from 'express'
import { getPracticeProblems, getById, getPracticeByPlatform, getCompanyProblems } from '../controllers/problem.controller.js'
import { Protected, OptionalAuth } from '../middleware/auth.js'
const router = express.Router()


router.get('/companies/list', OptionalAuth, getCompanyProblems)
router.get('/practice', OptionalAuth, getPracticeProblems)
router.get('/practice/:id', Protected, getById)
router.get('/practice/platform/:platform', Protected, getPracticeByPlatform)


export default router