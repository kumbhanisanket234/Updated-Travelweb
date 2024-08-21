const mongoose = require('mongoose');

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
    fullName: String,
    image: String,
    googleEmail: String,
    facebookEmail: String,
    favoriteProducts: []
}, { timestamps: true });

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
