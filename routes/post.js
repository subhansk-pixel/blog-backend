import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { createPost, getPosts, getPost, deletePost } from '../controllers/postControllers.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', verifyToken, upload.single('image'), createPost)
router.delete('/:id', verifyToken, deletePost)

export default router