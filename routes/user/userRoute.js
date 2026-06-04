const express=require('express');
const {
    getUserProfile,
    updateProfile
} = require('../../controllers/user/userController');
const { getUserVideos } = require('../../controllers/video/videoController');
const {
    isAuthenticated
} = require('../../middleware/auth');   

const router=express.Router();

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile
 *     description: Retrieve the profile information of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
//Get the user profile
router.get('/api/user/:id', isAuthenticated, async (req, res) => {
    await getUserProfile(req, res);
});

//Update the user profile
/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user profile
 *     description: Update the profile information of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid request
 */
router.put('/api/user/:id', isAuthenticated, async (req, res) => {
    await updateProfile(req, res);
});

/**
 * @openapi
 * /api/videos:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user videos
 *     description: Retrieve the videos uploaded by a user.
 *     responses:
 *       200:
 *         description: User videos retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/api/user/videos', isAuthenticated, async(req,res)=>{
    console.log("Fetching videos for user with data:", req.body);
    await getUserVideos(req,res);
});
module.exports = router;
