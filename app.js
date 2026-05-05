require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const cors=require('cors');

const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const { sessionTimeout } = require('./middleware/auth');
const authRoutes= require('./routes/authRoutes');

//Mongoose connection here
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});



//Use of CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//Initialization of session here
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(sessionTimeout);

//Flash initialization here
app.use(flash());

//Passport initialization here
app.use(passport.initialize());
app.use(passport.session());


//Initialization of app routes here
app.use('/',authRoutes);

app.listen(process.env.PORT,()=>{   
    console.log(`Server is running on port ${process.env.PORT}`);
});
