const express= require('express');
const passport = require('passport');
const { registerUser, login, googleLoginSuccess }= require('../../controllers/auth/authController.js');
const { isAuthenticated }= require('../../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /api/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Register a new user with the provided information.
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
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */
router.post('/api/register', async (req, res) => {
    console.log("Registering user with data:", req.body);
    await registerUser(req, res);
});

//For login
/**
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login an existing user
 *     description: Login an existing user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/api/login', async (req, res) => {
    console.log("Logging in user with data:", req.body);
    await login(req, res);
});

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Authenticate with Google
 *     description: Redirects the user to Google for authentication.
 */
router.get('/api/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google authentication callback
 *     description: Handles the callback from Google after authentication.
 */
router.get('/api/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: true }, async (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                error: 'Google authentication failed',
                details: info && info.message ? info.message : 'No user returned'
            });
        }

        req.logIn(user, async (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            req.user = user;
            await googleLoginSuccess(req, res);
        });
    })(req, res, next);
});

/**
 * @openapi
 * /api/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout the current user
 *     description: Logs out the current user and ends the session.
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
router.post('/api/logout', isAuthenticated, async (req, res) => {
    console.log("Logging out user");
    await logout(req, res);
});

module.exports = router;

