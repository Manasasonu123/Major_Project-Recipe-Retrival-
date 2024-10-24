const User = require('../models/user')
const {hashPassword,comparePassword} =require('../helpers/auth')
const jwt = require('jsonwebtoken');


const test = (req,res) => {
    res.json('test is working')

}

//Register end point
const registerUser=async(req,res)=>{
    try{
        const {fullName,userName,email,password} = req.body;
        // Check if name was enters
        if(!fullName){
            return res.json({
                error:'name is required'
            })
        };
        //Check if password is good
        if(!password || password.length < 6){
            return res.json({
                error:'password is required and should be at least 6 character long'
            })
        };
        //check email in db
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error:'Email is taken already'
            })
        }
        
        
        const exist1 = await User.findOne({userName});
        if(exist1){
            return res.json({
                error:'Username is taken already'
            })
        }

        const hashedPassword = await hashPassword(password)
        //check username in db
        const user = await User.create({
            fullName,userName,email,password:hashedPassword,
        })

        return res.json(user)
    } catch (error){
        console.log(error)
    }
}

//login end point
const loginUser = async (req,res)=>{
try{
    const {userName,password}=req.body;
    //check if user exists
    const user = await User.findOne({userName});
    if(!user){
        return res.json({
            error: 'No user found'
        })
    }

    // check if password match
    const match = await comparePassword(password, user.password)
    if(match){
        const predicted_value = user.predicted_value || ''; // Assuming it's part of the user schema
        jwt.sign({userName:user.userName,id:user._id,fullName:user.fullName,predicted_value},process.env.JWT_SECRET,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json(user)
        })
    }
    if(!match){
        res.json({
            error:'Password do not match'
        })
    }
} catch (error) {
    console.log(error)
}
}

const getProfile=(req,res)=>{
    const {token} = req.cookies
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err,decoded)=>{
            if(err) throw err;
            res.json({
                userName: decoded.userName,
                id: decoded.id,
                fullName: decoded.fullName,
                predicted_value: decoded.predicted_value, // Add this to return it
                iat: decoded.iat
            });
        })
    } else{
        res.json(null)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
};