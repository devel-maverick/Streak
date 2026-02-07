import express from 'express'
import {run,save,getDraft} from '../controllers/playground.controller.js'
import { Protected } from '../middleware/auth.js'

const router=express.Router()

router.post('/run',Protected,run)
router.post('/save',Protected,save)
router.get('/:problemId',Protected,getDraft)

export default router