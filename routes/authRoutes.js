const express= require('express');
const { registerUser }= require('../controllers/authController.js');

const router = express.Router();

// ensure JSON request bodies are parsed for routes in this router
// router.use(express.json());

router.post('/api/register', (req, res) => {
    console.log("Registering user with data:", req.body);
    registerUser(req, res);
});

module.exports = router;

