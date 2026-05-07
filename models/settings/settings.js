const mongoose= require('mongoose');

const settingsSchema= new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: [String],
        required: true
    },
    created_by: {
        type: String,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Settings= mongoose.model('Settings', settingsSchema);
module.exports= Settings;
