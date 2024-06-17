const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
})

const UserOtpVerification = mongoose.model(
    "UserOtpVerification",
    UserVerificationSchema
)

module.exports = UserOtpVerification;