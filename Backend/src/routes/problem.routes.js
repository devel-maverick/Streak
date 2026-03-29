import express from 'express'
import { getPracticeProblems, getCompanyProblems } from '../controllers/problem.controller.js'
import { Protected, OptionalAuth } from '../middleware/auth.js'
const router = express.Router()


router.get('/companies/list', OptionalAuth, getCompanyProblems)
router.get('/practice', OptionalAuth, getPracticeProblems)



export default router