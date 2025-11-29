const { upload } = require("../middleware/multer");
const { uploadImage } = require("../controllers/uploadController");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     description: Accepts an image file and uploads it to Cloudinary. Returns the image URL and public_id.
 *     tags:
 *       - Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary secure URL
 *                 public_id:
 *                   type: string
 *                   description: Cloudinary image public ID
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Cloudinary upload failed
 */
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;