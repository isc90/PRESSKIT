const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserData } = require('../controllers/userControllers') // controladores

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/getMe', getUserData)

module.exports = router
