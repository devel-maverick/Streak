import express from 'express'
import { run } from '../controllers/playground.controller.js'

const router = express.Router()

router.post('/run', run)

export default router