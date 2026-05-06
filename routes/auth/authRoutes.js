const express= require('express');
const { registerUser, login }= require('../../controllers/auth/authController.js');

const router = express.Router();

// ensure JSON request bodies are parsed for routes in this router
// router.use(express.json());

router.post('/api/register', (req, res) => {
    console.log("Registering user with data:", req.body);
    registerUser(req, res);
});

router.post('/api/login', async (req, res) => {
    console.log("Logging in user with data:", req.body);
    await login(req, res);
});

module.exports = router;

