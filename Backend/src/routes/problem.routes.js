import express from 'express'
import {listProblems,getById,getByPlatform,getByCompany}  from '../controllers/problem.controller.js'
import { Protected } from '../middleware/auth.js'
const router=express.Router()

router.get('/',Protected,listProblems)
router.get('/:id',Protected,getById)
router.get('/platform/:platform',Protected,getByPlatform)
router.get('/company/:company',Protected,getByCompany)

export default router