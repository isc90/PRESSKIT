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
    // console.log(result)
    return result.public_id
  } catch (error) {
    console.error(error)
  }
}

/// //////////////////////////////////
// Gets details of an uploaded image
/// //////////////////////////////////
const getAssetInfo = async (publicId) => {
  // Return colors in the response
  const options = {
    colors: true
  }

  try {
    // Get details about the asset
    const result = await cloudinary.api.resource(publicId, options)
    // console.log(result)
    return result.colors
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

  return imageTag
}

/// ///////////////
//
// Main function
//
/// ///////////////
const userImageUpload = asyncHandler(async (path) => {
  // Set the image to upload
  // eslint-disable-next-line no-undef
  const imagePath = path

  // Upload the image
  const publicId = await uploadImage(imagePath)

  // Get the colors in the image
  const colors = await getAssetInfo(publicId)

  // Create an image tag, using two of the colors in a transformation
  const imageTag = await createImageTag(publicId, colors[0][0], colors[0][0])

  // Log the image tag to the console
  console.log(imageTag)
  // return tag
  return imageTag
})

module.exports = {
  userImageUpload,
  createImageTag,
  uploadImage,
  getAssetInfo
}
