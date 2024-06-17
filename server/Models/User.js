const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    confirmPassword: String,
    token: {
        type: String,
        default: null
    },
    googleId: String,
    facebookId: String,
    githubId: String,
    linkedinId: String,
    microsoftId: String,
    fullName: String,
    image: String,
    googleEmail: String,
    facebookEmail: String,
    linkedinEmail: String,
    microsoftEmail: String,
    verified:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

const UserModel = mongoose.model("Users", UserSchema)

module.exports = UserModel;
