import express from 'express'
import { register, login, forgetPassword, resetPassword } from '../controllers/authControllers.js'


const router = express.Router()

router.post('/register',register)
router.post('/login', login)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', resetPassword)

export default router 