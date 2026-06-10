const { User } = require('../../models/user/user');
const Joi = require('joi');
const mongoose=require('mongoose');

/**
 * Fetches the user profile for a given user ID.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getUserProfile= async (req,res)=>{
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching user profile", details: error.message });
    }
};

/**
 * Updates the user profile for a given user ID.
 * @param {*} req 
 * @param {*} res 
 */
exports.updateProfile = async(req, res) => {
    const userId = req.params.id.trim();
    console.log(`[UpdateProfile] Received update request for user ID: ${userId} with data:`, req.body);
    if(!userId){ 
        return res.status(400).json({ error: "User ID is required" });
    }

    if(req.body==undefined){
        return res.status(400).json({ error: "Invalid request body" });
    }

    const registerSchema = Joi.object({
        first_name: Joi.string().min(2).max(100).required(),
        last_name: Joi.string().min(2).max(100).required(),
        // email: Joi.string().email().required(),
        dob: Joi.date().max('now').required(),
        phone: Joi.string().min(10).max(15).required(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const updateData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        // email: req.body.email,
        dob: req.body.dob,
        phone: req.body.phone,
    };

    try {   
        const user = await User.findByIdAndUpdate(userId, updateData, { returnDocument : 'after' });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Error updating user profile", details: error.message });
    }
}