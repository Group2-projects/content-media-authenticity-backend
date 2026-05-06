const express=require('express');
const {
    getUserProfile
} = require('../../controllers/user/userController');

const router=express.Router();

router.get('/api/user/:id', async (req, res) => {
    await getUserProfile(req, res);
});

module.exports = router;
