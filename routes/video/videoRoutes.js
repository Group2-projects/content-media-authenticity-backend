const express = require('express');
const router = express.Router();
const { uploadVideo } = require('../../controllers/video/videoController');
const { isAuthenticated } = require('../../middleware/auth');   
const { uploadMiddleware } = require('../../middleware/videoUpload');


/**
 * @openapi
 * /api/videos/upload:
 *   post:
 *     tags:
 *       - Video
 *     summary: Upload a video
 *     description: Upload a video file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                type: string
 *                format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: Invalid request
 */
router.post('/api/videos/upload', isAuthenticated, uploadMiddleware, uploadVideo);

module.exports = router;