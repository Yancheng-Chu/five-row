const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    account:{
        type:String
    },
    password:{
        type:String
    },
    flag:{
        type:String
    }
}) 

const login = mongoose.model("Users",loginSchema)

const profileSchema = new mongoose.Schema({
    userInfo:{
        type:Object
    },
    account:{
        type:String
    },
    img:{
        type:String
    }
}) 

const profile = mongoose.model("ctfList",profileSchema)

// login.create({
//     _id:'11111',
//     account:'www',
//     userInfo:'char'
// })

module.exports = {
    login,
    profile
}