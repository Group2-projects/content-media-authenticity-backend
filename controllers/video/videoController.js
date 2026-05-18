const fs = require('fs');
const crypto = require('crypto');
const Video = require('../../models/video/video');
const { extractVideoMetadata } = require('../../utils/metadataExtractor');
const { uploadLargeFileToS3 } = require('../../utils/s3Uploader');

/**
 * Get videos uploaded by a specific user
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserVideos = async (req,res)=>{
    const userId = req.body.user_id;
    try {
        const videos = await Video.find({ userId: userId });
        res.status(200).json({ videos: videos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Upload a new video
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No video file provided." });
        }

        const { title, description } = req.body;
        if (!title || !description) {
            // Cleanup local file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Title and description are required." });
        }

        // 1. Calculate SHA256 Hash
        const fileBuffer = fs.readFileSync(req.file.path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const sha256_hash = hashSum.digest('hex');

        // 2. Extract Metadata
        const metadata = await extractVideoMetadata(req.file.path);

        // 3. Upload to S3
        const s3Result = await uploadLargeFileToS3(req.file.path, req.file.originalname, req.file.mimetype);

        // 4. Save to Database
        const video = new Video({
            title,
            description,
            url: s3Result.url,
            s3_key: s3Result.s3_key,
            original_filename: req.file.originalname,
            mime_type: req.file.mimetype,
            file_size: req.file.size,
            userId: req.user._id, // Set by your authentication middleware
            sha256_hash,
            upload_status: 'completed',
            metadata
        });

        await video.save();

        // 5. Cleanup local file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: "Video uploaded successfully", video });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Video upload error:', error);
        res.status(500).json({ error: "An error occurred while uploading the video.", details: error.message });
    }
};
