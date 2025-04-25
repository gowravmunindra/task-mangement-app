const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs"); 
const jasonwt = require("jsonwebtoken");
//sign-in API
router.post("/sign-in",async(req,res)=>{
    try {
        const {username} =req.body;
        const {email} = req.body;
        const existinguser =await User.findOne({username: username});
        const existingEmail=await User.findOne({email:email});
        if(existinguser){
            return res.status(400).json({message: "Username already exists try another username"});
        }
        else if(username.length<4){
            return res.status(400).json({message: "Username should atleast have 4 characters"});
        }
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }
        const hashPassword = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password: hashPassword ,
        })

        await newUser.save();
        return res.status(200).json({message:"SignIn Successfully"});
    } 
    catch (error) {
        console.log(error);
        return res.status(400).json({message: "Internal Server Error"});
    }
});

//login
router.post("/log-in", async(req,res)=>{
    const {username, password} =req.body;
    const existinguser =await User.findOne({username: username});
    if(!existinguser){
        return res.status(400).json({message: "Invalid Credentials"});
    }
    bcrypt.compare(password, existinguser.password,(err,data)=>{
        if(data){
            const authClaims = [{name:username},{jti:jasonwt.sign({}, "tcm123")}];
            const token = jasonwt.sign({authClaims}, "tcm123",{expiresIn: "7d"});
            res.status(200).json({id:existinguser._id, token: token}); 
        }
        else{
            return res.status(400).json({message:"Invalid Credentials"});
        }
    })
}); 
module.exports=router;