const mongoose=require('mongoose');

const videoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authenticity_score: {
        type: Number, 
        default: 0
    }
});

const Video=mongoose.model('Video',videoSchema);
module.exports=Video;
