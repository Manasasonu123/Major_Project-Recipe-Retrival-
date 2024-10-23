const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    fullName:String,
    userName:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    predicted_food: {
        type: [String], // Array of strings to store predicted food labels
        default: [],    // Initialize as an empty array
      },
})

const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;