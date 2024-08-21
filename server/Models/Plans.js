const mongoose = require("mongoose")

const PlansSchema = new mongoose.Schema({
    location: String,
    imgURL: String,
    duration:Number,
    price: Number,
    rating: Number,
}, { timestamps: true });

const PlansModel = mongoose.model('Plans', PlansSchema);
module.exports = PlansModel;