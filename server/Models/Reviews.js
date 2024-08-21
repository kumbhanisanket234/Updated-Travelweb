const mongoose = require("mongoose")

const ReviewsSchema = new mongoose.Schema({
    imgURL: String,
    description:String,
    name:String,
    post:String,
    location: String,
}, { timestamps: true });

const ReviewsModel = mongoose.model('Reviews', ReviewsSchema);
module.exports = ReviewsModel;