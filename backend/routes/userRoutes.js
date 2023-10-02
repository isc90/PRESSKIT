const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUserData, editUser, getProfile, getUserVcf } = require('../controllers/userControllers')
const { auth } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

// public
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile/:nickname', getProfile)
router.get('/vcf/:nickname', getUserVcf)

// private
router.get('/me', auth, getUserData)
router.post('/editMyInfo/:id', auth, upload.single('photo'), editUser)

module.exports = router
