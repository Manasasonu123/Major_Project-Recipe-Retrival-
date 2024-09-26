const User = require('../models/user')
const {hashPassword,comparePassword} =require('../helpers/auth')

const test = (req,res) => {
    res.json('test is working')

}
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
module.exports = {
    test,
    registerUser
}