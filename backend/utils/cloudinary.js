// Require the cloudinary library
const cloudinary = require('cloudinary').v2
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config()
const asyncHandler = require('express-async-handler')

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Log the configuration
// console.log(cloudinary.config())

/// //////////////////////
// Uploads an image file
/// //////////////////////
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true
  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options)
    const imgUrl = result.url
    console.log(imgUrl)
    return imgUrl
  } catch (error) {
    console.error(error)
  }
}

const getAssetInfo = async (publicId) => {
  // Return colors in the response
  const options = {
    colors: true
  }

  try {
    // Get details about the asset
    const result = await cloudinary.api.resource(publicId, options)
    console.log(result.url)
    return result
  } catch (error) {
    console.error(error)
  }
}

/// ///////////////////////////////////////////////////////////
// Creates an HTML image tag with a transformation that
// results in a circular thumbnail crop of the image
// focused on the faces, applying an outline of the
// first color, and setting a background of the second color.
/// ///////////////////////////////////////////////////////////

const createImageTag = (publicId, ...colors) => {
  // Set the effect color and background color
  const [effectColor, backgroundColor] = colors

  // Create an image tag with transformations applied to the src URL
  const imageTag = cloudinary.image(publicId, {
    transformation: [
      { width: 400, height: 400, gravity: 'faces', crop: 'thumb' },
      { radius: 'max' },
      { effect: 'outline:10', color: effectColor },
      { background: backgroundColor }
    ]
  })
  console.log(imageTag)
  return imageTag
}

/// ///////////////
//
// Main function
//
/// ///////////////
const userImageUpload = asyncHandler(async (file) => {
  // Set the image to upload
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: true
    })
    // Obtener la URL de la imagen de la respuesta de Cloudinary
    const imageUrl = result.secure_url

    // Log the image URL to the console

    console.log(imageUrl)

    // Devolver la URL de la imagen
    return imageUrl
  } catch (error) {
    console.error(error)
    throw new Error('Error uploading image')
  }
})

module.exports = {
  userImageUpload,
  createImageTag,
  uploadImage,
  getAssetInfo
}
