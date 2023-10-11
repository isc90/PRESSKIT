const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUserData, editUser, getProfile, getUserVcf, obtainPathVcf, obtainPathQRCode } = require('../controllers/userControllers')
const { auth } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

// public
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile/:nickname', getProfile)
router.get('/vcf/:nickname', getUserVcf)
router.get('/qr/:nickname', obtainPathQRCode)
router.get('/vcf/:nickname', obtainPathVcf)

// private
router.get('/me', auth, getUserData)
router.post('/editMyInfo/:id', auth, editUser)

router.post('/uploadProfilePicture', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' })
    }

    const user = req.user
    user.photo = req.file.path
    await user.save()

    res.json({ photo: user.photo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar y guardar la imagen' })
  }
})

module.exports = router
