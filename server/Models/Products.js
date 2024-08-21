const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    city: String,
    country: String,
    imgURL: String,
    cutoutPrice: Number,
    price: Number,
    rating: Number,
}, { timestamps: true });

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;