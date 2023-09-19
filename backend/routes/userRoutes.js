const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserData, editUser, getProfile } = require('../controllers/userControllers') // controladores

const { auth } = require('../middleware/authMiddleware')

// public
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile/:nickname', getProfile)

// private
router.get('/me', auth, getUserData)
router.post('/editMyInfo/:id', auth, editUser)

module.exports = router
