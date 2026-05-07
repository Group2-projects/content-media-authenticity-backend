const express = require('express');
const router= express.Router();
const {
    settings,
    updateSettings
}=require('../../controllers/settings/settingsController');

//Only the admin can access this route
router.get('/api/settings', async (req, res)=>{
    await settings(req, res);
});

//Put the changes of settings   
router.put('/api/settings', async (req, res) => {
    await updateSettings(req, res);
});

module.exports = router;