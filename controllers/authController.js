const Joi = require('@hapi/joi');
const User = require('../models/user');
const bcrypt = require('bcrypt');


exports.registerUser= async (req,res)=>{
    // if(){
    //     return res.status(400).json({ error: "Invalid request body" });
    // }

    const registerSchema = Joi.object({
        first_name: Joi.string().min(2).max(100).required(),
        last_name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        dob: Joi.date().max('now').required(),
        phone: Joi.string().min(10).max(15).required(),
        password: Joi.string().min(8).required()
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            dob: req.body.dob,
            phone: req.body.phone,
            password: hashedPassword
        });

        const user = await newUser.save();
        return res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        return res.status(500).json({ error: "Error registering user", details: err.message || err });
    }
};
