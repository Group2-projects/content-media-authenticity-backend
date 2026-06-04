const express = require('express');
const router= express.Router();
const {
    settings,
    updateSettings
}=require('../../controllers/settings/settingsController');

const {
    isAuthenticated,
    isAdmin
} = require('../../middleware/auth');

//Only the admin can access this route
/**
 * @openapi
 * /api/settings:
 *   get:
 *     tags:
 *       - Admin Settings
 *     summary: Get settings
 *     description: Retrieve the current settings.
     */
router.get('/api/settings', isAuthenticated, isAdmin, async (req, res)=>{
    await settings(req, res);
});

//Put the changes of settings
/**
 * @openapi
 * /api/settings:
 *   put:
 *     tags:
 *       - Admin Settings
 *     summary: Update settings
 *     description: Update the current settings.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid request
 */
router.put('/api/settings', isAuthenticated, isAdmin, async (req, res) => {
    await updateSettings(req, res);
});

module.exports = router;