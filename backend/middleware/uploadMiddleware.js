const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define la carpeta de destino para los archivos subidos
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Define el nombre del archivo cuando se guarda en el servidor
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

module.exports = {
  upload
}
