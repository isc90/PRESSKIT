const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserData, editUser } = require('../controllers/userControllers') // controladores

const { auth } = require('../middleware/authMiddleware')

// public
router.post('/register', registerUser)
router.post('/login', loginUser)

// private
router.get('/myInfo', auth, getUserData)
router.post('/editMyInfo/:id', auth, editUser)

module.exports = router
