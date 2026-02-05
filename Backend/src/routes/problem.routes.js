import express from 'express'
import {getPracticeProblems,getById,getByPlatform,getByCompany}  from '../controllers/problem.controller.js'
import { Protected } from '../middleware/auth.js'
const router=express.Router()

router.get('/practice',Protected,listProblems)
router.get('/practice/:id',Protected,getById)
router.get('/practice/platform/:platform',Protected,getByPlatform)
router.get('/practice/company/:company',Protected,getByCompany)

export default router