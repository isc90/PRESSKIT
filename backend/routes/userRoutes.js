const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserData, editUser, getProfile, getUserVcf } = require('../controllers/userControllers')

const { auth } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')
const { uploadImage } = require('../utils/cloudinary')

// public
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile/:nickname', getProfile)
router.get('/vcf/:nickname', getUserVcf)

// private
router.get('/me', auth, getUserData)
router.post('/editMyInfo/:id', auth, editUser)

router.post('/uploadProfilePicture', auth, upload.single('photo'), async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
  uploadImage(file.path)
})

module.exports = router
/**

try {
    await uploadProfilePicture(req, res, user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al cargar la foto de perfil' })
  }

 */
